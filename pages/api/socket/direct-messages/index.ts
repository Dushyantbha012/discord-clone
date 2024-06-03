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
    const { conversationId } = req.query;
    const profile = await currentProfileSocket(req);

    if (!profile) {
      return res.status(402).json({ error: "Unauthorised" });
    }

    if (!conversationId) {
      return res.status(402).json({ error: "conversation Id missing" });
    }
    if (!content) {
      return res.status(402).json({ error: "content missing" });
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
    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
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
    const addKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(addKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("DIRECT_MESSAGE_POST", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
