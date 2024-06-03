import { NextApiResponseServerIo } from "@/tyes";
import { NextApiRequest } from "next";
import { currentProfileSocket } from "@/lib/currentProfileSocket";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { content } = req.body;
    const { directMessageId, conversationId } = req.query;
    const profile = await currentProfileSocket(req);

    if (!profile) {
      return res.status(402).json({ error: "Unauthorised" });
    }
    if (!directMessageId) {
      return res.status(403).json({ error: "directMessage Id missing" });
    }
    if (!conversationId) {
      return res.status(402).json({ error: "conversation Id missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
    if (!conversation) {
      return res.status(408).json({ error: "conversation not found" });
    }
    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return res.status(408).json({ error: "member not found" });
    }

    let message = await db.directMessage.findFirst({
      where: { id: directMessageId as string, conversationId: conversation.id },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message?.deleted) {
      return res.status(408).json({ error: "message not found" });
    }
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const isOwner = message.memberId === member.id;
    const canDeleteMessage =
      !message?.deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !message?.deleted && isOwner;

    if (req.method === "DELETE") {
      if (!canDeleteMessage) {
        return res.status(401).json({ error: "Unauthorised" });
      }
      message = await db.directMessage.update({
        where: { id: directMessageId as string },
        data: {
          fileUrl: null,
          content: "This message is Deleted",
          deleted: true,
        },
        include: {
          member: {
            include: { profile: true },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!canEditMessage) {
        return res.status(401).json({ error: "Unauthorised" });
      }
      if (!content) {
        return res.status(402).json({ error: "content missing" });
      }
      message = await db.directMessage.update({
        where: { id: directMessageId as string },
        data: {
          content: content,
        },
        include: {
          member: {
            include: { profile: true },
          },
        },
      });
    }
    const updateKey = `chat:${conversation.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json({ message: message });
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
