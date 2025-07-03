import os
import re
import argparse
import http.client
import threading
import time
import random
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

EXTERNAL_LINK_REGEX = re.compile(r'\[.*?\]\((https?://[^\s)]+)\)')
INTERNAL_LINK_REGEX = re.compile(r'\[.*?\]\(([^)]+)\)')

print_lock = threading.Lock()

DEFAULT_PATH = "src/content"
DEFAULT_TIMEOUT = 15
DEFAULT_THREADS = 5
DEFAULT_DELAY = 1.0

# Terminal color codes for prettier output
class TerminalColors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

total_links_checked = 0
total_internal_links_checked = 0
broken_links = []
broken_internal_links = []
redirect_warnings = []
rate_limit_delays = {}

def get_realistic_headers():
    """Generate realistic browser headers with some randomization"""
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15"
    ]
    
    return {
        "User-Agent": random.choice(user_agents),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0"
    }

def apply_rate_limiting(domain, delay):
    """Apply rate limiting with exponential backoff for specific domains"""
    current_time = time.time()
    
    if domain in rate_limit_delays:
        time_since_last = current_time - rate_limit_delays[domain]['last_request']
        required_delay = rate_limit_delays[domain]['delay']
        
        if time_since_last < required_delay:
            sleep_time = required_delay - time_since_last
            time.sleep(sleep_time)
    
    if domain not in rate_limit_delays:
        rate_limit_delays[domain] = {'delay': delay, 'last_request': current_time}
    else:
        rate_limit_delays[domain]['last_request'] = time.time()

def handle_rate_limit_response(domain, response):
    """Handle 429 responses with proper retry-after logic"""
    retry_after = response.getheader("Retry-After")
    if retry_after:
        try:
            delay = int(retry_after)
        except ValueError:
            delay = 60
    else:
        current_delay = rate_limit_delays.get(domain, {}).get('delay', 1)
        delay = min(current_delay * 2, 300)
    
    rate_limit_delays[domain] = {
        'delay': delay,
        'last_request': time.time()
    }
    
    return delay

