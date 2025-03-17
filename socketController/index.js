import { v4 as uuidv4 } from "uuid";
import { Participants, Room, Messages } from "../models/index.js";

const rooms = {};
const chatRooms = {};

export function SocketController(io, socket) {
  const checkRoom = async ({ roomId }) => {
    const room = await Room.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      socket.emit("room-error", { message: "Room does not exist" });
    } else {
      socket.emit("check-room-response", { room });
    }
  };
  const createRoom = async ({ ownerId, type }) => {
    const room = await Room.create({ owner: ownerId, type });
    const roomId = room.id;
    socket.join(roomId);
    socket.emit("room-created", roomId);
    console.log("new room");
  };

  const createChatRoom = async ({ ownerId }) => {
    try {
      const room = await Room.create({ owner: ownerId });
      const roomId = room.id;
      socket.emit("chat-room-created", roomId);
    } catch (error) {
      console.log("error", error);
      socket.emit("chat-room-error", { message: "Failed to create chat room" });
    }
  };

  const leaveRoom = ({ roomId, peerId }) => {
    if (!rooms[roomId]) return;
    rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    socket.leave(roomId);
    socket.to(roomId).emit("user-disconnected", peerId);
    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });
  };

  const joinRoom = async ({ roomId, peerId }) => {
    try {
      console.log("peerId", peerId);
      const checkRoom = await Room.findOne({ where: { id: roomId } });
      if (!checkRoom) return;

      const alreadyParticipant = await Participants.findOne({
        where: { roomId, userId: peerId },
      });
      if (!alreadyParticipant) {
        await Participants.create({
          roomId,
          userId: peerId,
        });
      }
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { peerId, room: checkRoom });
      const allParticipants = await Participants.findAll({ where: { roomId } });
      socket.emit("get-users", {
        roomId,
        participants: allParticipants,
      });
      socket.on("disconnect", () => leaveRoom({ roomId, peerId }));
    } catch (error) {
      console.log(error);
      socket.emit("error", { message: "Failed to join room" });
    }
  };

  const sendMessage = async ({ roomId, peerId, message, file }) => {
    console.log("send message", roomId, peerId, message, file);
    socket.to(roomId).emit("message-received", {
      peerId,
      message,
      file,
    });
    if (!file) {
      await Messages.create({
        roomId,
        userId: peerId,
        message,
      });
    }
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("send-message", sendMessage);
  socket.on("create-chat-room", createChatRoom);
  socket.on("leave-room", leaveRoom);
  socket.on("check-room", checkRoom);
}
