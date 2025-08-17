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
        <Command shouldFilter={false}>
          {!isLoading ? (
            <div className="relative">
              <CommandInput
                placeholder="Type to search..."
                value={searchTerm}
                onValueChange={onChange}
                autoFocus
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <svg
                    className="h-5 w-5 animate-spin text-gray-500"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-900"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
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
            {!results.length && searchTerm ? (
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
                        dangerouslySetInnerHTML={{
                          __html: result.excerpt,
                        }}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};
