import { Sequelize } from "sequelize";
import db from "../config/connection.js";
import User from "./userModel.js";
import Role from "./rolesModel.js";

const { DataTypes } = Sequelize; // Import the built-in data types

const userRole = db.define(
  "userRole",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "role",
        key: "id",
      },
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  { freezeTableName: true }
);
userRole.belongsTo(User, { foreignKey: "userId" });
userRole.belongsTo(Role, { foreignKey: "roleId" });

export default userRole;
