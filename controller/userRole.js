import userRole from "../model/userRoles";
import User from "../model/userModel";
import Role from "../model/rolesModel";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUserRole = async (req, res) => {
  try {
    const userrole = await userRole.findAll({
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
    });
    // console.log(userrole);
    res.json(userrole);
    res.status(200);
  } catch (error) {
    console.log(error);
  }
};

export const RegisterUserRole = async (req, res) => {
  const { name, email, selected, password, confPassword } = req.body;
  if (password !== confPassword) {
    res.status(400).json({ message: "Password tidak sama" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  const match = await bcrypt.compare(password, hashPassword);
  console.log(password);
  console.log(hashPassword);
  console.log(password.length);
  console.log(match);
  try {
    const checkEmail = await User.findAll({ where: { email: email } });
    console.log(checkEmail);
    if (checkEmail.length > 0) {
      return res.status(401).json({ msg: "Email sudah terdaftar" });
    }
    try {
      await User.create({
        name: name,
        email: email,
        password: hashPassword,
      });
      await User.findOne({
        where: { email: email },
        attributes: ["id"],
      }).then((user) => {
        userRole.create({
          userId: user.id,
          roleId: selected,
        });
      });
      res.status(200).json({ message: "Register berhasil oi" });
    } catch (error) {
      res.status(400).json({ message: "Register Error " });
    }
  } catch (error) {
    res.status(400).json({ message: "Errorr " });
  }
};

export const userRoleLogin = async (req, res) => {
  try {
    const userrole = await userRole.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "password"],
          where: { email: req.body.email },
        },
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
    });
    console.log(userrole[0].user.email);

    // console.log(user);
    const match = await bcrypt.compare(
      req.body.password,
      userrole[0].user.password
    );
    if (!match) {
      return res.status(401).json({ msg: "Password salah" });
    }
    const userId = userrole[0].user.id;
    const name = userrole[0].user.name;
    const email = userrole[0].user.email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "59s" }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    console.log(process.env.REFRESH_TOKEN_SECRET);
    await userRole.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // console.log(refreshToken);
    res.json({
      status: true,
      accessToken: accessToken,
      role: userrole[0].role.name,
    });
  } catch (error) {
    res.status(401).json({ msg: "email tidak ditemukan " });
  }
};

export const userRoleLogOut = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const userrole = await userRole.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!userrole[0]) return res.sendStatus(204);
  const userId = userrole[0].id;
  await userRole.update({ refresh_token: null }, { where: { id: userId } });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
