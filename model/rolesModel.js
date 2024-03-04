import { Sequelize } from "sequelize";
import db from "../config/connection.js";

const { DataTypes } = Sequelize; // Import the built-in data types

const Role = db.define(
  "role",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

export default Role;