def extract_links_from_file(filepath):
    """Extract both external and internal links from a file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get external links (http/https)
    external_links = EXTERNAL_LINK_REGEX.findall(content)
    
    # Get all links, then filter out external ones to get internal links
    all_links = INTERNAL_LINK_REGEX.findall(content)
    internal_links = [link for link in all_links if not link.startswith(('http://', 'https://'))]
    
    return external_links, internal_links

def check_internal_link(link, source_file, root_path):
    """Check if an internal link exists"""
    global total_internal_links_checked
    
    # Skip anchor-only links and mailto/tel links
    if link.startswith('#') or link.startswith(('mailto:', 'tel:')):
        return link, True, "anchor/special"
    
    # Handle anchor links with paths
    path_part = link.split('#')[0] if '#' in link else link
    
    if not path_part:  # Just an anchor link
        return link, True, "anchor"
    
    # Convert relative path to absolute
    source_dir = os.path.dirname(source_file)
    
    if path_part.startswith('/'):
        # Absolute path from root
        target_path = os.path.join(root_path, path_part.lstrip('/'))
    else:
        # Relative path from current file
        target_path = os.path.join(source_dir, path_part)
    
    # Normalize the path
    target_path = os.path.normpath(target_path)
    
    # Check if it's a directory (might need index.html or similar)
    if os.path.isdir(target_path):
        # Check for common index files
        index_files = ['index.html', 'index.md', 'index.mdx']
        for index_file in index_files:
            if os.path.exists(os.path.join(target_path, index_file)):
                return link, True, "directory_with_index"
        return link, False, "directory_no_index"
    
    # Check if file exists
    if os.path.exists(target_path):
        return link, True, "file_exists"
    
    # Try with common extensions if no extension provided
    if not os.path.splitext(target_path)[1]:
        extensions = ['.html', '.md', '.mdx']
        for ext in extensions:
            if os.path.exists(target_path + ext):
                return link, True, f"file_exists_with_{ext}"
    
    return link, False, "file_not_found"

def check_external_link(url, timeout, delay):
    """Check external link"""
    parsed = urlparse(url)
    domain = parsed.netloc
    conn_cls = http.client.HTTPSConnection if parsed.scheme == "https" else http.client.HTTPConnection
    redirects = 0
    visited = set()
    
    apply_rate_limiting(domain, delay)

    while redirects < 5:
        host = parsed.netloc
        path = parsed.path or "/"
        if parsed.query:
            path += "?" + parsed.query
        
        try:
            conn = conn_cls(host, timeout=timeout)
            headers = get_realistic_headers()
            
            try:
                conn.request("HEAD", path, headers=headers)
                response = conn.getresponse()
                status = response.status
                
                if status in (405, 501, 404) and redirects == 0:
                    conn.close()
                    conn = conn_cls(host, timeout=timeout)
                    conn.request("GET", path, headers=headers)
                    response = conn.getresponse()
                    status = response.status
                    
            except Exception:
                conn.close()
                conn = conn_cls(host, timeout=timeout)
                conn.request("GET", path, headers=headers)
                response = conn.getresponse()
                status = response.status
            
            location = response.getheader("Location")
            
            if status == 429:
                delay = handle_rate_limit_response(domain, response)
                conn.close()
                time.sleep(delay)
                continue
            
            conn.close()

            if status in (301, 302, 303, 307, 308) and location:
                if location in visited:
                    return url, status, True
                visited.add(location)
                
                if location.startswith('/'):
                    location = f"{parsed.scheme}://{parsed.netloc}{location}"
                elif not location.startswith('http'):
                    location = f"{parsed.scheme}://{parsed.netloc}/{location}"
                
                parsed = urlparse(location)
                redirects += 1
                time.sleep(0.5)
                continue

            return url, status, redirects > 0

        except Exception:
            return url, 0, False

    return url, 0, True

def process_file(filepath, timeout, ci_mode, threads, delay, root_path, check_internal, check_external):
    global total_links_checked, total_internal_links_checked
    
    external_links, internal_links = extract_links_from_file(filepath)
    
    if not ci_mode:
        with print_lock:
            print(f"{TerminalColors.HEADER}Checking {filepath}:{TerminalColors.ENDC}")
            if check_external:
                print(f"  External links: {len(external_links)}")
            if check_internal:
                print(f"  Internal links: {len(internal_links)}")

    # Check external links
    if check_external and external_links:
        with ThreadPoolExecutor(max_workers=threads) as executor:
            futures = {executor.submit(check_external_link, link, timeout, delay): link for link in external_links}
            for future in as_completed(futures):
                url, status, redirected = future.result()
                with print_lock:
                    total_links_checked += 1
                    if status == 0:
                        broken_links.append((filepath, url, "Connection Failed"))
                        if not ci_mode:
                            print(f"  {TerminalColors.FAIL}[CONNECTION FAILED]{TerminalColors.ENDC} {url}")
                    elif status >= 400:
                        broken_links.append((filepath, url, status))
                        if not ci_mode:
                            print(f"  {TerminalColors.FAIL}[ERROR {status}]{TerminalColors.ENDC} {url}")
                    elif redirected:
                        redirect_warnings.append((filepath, url, status))
                        if not ci_mode:
                            print(f"  {TerminalColors.WARNING}[REDIRECT {status}]{TerminalColors.ENDC} {url}")
                    elif not ci_mode:
                        print(f"  {TerminalColors.OKGREEN}[OK {status}]{TerminalColors.ENDC} {url}")

    # Check internal links
    if check_internal and internal_links:
        for link in internal_links:
            url, exists, reason = check_internal_link(link, filepath, root_path)
            with print_lock:
                total_internal_links_checked += 1
                if not exists:
                    broken_internal_links.append((filepath, url, reason))
                    if not ci_mode:
                        print(f"  {TerminalColors.FAIL}[INTERNAL BROKEN]{TerminalColors.ENDC} {url} ({reason})")
                elif not ci_mode and reason not in ["anchor", "anchor/special"]:
                    print(f"  {TerminalColors.OKCYAN}[INTERNAL OK]{TerminalColors.ENDC} {url}")

def find_md_and_mdx_files(start_path):
    md_files = []
    for root, _, files in os.walk(start_path):
        for name in files:
            if name.endswith(".md") or name.endswith(".mdx"):
                md_files.append(os.path.join(root, name))
    return md_files

def main():
    parser = argparse.ArgumentParser(description="Check external and internal links in .md and .mdx files.")
    parser.add_argument("--path", "-p", default=DEFAULT_PATH, help="Root path to search for files")
    parser.add_argument("--timeout", "-t", type=int, default=DEFAULT_TIMEOUT, help="Timeout per request (seconds)")
    parser.add_argument("--threads", "-j", type=int, default=DEFAULT_THREADS, help="Number of threads")
    parser.add_argument("--delay", "-d", type=float, default=DEFAULT_DELAY, help="Delay between requests (seconds)")
    parser.add_argument("--ci", action="store_true", help="CI-friendly output (summary only)")
    parser.add_argument("--external-only", action="store_true", help="Check only external links")
    parser.add_argument("--internal-only", action="store_true", help="Check only internal links")
    args = parser.parse_args()

    # Determine what to check
    check_external = not args.internal_only
    check_internal = not args.external_only

    start_time = time.time()
    files = find_md_and_mdx_files(args.path)
    root_path = os.path.abspath(args.path)

    if not args.ci:
        print(f"{TerminalColors.BOLD}Link Checker Starting...{TerminalColors.ENDC}")
        print(f"Checking: {'External' if check_external else ''}{' & ' if check_external and check_internal else ''}{'Internal' if check_internal else ''} links")
        if check_external:
            print(f"Rate limiting: {args.delay}s delay between requests")
            print(f"Threads: {args.threads}, Timeout: {args.timeout}s")
        print()

    for filepath in files:
        process_file(filepath, args.timeout, args.ci, args.threads, args.delay, root_path, check_internal, check_external)

    elapsed = time.time() - start_time
    print()

    if args.ci:
        if check_external:
            print(f"Checked {total_links_checked} external links")
        if check_internal:
            print(f"Checked {total_internal_links_checked} internal links")
        print(f"in {len(files)} files")
        
        if broken_links:
            print(f"❌ {len(broken_links)} broken external links:")
            for file, url, code in broken_links:
                print(f"{file}: {url} => {code}")
        
        if broken_internal_links:
            print(f"❌ {len(broken_internal_links)} broken internal links:")
            for file, url, reason in broken_internal_links:
                print(f"{file}: {url} => {reason}")
        
        if not broken_links and not broken_internal_links:
            print("✅ No broken links found.")

        if redirect_warnings:
            print(f"⚠️ {len(redirect_warnings)} redirected external links:")
            for file, url, code in redirect_warnings:
                print(f"{file}: {url} => {code}")
    else:
        print(f"{TerminalColors.BOLD}Summary:{TerminalColors.ENDC}")
        if check_external:
            print(f"Checked {total_links_checked} external links", end="")
        if check_internal:
            if check_external:
                print(f" and {total_internal_links_checked} internal links", end="")
            else:
                print(f"Checked {total_internal_links_checked} internal links", end="")
        print(f" in {len(files)} files in {elapsed:.2f}s")
        
        if check_external:
            print(f"  {TerminalColors.FAIL}❌ {len(broken_links)} broken external links{TerminalColors.ENDC}")
            print(f"  {TerminalColors.WARNING}⚠️ {len(redirect_warnings)} redirected external links{TerminalColors.ENDC}")
        
        if check_internal:
            print(f"  {TerminalColors.FAIL}❌ {len(broken_internal_links)} broken internal links{TerminalColors.ENDC}")
        
        # Show detailed broken external links
        if broken_links:
            print(f"\n{TerminalColors.FAIL}{TerminalColors.BOLD}Broken external links:{TerminalColors.ENDC}")
            for file, url, code in broken_links:
                print(f"{TerminalColors.FAIL}{file}: {url} => {code}{TerminalColors.ENDC}")
        
        # Show detailed broken internal links
        if broken_internal_links:
            print(f"\n{TerminalColors.FAIL}{TerminalColors.BOLD}Broken internal links:{TerminalColors.ENDC}")
            for file, url, reason in broken_internal_links:
                print(f"{TerminalColors.FAIL}{file}: {url} => {reason}{TerminalColors.ENDC}")
        
        # Show detailed redirect warnings
        if redirect_warnings:
            print(f"\n{TerminalColors.WARNING}{TerminalColors.BOLD}Redirected external links:{TerminalColors.ENDC}")
            for file, url, code in redirect_warnings:
                print(f"{TerminalColors.WARNING}{file}: {url} => {code}{TerminalColors.ENDC}")

if __name__ == "__main__":
    main()
