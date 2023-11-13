import kondisiAir from "../model/kondisiAirModel";
import { Op } from "sequelize";
import Sequelize from "sequelize";

export const getAllKondisiAir = async (req, res) => {
  try {
    const status = req.query.status;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await kondisiAir.count({
      where: {
        [Op.or]: [
          Sequelize.literal(
            `DATE_FORMAT(waktu, '%Y-%m-%d') LIKE '%${search}%'`
          ),
        ],
        // [Op.or]: [{ waktu: { [Op.like]: `%${search}%` } }],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await kondisiAir.findAll({
      where: {
        [Op.or]: [
          Sequelize.literal(
            `DATE_FORMAT(waktu, '%Y-%m-%d') LIKE '%${search}%'`
          ),
        ],
        // [Op.or]: [{ waktu: { [Op.like]: `%${search}%` } }],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });
    res.status(200);
  } catch (error) {
    console.log(error);
  }
};

export const Hello = (req, res) => {
  console.log("hello");
  res.json({ msg: "hello" });
};
