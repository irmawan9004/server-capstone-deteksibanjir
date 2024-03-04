import jwt from "jsonwebtoken";
import User from "../model/userModel";
import userRole from "../model/userRoles";

export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(process.env.REFRESH_TOKEN_SECRET);
    if (!refreshToken) return res.sendStatus(403);
    const userrole = await userRole.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    // console.log(penjaga);
    if (!userrole[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        const userId = userrole[0].id;
        const name = userrole[0].name;
        const email = userrole[0].email;
        const accessToken = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    if (error) return console.log(error);
  }
};
