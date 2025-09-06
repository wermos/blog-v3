import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");

  const body = {
    posts: await Promise.all(
      posts.map(async (post) => {
        let image = null;
        if (post.data.image) {
          try {
            const resolved = await import(post.data.image.src);
            image = resolved.default; // Vite gives you the final URL
          } catch (e) {
            image = null;
          }
        }

        return {
          title: post.data.title,
          tags: post.data.tags || [],
          path: `${import.meta.env.BASE_URL}blog/${post.id}/`,
          image,
        };
      })
    ),
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
