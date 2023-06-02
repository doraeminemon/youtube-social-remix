import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getVideoListItems } from "~/models/video.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const videoListItems = await getVideoListItems();
  return json({ videoListItems });
};

export default function VideoIndexPage() {
  const data = useLoaderData<typeof loader>();
  return (
      <main className="flex h-full bg-white justify-center min-h-screen w-full">
        <div className="h-full max-w-80 lg:w-1/2 w-full px-4">
          <Link to="new" className="block p-4 text-xl text-gray-50 bg-blue-500 hover:bg-blue-300 rounded-md my-4">
            + New Video
          </Link>

          <hr />

          {data.videoListItems.length === 0 ? (
            <p className="p-4">No videos yet</p>
          ) : (
            <ol className="flex flex-col gap-2 sm:w-full">
              {data.videoListItems.map((video) => (
                <li className="bg-gray-50 border rounded-sm" key={video.id}>
                  <article className="block p-4 text-xl hover:bg-white">
                    <h1 className="text-lg leading-5 mb-2">{video.title}</h1>
                    <a className="text-blue-500 text-sm" href={video.link}>{video.link}</a>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
  );
}
