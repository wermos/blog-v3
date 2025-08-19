import { useState } from "react";

type SearchProps = {
  data: any[]; // later this will be the MiniSearch corpus
};

export default function Search({ data }: SearchProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="search-modal">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {/* later: show results from minisearch */}
      <pre>{JSON.stringify(data.slice(0, 3), null, 2)}</pre>
    </div>
  );
}
