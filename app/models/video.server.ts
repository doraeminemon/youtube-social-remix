import type { User, Video } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Video } from "@prisma/client";

export function getVideo({
  id,
  userId,
}: Pick<Video, "id"> & {
  userId: User["id"];
}) {
  return prisma.video.findFirst({
    select: { id: true, link: true, title: true },
    where: { id, userId },
  });
}

export function getVideoListItems() {
  return prisma.video.findMany({
    select: { id: true, title: true, link: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createVideo({
  link,
  title,
  userId,
}: Pick<Video, "link" | "title"> & {
  userId: User["id"];
}) {
  return prisma.video.create({
    data: {
      title,
      link,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteVideo({
  id,
  userId,
}: Pick<Video, "id"> & { userId: User["id"] }) {
  return prisma.video.deleteMany({
    where: { id, userId },
  });
}
