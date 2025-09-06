import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";

type Post = {
  title: string;
  tags?: string[];
  path: string;
  image?: string | null;
};

export default function ModalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [fuse, setFuse] = useState<Fuse<Post> | null>(null);

  // Load search index
  useEffect(() => {
    async function loadIndex() {
      const res = await fetch("/search-index.json");
      const data = await res.json();
      const posts = data.posts as Post[];

      const fuseInstance = new Fuse(posts, {
        keys: ["title", "tags"],
        threshold: 0.3,
        ignoreLocation: true,
      });

      setFuse(fuseInstance);
    }
    loadIndex();
  }, []);

  // Perform search
  useEffect(() => {
    if (!fuse || query.trim().length < 2) {
      setResults([]);
      return;
    }
    const hits = fuse.search(query.trim()).map((r) => r.item);
    setResults(hits);
  }, [query, fuse]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "/" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Listen for custom event from Astro button
  useEffect(() => {
    const openModal = () => setIsOpen(true);
    window.addEventListener("open-search-modal", openModal);
    return () => window.removeEventListener("open-search-modal", openModal);
  }, []);

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-start justify-center mt-20 p-4">
          <Dialog.Panel className="bg-background w-full max-w-2xl rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Search size={18} className="text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search posts..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-3">
              {results.length === 0 && query.trim().length >= 2 && (
                <p className="text-center text-muted-foreground">No results found.</p>
              )}
              {results.map((post) => (
                <a
                  key={post.path}
                  href={post.path}
                  className="flex items-center gap-4 bg-card rounded-lg p-3 shadow hover:shadow-md transition"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h2 className="font-semibold text-foreground">{post.title}</h2>
                    {post.tags?.length && (
                      <p className="text-sm text-muted-foreground">{post.tags.join(", ")}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
