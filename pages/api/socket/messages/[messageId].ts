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
    const { serverId, channelId, messageId } = req.query;
    const profile = await currentProfileSocket(req);

    if (!profile) {
      return res.status(402).json({ error: "Unauthorised" });
    }
    if (!serverId) {
      return res.status(403).json({ error: "Server Id missing" });
    }
    if (!channelId) {
      return res.status(402).json({ error: "Channel Id missing" });
    }
    if (!messageId) {
      return res.status(402).json({ error: "message Id missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res.status(408).json({ error: "server not found" });
    }
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res.status(408).json({ error: "channel not found" });
    }
    const member = server?.members.find(
      (member) => member.profileId === profile?.id
    );
    if (!member) {
      return res.status(408).json({ error: "member not found" });
    }
    var message = await db.message.findFirst({
      where: { id: messageId as string, channelId: channelId as string },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message?.deleted) {
      return res.status(408).json({ error: "member not found" });
    }
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const isOwner = member.id === member.id;
    const canDeleteMessage =
      !message?.deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !message?.deleted && isOwner;

    if (req.method === "DELETE") {
      if (!canDeleteMessage) {
        return res.status(401).json({ error: "Unauthorised" });
      }
      message = await db.message.update({
        where: { id: messageId as string },
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
      message = await db.message.update({
        where: { id: messageId as string },
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
    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json({ message: message });
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
