import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getPosts } from "~/models/post.server";
import { useOptionalUser } from "~/utils";

export const loader = async () => {
  return json({
    posts: await getPosts(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData();
  const user=useOptionalUser();
  const isAdmin = user?.email=== ENV.ADMIN_EMAIL;
  console.log(posts);
  return (
    <main>
      <h1>Posts</h1>
     {isAdmin? <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
      :null
}
      <ul>
        {/* prefetch is used to fetch the page fastly when user hover on th link */}
        {posts.map((post) => {
          return (
            <li key={post.slug}>
              <Link to={post.slug} prefetch="intent" className="text-blue-600 underline">
                {post.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
