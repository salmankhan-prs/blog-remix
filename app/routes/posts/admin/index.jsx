import { Link } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { requireAdminuser } from "~/session.server";
export const loader = async ({request}) => {
  await requireAdminuser(request)
  return json({
    
  });
};

export default function AdminIndex() {
  return (
    <p>
      <Link to="new" className="text-blue-600 underline">
        Create a New Post
      </Link>
    </p>
  );
}