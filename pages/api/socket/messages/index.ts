import { currentProfileSocket } from "@/lib/currentProfileSocket";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/tyes";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }
  try {
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;
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
    if (!content) {
      return res.status(402).json({ error: "content missing" });
    }
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
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
    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return res.status(408).json({ error: "member not found" });
    }
    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    const addKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(addKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("MESSAGE_POST", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
