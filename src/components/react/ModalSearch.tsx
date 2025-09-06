import { useEffect, useRef, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Fuse from "fuse.js";
import type { FuseResult as FS } from "fuse.js";
import { Search } from "lucide-react";

type Post = {
  title: string;
  tags?: string[];
  path: string;
  image?: string | null;
};

type FuseResult = FS<Post>;

export default function ModalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult[]>([]);
  const [fuse, setFuse] = useState<Fuse<Post> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadIndex() {
      const res = await fetch("/search-index.json");
      const data = await res.json();
      const posts = data.posts as Post[];

      const fuseInstance = new Fuse(posts, {
        keys: ["title", "tags"],
        threshold: 0.3,
        ignoreLocation: true,
        includeMatches: true,
      });

      setFuse(fuseInstance);
    }
    loadIndex();
  }, []);

  useEffect(() => {
    if (!fuse || query.trim().length < 2) {
      setResults([]);
      return;
    }
    const hits = fuse.search(query.trim());
    setResults(hits);
  }, [query, fuse]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard shortcuts & open handler
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

    const openHandler = () => setIsOpen(true);
    window.addEventListener("open-search-modal", openHandler);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("open-search-modal", openHandler);
    };
  }, [isOpen]);

  const titleMatches = results.filter(r =>
    r.matches?.some(m => m.key === "title")
  );
  const titleMatchPaths = new Set(titleMatches.map(r => r.item.path));
  const tagMatches = results.filter(r =>
    r.matches?.some(m => m.key === "tags" && !titleMatchPaths.has(r.item.path))
  );

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-start justify-center mt-20 p-4">
          <DialogPanel className="bg-background w-full max-w-2xl rounded-xl shadow-xl p-6">
            {/* Search Input */}
            <div className="flex items-center gap-3 mb-4">
              <Search size={18} className="text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search posts..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto space-y-6">
              {results.length === 0 && query.trim().length >= 2 && (
                <p className="text-center text-muted-foreground">No results found.</p>
              )}

              {titleMatches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Matching Posts</h3>
                  <div className="space-y-3">
                    {titleMatches.map(({ item }) => (
                      <a
                        key={item.path}
                        href={item.path}
                        className="flex items-center gap-4 bg-muted/30 rounded-lg p-3 shadow-lg hover:shadow-xl hover:bg-accent/20 transition border border-border"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h2 className="font-semibold text-foreground">{item.title}</h2>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {tagMatches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Posts with Matching Tags</h3>
                  <div className="space-y-3">
                    {tagMatches.map(({ item }) => (
                      <a
                        key={item.path}
                        href={item.path}
                        className="flex items-center gap-4 bg-muted/30 rounded-lg p-3 shadow-lg hover:shadow-xl hover:bg-accent/20 transition border border-border"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h2 className="font-semibold text-foreground">{item.title}</h2>
                          {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
