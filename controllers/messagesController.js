import { Messages, User } from "../models/index.js";

export const getRoomMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Messages.findAll({
      where: { roomId },
      order: [["id", "ASC"]],
      attributes: [
        "id",
        "roomId",
        ["userId", "sender"], // Renaming userId to sender
        ["message", "text"],
        "file",
        "createdAt",
      ],
      include: [
        {
          model: User,
          attributes: ["name"],
          as: "userDetails",
        },
      ],
    });
    console.log(messages);
    return res.status(200).json({ status: true, messages });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: {} });
  }
};

export const saveFile = async (req, res) => {
  const { roomId, userId, message } = req.body;
  const file = req.file;

  try {
    const new_message = await Messages.create({
      roomId,
      userId,
      file: file.filename,
      message,
    });

    return res.status(200).json({ status: true, message: new_message });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: {} });
  }
};
