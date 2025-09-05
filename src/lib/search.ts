import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";

type Post = {
  title: string;
  tags?: string[];
  path: string;
};

let fuse: Fuse<Post> | null = null;
let posts: Post[] = [];

async function loadIndex() {
  const res = await fetch("/search-index.json");
  const data = await res.json();
  posts = data.posts as Post[];

  fuse = new Fuse(posts, {
    // keys must match the JSON fields you emit
    keys: ["title", "tags"],
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
    // minMatchCharLength: 3,
  });
}

function renderResults(results: FuseResult<Post>[]) {
  const container = document.getElementById("search-results");
  if (!container) return;

  if (!results.length) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  container.innerHTML = results
    .map(
      (res) => `
      <div class="mb-4">
        <a href="${res.item.path}" class="text-blue-600 hover:underline">
          <h2>${res.item.title}</h2>
        </a>
        ${
          res.item.tags?.length
            ? `<p class="text-sm text-gray-500">Tags: ${res.item.tags.join(", ")}</p>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

function runSearch(query: string) {
  const container = document.getElementById("search-results");
  if (!container) return;

  if (!query || query.trim().length < 2) {
    container.innerHTML = "";
    return;
  }

  if (!fuse) return; // not ready yet

  const results = fuse.search(query.trim());
  renderResults(results);
}

function getQueryParam(name: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || "";
}

export async function initSearch() {
  await loadIndex();

  const input = document.getElementById("search-input") as HTMLInputElement | null;
  if (!input) return;

  // prefill from ?q= if present
  const initial = getQueryParam("q");
  if (initial) {
    input.value = initial;
    runSearch(initial);
  }

  // debounce
  let t: number | undefined;
  input.addEventListener("input", (e) => {
    const value = (e.target as HTMLInputElement).value;
    window.clearTimeout(t);
    t = window.setTimeout(() => runSearch(value), 200);
  });
}

// auto-init on load
document.addEventListener("DOMContentLoaded", () => {
  initSearch();
});
