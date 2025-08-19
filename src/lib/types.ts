import type { Options as MiniSearchOptions } from "minisearch";
import { z } from "zod";

// from withastro/astro/packages/astro-rss/src/index.ts
const globResultValidator = z.record(z.function().returns(z.promise(z.any())));
export type GlobResult = z.infer<typeof globResultValidator>;

export type PluginOptions = z.infer<typeof pluginOptionValidator>;

/** Plugin options [Zod](https://zod.dev/) schema */
export const pluginOptionValidator = z.object({
  /** 
   * Frontmatter property to store plain text output
   * @default "plainText". 
   */
  contentKey: z.string().default("plainText"),

  /** 
   * Strip emoji out of text 
   * @default false
   */
  removeEmoji: z.boolean().default(false),

  /** 
   * Tags to consider headings and make separate search documents.
   * @default ["h2", "h3", "h4", "h5", "h6"]
   */
  headingTags: z.array(z.string()).default(["h2", "h3", "h4", "h5", "h6"]),
});

/** @see [MiniSearch API](https://lucaong.github.io/minisearch/modules/_minisearch_.html#searchoptions-1) */
export type SearchIndexOptions = MiniSearchOptions<SearchDocument>;

/** 
 * Represents a search document that will be given to the indexer. 
 * Although called "document", it's more of the content for one destination.
 * For example, it may only the single section of a document.
*/
// export type SearchDocument = {
//   url?: string;
//   heading?: string;
//   title: string;
//   text: string;
// };
export type SearchDocument = {
  url: string;             // full URL or slug for the page
  title: string;           // from frontmatter.title
  description?: string;    // optional, from frontmatter.description
  tags: string[];         // from frontmatter.tags
  date: string;           // formatted date string
  heading?: string;        // optional, for sectioned content
  text: string;            // plain text of the section or page
};


/** Internal type for assembling document sections  */
export type Section = { heading: string; text: string };

/**
 * ContentEntry class to match the one in "astro:content", 
 * which we can't access outside of an Astro project.
 */
export type ContentEntry = {
  slug: string;
  render: () => Promise<{
    headings: {
      depth: number;
      slug: string;
      text: string;
    }[];
    remarkPluginFrontmatter: Record<string, any>;
  }>;
}