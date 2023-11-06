import { Sequelize } from "sequelize";
import db from "../config/connection";

const { DataTypes } = Sequelize;

const kondisiAir = db.define("kondisi_air", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  waktu: {
    type: DataTypes.DATE,
    // allowNull: false,
  },
  tinggi: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  debit: {
    type: DataTypes.INTEGER,
  },
  keruh: {
    type: DataTypes.INTEGER,
  },
});

export default kondisiAir;
