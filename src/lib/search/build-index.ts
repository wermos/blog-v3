import MiniSearch from "minisearch";
import type { SearchDocument } from "./types";

export const searchOptions = {
  idField: "id",
  fields: ["heading", "text"], // indexed fields
  storeFields: ["url", "heading", "date", "order", "headingLevel"], // stored for UI
};

export function validateDocs(docs: SearchDocument[]): SearchDocument[] {
  const seen = new Map<string, SearchDocument>();
  let missing = 0;
  let duplicate = 0;

  for (const doc of docs) {
    if (!doc.id) {
      missing++;
      continue;
    }
    if (seen.has(doc.id)) {
      duplicate++;
      continue;
    }
    seen.set(doc.id, doc);
  }

  if (missing || duplicate) {
    console.warn(
      `⚠️ Search index validation: ${duplicate} duplicate IDs, ${missing} missing IDs`
    );
  }

  return Array.from(seen.values());
}

export function createIndexFromDocs(docs: SearchDocument[]) {
  const miniSearch = new MiniSearch(searchOptions);
  miniSearch.addAll(validateDocs(docs));
  return miniSearch;
}

export async function buildSearchIndex(docs: SearchDocument[]) {
  const miniSearch = createIndexFromDocs(docs);
  return JSON.stringify(miniSearch.toJSON());
}
