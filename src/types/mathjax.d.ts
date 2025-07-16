export {};

declare global {
  interface MathJaxObject {
    typesetPromise?: (elements?: Element[] | undefined) => Promise<void>;
    // You can extend this interface with more MathJax methods as needed
  }

  interface Window {
    MathJax: MathJaxObject;
  }
}
