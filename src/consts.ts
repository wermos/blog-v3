import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'astro-erudite',
  description:
    'astro-erudite is a opinionated, unstyled blogging template—built with Astro, Tailwind, and shadcn/ui.',
  href: 'https://astro-erudite.vercel.app',
  author: 'jktrn',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 5,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: 'blog',
    label: 'blog',
  },
  {
    href: 'about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/wermos',
    label: 'GitHub',
  },
  // {
  //   href: 'https://twitter.com/enscry',
  //   label: 'Twitter',
  // },
  {
    href: 'mailto:tirthankar.blog.responses@gmail.com',
    label: 'Email',
  },
  {
    href: 'rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

export const comment = {
  enable: true,
  type: 'giscus',
  
  giscusConfig: {
    'data-repo': 'wermos/blog-v3',
    'data-repo-id': 'R_kgDOO-NeMg',
    'data-category': 'General',
    'data-category-id': 'DIC_kwDOO-NeMs4Cs6_j',
    'data-mapping': 'pathname',
    'data-strict': '1',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': 'preferred_color_scheme', // We'll handle theme switching dynamically
    'data-lang': 'en',
    'crossorigin': 'anonymous',
  }
}
