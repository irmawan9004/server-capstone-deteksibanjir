import jwt from "jsonwebtoken";
import Penjaga from "../model/penjagaModel";

export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    console.log("hello");
    console.log(process.env.REFRESH_TOKEN_SECRET);
    if (!refreshToken) return res.sendStatus(403);
    const penjaga = await Penjaga.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    // console.log(penjaga);
    if (!penjaga[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        const userId = penjaga[0].id;
        const name = penjaga[0].name;
        const email = penjaga[0].email;
        const accessToken = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    if (error) return console.log(error);
  }
};
