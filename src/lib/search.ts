import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";

type Post = {
  title: string;
  tags?: string[];
  path: string;
};

let fuse: Fuse<Post> | null = null;
let posts: Post[] = [];

/** Load the JSON index and build Fuse */
async function loadIndex() {
  try {
    const res = await fetch("/search-index.json");
    const data = await res.json();
    posts = (data.posts || []) as Post[];

    // defensive: ensure tags are arrays
    posts = posts.map((p) => ({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags : (p.tags ? String(p.tags).split(",").map(s => s.trim()) : []),
    }));

    fuse = new Fuse(posts, {
      keys: ["title", "tags"],
      includeScore: true,
      threshold: 0.32,      // fairly strict; tweak to taste (0.0 exact, 1.0 very fuzzy)
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    // debug
    // console.debug("Search index loaded:", posts.length);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to load search index:", err);
  }
}

/** Render fuse results into the modal `#results` container */
function renderResults(results: FuseResult<Post>[]) {
  const container = document.getElementById("results");
  if (!container) return;

  if (!results || results.length === 0) {
    container.innerHTML = `<p class="text-center text-muted-foreground py-6">No results found.</p>`;
    return;
  }

  container.innerHTML = results
    .map((r) => {
      const tagsHtml = r.item.tags && r.item.tags.length
        ? `<p class="text-sm text-muted-foreground mt-1">Tags: ${r.item.tags.map(t => `<span class="inline-block mr-2">${t}</span>`).join("")}</p>`
        : "";
      return `
        <a href="${r.item.path}" class="block px-4 py-3 rounded-lg hover:bg-muted transition border-b border-border">
          <div class="text-lg font-medium text-primary">${r.item.title}</div>
          ${tagsHtml}
        </a>
      `;
    })
    .join("");
}

/** Run a query through fuse and render */
function runSearch(query: string) {
  const container = document.getElementById("results");
  if (!container) return;

  const q = query.trim();
  if (!q || q.length < 2) {
    container.innerHTML = "";
    return;
  }

  if (!fuse) return;
  const results = fuse.search(q);
  renderResults(results);
}

/** Modal open/close (animations) */
function openModal() {
  const modal = document.getElementById("search-modal");
  const box = document.getElementById("search-box");
  const input = document.getElementById("search-input") as HTMLInputElement | null;
  if (!modal || !box || !input) return;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    modal.style.opacity = "1";
    box.classList.remove("scale-95", "opacity-0");
    box.classList.add("scale-100", "opacity-100");
  });
  input.focus();
  input.select();
}

function closeModal() {
  const modal = document.getElementById("search-modal");
  const box = document.getElementById("search-box");
  const input = document.getElementById("search-input") as HTMLInputElement | null;
  if (!modal || !box) return;

  modal.style.opacity = "0";
  box.classList.remove("scale-100", "opacity-100");
  box.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    if (input) {
      input.value = "";
    }
    const results = document.getElementById("results");
    if (results) results.innerHTML = "";
  }, 180);
}

/** Hook up event listeners and initialize Fuse */
async function initSearch() {
  await loadIndex();

  const openBtn = document.getElementById("open-search");
  const closeBtn = document.getElementById("close-search");
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-input") as HTMLInputElement | null;

  // If DOM isn't ready yet, bail (DOMContentLoaded will call initSearch again)
  if (!openBtn || !closeBtn || !modal || !input) {
    return;
  }

  // Open/close handlers
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  // backdrop click closes modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // keyboard shortcuts: Esc closes, Cmd/Ctrl+K toggles open
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // only close if modal is visible
      if (!modal.classList.contains("hidden")) closeModal();
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modal.classList.contains("hidden")) openModal();
      else closeModal();
    }
  });

  // debounced search input
  let timer: number | undefined;
  input.addEventListener("input", (ev) => {
    const value = (ev.target as HTMLInputElement).value;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => runSearch(value), 180);
  });

  // support initial ?q= query param (optional)
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q && q.length > 1) {
    openModal();
    input.value = q;
    runSearch(q);
  }
}

/** Ensure we init after DOM ready */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearch);
} else {
  // DOM already ready
  initSearch();
}
document.addEventListener("DOMContentLoaded", () => {
  initSearch();

  const modal = document.getElementById("search-modal") as HTMLElement;
  const searchBox = document.getElementById("search-box") as HTMLElement;
  const closeBtn = document.getElementById("close-search") as HTMLElement;

  // Trigger modal open when user clicks a search button (you need one)
  const searchTrigger = document.querySelector("#open-search"); // add this in header later

  if (searchTrigger) {
    searchTrigger.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");

      requestAnimationFrame(() => {
        searchBox.classList.remove("scale-95", "opacity-0");
        searchBox.classList.add("scale-100", "opacity-100");
      });
    });
  }

  // Close modal
  closeBtn.addEventListener("click", () => {
    searchBox.classList.remove("scale-100", "opacity-100");
    searchBox.classList.add("scale-95", "opacity-0");

    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }, 300);
  });

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeBtn.click();
    }
  });
});

