import { useState, useEffect } from "react";
import type { SetStateAction } from "react";

// shadcn/ui components
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

import { DialogTitle } from "@/components/ui/dialog";
import { HomeIcon } from "lucide-react";

type SearchResultData = {
  meta: { image: string; title: string };
  excerpt: string;
  raw_url: string;
};

type SearchResult = {
  data: () => Promise<SearchResultData>;
};

type SearchResponse = {
  results: SearchResult[];
};

type Pagefind = {
  init: () => void;
  debouncedSearch: (value: string) => Promise<SearchResponse>;
};

const initPagefind = async (): Promise<Pagefind> => {
  try {
    const pagefind = (await import(
      /* @vite-ignore */ `${import.meta.env.BASE_URL}pagefind/pagefind.js`
    )) as unknown as Pagefind;

    pagefind.init();
    return pagefind;
  } catch (e) {
    return {
      init: () => {},
      debouncedSearch: async () => ({
        results: [],
      }),
    };
  }
};

export const Search = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [results, setResults] = useState<SearchResultData[]>([]);
  const [pagefind, setPagefind] = useState<Pagefind>();

  const openSearchBar = async (open: SetStateAction<boolean>) => {
    setOpen(open);
    if (!pagefind && !isLoading) {
      setIsLoading(true);
      setPagefind(await initPagefind());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openSearchBar((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onChange = async (value: string) => {
    setSearchTerm(value);
    if (pagefind) {
      setIsSearching(true);
      const search = await pagefind.debouncedSearch(value);
      if (search) {
        const data: SearchResultData[] = [];
        for (let a = 0; a < Math.min(search.results.length, 5); a++) {
          data.push(await search.results[a].data());
        }
        setResults(data);
      }
      setIsSearching(false);
    }
  };

  return (
    <div id="pagefind__search" className="ms-auto">
      <div className="w-full flex-1 md:w-auto md:flex-none">
        <button
          onClick={() => openSearchBar(true)}
          className="focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground bg-muted/50 text-muted-foreground relative inline-flex h-8 w-full items-center justify-start gap-2 rounded-[0.5rem] border px-4 py-2 text-sm font-normal whitespace-nowrap shadow-none transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-56 xl:w-64 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <span className="hidden lg:inline-flex">Search blog posts...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>
      <CommandDialog open={open} onOpenChange={openSearchBar}>
        <DialogTitle className="hidden items-center"></DialogTitle>
          {!isLoading ? (
            <CommandInput
              placeholder="Type to search..."
              value={searchTerm}
              onValueChange={onChange}
              // isLoading={isSearching}
              autoFocus
            />
          ) : (
            <div className="flex justify-center py-4 text-sm">
              Loading search...
            </div>
          )}
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={() => (window.location.href = "/")}>
                <HomeIcon />
                Go Home
              </CommandItem>
            </CommandGroup>

            <CommandSeparator alwaysRender />

            {/* Only show "No results" when not actively searching */}
            {!isSearching && !results.length && searchTerm ? (
              <div className="flex justify-center py-4 text-sm">
                No results found
              </div>
            ) : null}
            {results.length ? (
              <CommandGroup heading="Search Results">
                {results.map((result) => (
                  <CommandItem
                    key={result.raw_url}
                    onSelect={() => (window.location.href = result.raw_url)}
                    className="flex flex-nowrap items-center justify-center gap-2"
                  >
                    <div className="min-w-[150px]">
                      <img
                        src={result.meta.image}
                        width={150}
                        className="outline-secondary rounded-2xl outline"
                      />
                    </div>
                    <div className="border-primary flex shrink flex-col gap-4 border-l-2 pl-4">
                      <div className="w-full overflow-hidden text-sm font-bold sm:text-base">
                        {result.meta.title}
                      </div>
                      <div
                        className="text-xs sm:text-sm"
                        dangerouslySetInnerHTML={{ __html: result.excerpt }}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
      </CommandDialog>
    </div>
  );
};
