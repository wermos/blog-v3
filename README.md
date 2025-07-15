# blog-v3

This repository hosts the source code for my blog, version 3.

I am using Astro to write my blog. The `main` branch has the source code, as well as the blog content. The posts are in `.md` and `.mdx` files.

The actual site code is in the `gh-pages` branch. Upon pushing to the `main` branch, GitHub Actions runs and pushes the artifacts to the `gh-pages` branch, which is used for the hosted stuff.
