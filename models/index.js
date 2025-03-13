import { sequelize } from "../config/db.js";
import Messages from "./messagesModel.js";
import Participants from "./participantsModel.js";
import Room from "./roomModel.js";
import User from "./userModel.js";

// Sync models with database
User.hasMany(Room, { foreignKey: "owner", as: "rooms" });
Room.belongsTo(User, { foreignKey: "owner", as: "ownerDetails" });

User.hasMany(Participants, { foreignKey: "userId", as: "participants" });
Room.hasMany(Participants, { foreignKey: "roomId", as: "participants" });
Participants.belongsTo(User, { foreignKey: "userId", as: "userDetails" });
Participants.belongsTo(Room, { foreignKey: "roomId", as: "roomDetails" });

User.hasMany(Messages, { foreignKey: "userId", as: "messages" });
Room.hasMany(Messages, { foreignKey: "roomId", as: "messages" });
Messages.belongsTo(User, { foreignKey: "userId", as: "userDetails" });
Messages.belongsTo(Room, { foreignKey: "roomId", as: "roomDetails" });
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Auto-update tables
    console.log("✅ Database synced.");
  } catch (error) {
    console.error("❌ Database sync error:", error);
  }
};

export { User, Room, Participants, Messages };
