import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeParse from 'rehype-parse';
import type { Root } from 'hast';

function printTree(node: any, indent = 0) {
  const pad = '  '.repeat(indent);
  if (!node) return;

  if (node.type === 'text') {
    console.log(`${pad}- text: "${node.value}"`);
  } else if (node.type === 'element') {
    console.log(`${pad}- element: <${node.tagName}>`);
    if (node.children) {
      for (const child of node.children) {
        printTree(child, indent + 1);
      }
    }
  } else if (node.type === 'root' && node.children) {
    console.log(`${pad}- root`);
    for (const child of node.children) {
      printTree(child, indent + 1);
    }
  }
}

async function showMdAst(md: string) {
  // 1. Convert MD → HTML
  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(md)
  );

  console.log('--- Generated HTML ---');
  console.log(html);
  console.log('-----------------------');

  // 2. Parse HTML → HAST
  const tree = (unified()
    .use(rehypeParse, { fragment: true })
    .parse(html)) as Root;

  console.log('--- HAST Tree ---');
  printTree(tree);
  console.log('------------------');
}

// Example usage
// const markdown = `
// #### Test Heading with \`template{:cpp}\` Code

// \`for{:cpp}\` in C++ and \`for{:py}\` in Python have slightly different semantics. For example, \`for{:cpp}\` in C++ can be thought of as compiling down to a \`while{:cpp}\` loop under the hood, and that's that. However, in Python, \`for{:py}\` loops can have \`else{:py}\` statements.
// `;
const markdown = `
I kept the \`\`peeking under the hood" to a minimum to avoid being influenced too much by their design and ways of thinking, but every now and then I checked existing chess engine implementations to see how they did things.
`;

showMdAst(markdown);
