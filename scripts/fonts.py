#!/usr/bin/env python3
"""
Font Subsetting Script
Automatically subsets fonts based on text content found in build files.
"""

import sys
import subprocess
import shutil
from pathlib import Path
import re

# Configuration
BUILD_DIR = "./dist"
FONTS_DIR = "./public/fonts"
DIST_FONTS_DIR = "./dist/fonts"

class FontSubsetter:
    def __init__(self):
        self.total_original = 0
        self.total_subset = 0
        self.fonts_processed = 0
        
    def check_and_install_dependencies(self):
        """Check and install required Python packages."""
        try:
            import fontTools
            import brotli
            print("✅ All dependencies are ready")
            return True
        except ImportError:
            print("📦 Installing required Python packages (fonttools, brotli)...")
            try:
                subprocess.run([sys.executable, "-m", "pip", "install", "fonttools", "brotli"], 
                             check=True, capture_output=True)
                # Verify installation
                import fontTools
                import brotli
                print("✅ Dependencies installed successfully")
                return True
            except (subprocess.CalledProcessError, ImportError) as e:
                print(f"❌ Failed to install dependencies: {e}")
                return False
    
    def format_bytes(self, bytes_size: int) -> str:
        """Format bytes to human readable format."""
        if bytes_size >= 1048576:  # 1MB
            return f"{bytes_size // 1048576}MB"
        elif bytes_size >= 1024:  # 1KB
            return f"{bytes_size // 1024}KB"
        else:
            return f"{bytes_size}B"
    
    def extract_text_content(self) -> str:
        """Extract text content from build files."""
        print("🔍 Scanning build files for text content...")
        
        build_path = Path(BUILD_DIR)
        if not build_path.exists():
            print(f"⚠️  Build directory '{BUILD_DIR}' not found. Please run 'npm run build' first.")
            sys.exit(1)
        
        # File extensions to scan
        extensions = ['.html', '.js', '.css', '.astro', '.md', '.mdx']
        
        all_text = ""
        file_count = 0
        
        for ext in extensions:
            for file_path in build_path.rglob(f"*{ext}"):
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        all_text += content
                        file_count += 1
                except Exception as e:
                    print(f"⚠️  Could not read {file_path}: {e}")
                    continue
        
        # Clean up the text
        # Remove HTML tags
        all_text = re.sub(r'<[^>]*>', '', all_text)
        
        # Remove JavaScript/CSS comments
        all_text = re.sub(r'//.*', '', all_text)
        all_text = re.sub(r'/\*.*?\*/', '', all_text, flags=re.DOTALL)
        
        # Keep only printable characters and common symbols
        cleaned_text = ''.join(char for char in all_text if char.isprintable() or char.isspace())
        
        # Get unique characters
        unique_chars = ''.join(sorted(set(cleaned_text)))
        
        print(f"📝 Extracted {len(unique_chars)} unique characters from {file_count} files")
        return unique_chars
    
    def create_subset_and_replace(self, font_path: Path, text_content: str) -> bool:
        """Create a subset of the given font and replace the original in dist."""
        font_name = font_path.name
        name_without_ext = font_path.stem
        extension = font_path.suffix
        
        # Find the corresponding font in the dist directory
        dist_font_path = Path(DIST_FONTS_DIR) / font_name
        
        if not dist_font_path.exists():
            print(f"⚠️  Font not found in dist: {dist_font_path}")
            return False
        
        # Create temporary subset file
        temp_subset_path = Path("/tmp") / f"{name_without_ext}.subset{extension}"
        
        print(f"\n🔧 Processing: {font_name}")
        
        if not font_path.exists():
            print(f"❌ Font file not found: {font_path}")
            return False
        
        # Get original size
        original_size = font_path.stat().st_size
        if original_size == 0:
            print(f"❌ Cannot read original font file: {font_path}")
            return False
        
        # Create temporary text file
        temp_text_file = Path("/tmp/text_content.txt")
        try:
            with open(temp_text_file, 'w', encoding='utf-8') as f:
                f.write(text_content)
        except Exception as e:
            print(f"❌ Could not create temporary text file: {e}")
            return False
        
        # Try pyftsubset command first
        success = False
        try:
            cmd = [
                "pyftsubset", str(font_path),
                f"--output-file={temp_subset_path}",
                f"--text-file={temp_text_file}",
                "--layout-features=*",
                "--flavor=woff2",
                "--desubroutinize",
                "--no-hinting",
                "--drop-tables+=DSIG"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                success = True
            else:
                print("🔄 Trying alternative method...")
                # Fallback to python module
                cmd = [
                    sys.executable, "-m", "fontTools.subset", str(font_path),
                    f"--output-file={temp_subset_path}",
                    f"--text-file={temp_text_file}",
                    "--layout-features=*",
                    "--flavor=woff2",
                    "--desubroutinize",
                    "--no-hinting",
                    "--drop-tables+=DSIG"
                ]
                
                result = subprocess.run(cmd, capture_output=True, text=True)
                if result.returncode == 0:
                    success = True
                    
        except FileNotFoundError:
            print("🔄 pyftsubset not found, using python module...")
            # Direct python module call
            cmd = [
                sys.executable, "-m", "fontTools.subset", str(font_path),
                f"--output-file={temp_subset_path}",
                f"--text-file={temp_text_file}",
                "--layout-features=*",
                "--flavor=woff2",
                "--desubroutinize",
                "--no-hinting",
                "--drop-tables+=DSIG"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                success = True
        
        # Clean up temp text file
        try:
            temp_text_file.unlink()
        except:
            pass
        
        if not success:
            print(f"❌ Font subsetting failed for: {font_name}")
            if result.stderr:
                print(f"   Error: {result.stderr.strip()}")
            return False
        
        # Check if subset was created successfully
        if not temp_subset_path.exists():
            print(f"❌ Failed to create subset file: {temp_subset_path}")
            return False
        
        subset_size = temp_subset_path.stat().st_size
        if subset_size == 0:
            print(f"❌ Subset file is empty: {temp_subset_path}")
            temp_subset_path.unlink()
            return False
        
        # Replace the original font in dist with the subset
        try:
            shutil.move(str(temp_subset_path), str(dist_font_path))
            print(f"✅ Replaced: {dist_font_path}")
        except Exception as e:
            print(f"❌ Failed to replace font file: {e}")
            temp_subset_path.unlink()
            return False
        
        # Calculate savings
        original_formatted = self.format_bytes(original_size)
        subset_formatted = self.format_bytes(subset_size)
        reduction = 100 - (subset_size * 100 // original_size) if original_size > 0 else 0
        saved_bytes = original_size - subset_size
        saved_formatted = self.format_bytes(saved_bytes)
        
        print(f"   📊 Size: {original_formatted} → {subset_formatted} (saved {saved_formatted}, {reduction}% reduction)")
        
        # Track totals
        self.total_original += original_size
        self.total_subset += subset_size
        self.fonts_processed += 1
        
        return True
    
    def run(self):
        """Main execution function."""
        print("🚀 Font Subsetting Script")
        print("=========================")
        
        print("\n🔍 Checking dependencies...")
        if not self.check_and_install_dependencies():
            sys.exit(1)
        
        print()
        text_content = self.extract_text_content()
        
        print("\n⚡ Creating font subsets and replacing originals...")
        
        # Process all font files
        fonts_dir = Path(FONTS_DIR)
        font_extensions = ['.woff2', '.woff', '.ttf', '.otf']
        
        for ext in font_extensions:
            for font_path in fonts_dir.glob(f"*{ext}"):
                self.create_subset_and_replace(font_path, text_content)
        
        print("\n🧹 Cleaning up temporary files...")
        # Clean up any remaining temp files
        temp_files = Path("/tmp").glob("*.subset.*")
        for temp_file in temp_files:
            try:
                temp_file.unlink()
            except:
                pass
        
        # Summary
        print("\n📈 Summary")
        print("==========")
        if self.fonts_processed > 0:
            total_original_formatted = self.format_bytes(self.total_original)
            total_subset_formatted = self.format_bytes(self.total_subset)
            total_saved = self.total_original - self.total_subset
            total_saved_formatted = self.format_bytes(total_saved)
            total_reduction = 100 - (self.total_subset * 100 // self.total_original) if self.total_original > 0 else 0
            
            print(f"✅ Processed {self.fonts_processed} font(s)")
            print(f"📊 Total size: {total_original_formatted} → {total_subset_formatted}")
            print(f"💾 Total saved: {total_saved_formatted} ({total_reduction}% reduction)")
            print(f"📁 Subsetted fonts replaced originals in: {DIST_FONTS_DIR}")
        else:
            print("❌ No fonts were processed successfully")
            print(f"🔍 Check that fonts exist in: {FONTS_DIR}")
            print(f"🔍 Check that built fonts exist in: {DIST_FONTS_DIR}")

if __name__ == "__main__":
    subsetter = FontSubsetter()
    subsetter.run()
