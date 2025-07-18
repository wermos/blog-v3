export {};

declare global {
  interface MathJaxObject {
    typesetPromise?: (elements?: Element[] | undefined) => Promise<void>;
    startup?: {
      document?: {
        clear(): void;
      };
    };
  }

  interface Window {
    MathJax: MathJaxObject;
  }
}
