// @/lib/heading-html-extractor.ts
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { toHtml } from 'hast-util-to-html'
import type { Root, Element } from 'hast'

export interface HeadingWithHtml {
  depth: number
  slug: string
  text: string
  html: string
}

export function extractHeadingHtml() {
  return function (tree: Root, file: any) {
    const headings: HeadingWithHtml[] = []

    visit(tree, 'element', (node: Element) => {
      if (node.tagName && /^h[1-6]$/.test(node.tagName)) {
        const depth = parseInt(node.tagName.charAt(1))
        const slug = node.properties?.id as string || ''
        const text = toString(node)
        
        const clone = structuredClone(node)
        clone.children = clone.children.filter(child => 
          !(child.type === 'element' && child.tagName === 'a')
        )
        
        const html = toHtml(clone.children, {
          allowDangerousHtml: true,
          closeSelfClosing: true
        })
        
        // console.log(`Extracted heading: ${text}`)
        // console.log(`HTML: ${html}`)
        headings.push({
          depth,
          slug,
          text,
          html
        })
      }
    })

    // Store in remarkPluginFrontmatter instead of on the tree
    if (!file.data.astro) {
      file.data.astro = {}
    }
    if (!file.data.astro.frontmatter) {
      file.data.astro.frontmatter = {}
    }
    
    file.data.astro.frontmatter.headingsWithHtml = headings
    // console.log(`Total headings extracted: ${headings.length}`)
    // console.log('Stored in file.data.astro.frontmatter.headingsWithHtml')
  }
}
