import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./userModel.js";

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM,
      values: ["video", "chat"],
      defaultValue: "chat",
    },
  },

  {
    timestamps: true,
    tableName: "rooms",
  }
);

export default Room;
