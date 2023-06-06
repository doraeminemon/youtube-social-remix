import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import useWebSocket from 'react-use-websocket';

import { createVideo } from "~/models/video.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const link = formData.get("link");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { link: null, title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof link !== "string" || link.length === 0) {
    return json(
      { errors: { link: "Link is required", title: null } },
      { status: 400 }
    );
  }

  await createVideo({ link, title, userId });

  return redirect(`/videos`);
};

const WS_URL = process.env.WS_URL || 'ws://localhost:8000'

export default function NewVideoPage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useWebSocket<{ message: string }>(WS_URL);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.link) {
      linkRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      className="flex flex-col gap-8 px-4 w-full py-4"
      method="post"
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Link: </span>
          <input
            ref={linkRef}
            name="link"
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.link ? true : undefined}
            aria-errormessage={
              actionData?.errors?.link ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.link ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.link}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={() => {
            // broadcast message to all other clients
            const title = titleRef.current?.value
            const link = linkRef.current?.value
            sendMessage(JSON.stringify({ title, link }))
          }}
        >
          Share
        </button>
      </div>
    </Form>
  );
}
