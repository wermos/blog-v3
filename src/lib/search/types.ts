export type SearchDocument = {
  id: string;
  url: string;            // full URL or slug for the page
  date: string;           // formatted date string
  heading?: string;       // optional, for sectioned content
  headingLevel?: number;  // e.g., 2 for h2
  order?: number;         // position of section in page
  text: string;           // plaintext of the section or page
};


/** Internal type for assembling document sections  */
export type Section = {
  heading: string;
  text: string;
};