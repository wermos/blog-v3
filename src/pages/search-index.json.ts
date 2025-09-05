import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");

  const body = {
    posts: posts.map((post) => ({
      title: post.data.title,
      tags: post.data.tags || [],
      path: `/blog/${post.id}/`, // Use id since slug doesn't exist
    })),
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
