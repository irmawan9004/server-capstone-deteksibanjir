import { Sequelize } from "sequelize";

const db = new Sequelize("db_deteksibanjir", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
