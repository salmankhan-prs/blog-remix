import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/server-runtime";

import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "~/models/post.server";
import { requireAdminuser } from "~/session.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const loader = async ({ request, params }) => {
  await requireAdminuser(request);

  if (params.slug === "new") {
    return json({});
  }

  const post = await getPost(params.slug);

  if (!post) {
    throw new Response("not found", { status: 404 });
  }
  return json({ post });
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deletePost(params.slug);
    return redirect("/posts/admin");
  }

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");
  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  if (params.slug === "new") {
    await createPost({ title, slug, markdown });
  } else {
    await updatePost(params.slug, { title, slug, markdown });
  }

  return redirect("/posts/admin");
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();
  const isCreating = transition.submission?.formData.get("intent") === "create";
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";
  const data = useLoaderData();

  const isNewPost = !data.post;
  return (
    <Form method="post" key={data.post?.slug ?? "new"}>
      <p>
        <label>
          Post Title:{" "}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={data.post?.title}
          />
        </label>
        {errors?.title ? (
          <em className="text-red-600">{errors.title}</em>
        ) : null}
      </p>
      <p>
        <label>
          Post Slug:{" "}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={data.post?.slug}
          />
        </label>
        {errors?.slug ? <em className="text-red-600">{errors.slug}</em> : null}
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {errors?.markdown ? (
          <em className="text-red-600">{errors.markdown}</em>
        ) : null}

        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
          defaultValue={data.post?.markdown}
        />
      </p>
      <div className="flex justify-end gap-4">
        {!isNewPost && (
          <button
            type="submit"
            name="intent"
            value={"delete"}
            className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-blue-400 disabled:bg-red-300"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting ..." : "delete"}
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value={isNewPost ? "create" : "update"}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating || isUpdating}
        >
          {isNewPost
            ? isCreating
              ? "Creating..."
              : "Create Post"
            : isUpdating
            ? "updateing ...."
            : "update"}
        </button>
      </div>
    </Form>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
const {slug}=useParams()
  if (caught.status === 404) {
    return <div>Uh oh! the post with "{slug}" does not exists</div>;
  }
}


