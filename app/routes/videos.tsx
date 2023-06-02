import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet } from "@remix-run/react";

import { getVideoListItems } from "~/models/video.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const videoListItems = await getVideoListItems();
  return json({ videoListItems });
};

export default function VideosPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="sticky top-0 left-0 flex items-center justify-between bg-slate-800 py-4 text-white px-2">
        <h1 className="text-3xl font-bold">
          <Link to=".">Videos</Link>
        </h1>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <Outlet />
    </div>
  );
}
