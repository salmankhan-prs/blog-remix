import { json } from "@remix-run/node";
import { useLoaderData, Link ,Outlet} from "@remix-run/react";
import { getPosts } from "~/models/post.server";
import { requireAdminuser } from "~/session.server";

export const loader = async ({request}) => {
  await requireAdminuser(request)
  return json({
    posts: await getPosts(),
  });
};

export default function PostAdmin() {
  const { posts } = useLoaderData();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={post.slug} className="text-blue-600 underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
            <Outlet/>
        </main>
      </div>
    </div>
  );
}

export function ErrorBoundary({error}){
  return (
    <div className="text-red-500">
      oh! no something went wrong!
      <pre>{error.message}</pre>
    </div>
  )
}

