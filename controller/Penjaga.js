import Penjaga from "../model/penjagaModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const getAllPenjaga = async (req, res) => {
  try {
    const penjaga = await Penjaga.findAll({
      attributes: ["id", "name", "email", "refresh_token"],
    });
    console.log(penjaga);
    res.json(penjaga);
    res.status(200);
  } catch (error) {
    console.log(error);
  }
};

export const RegisterPenjaga = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
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
    await Penjaga.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.status(200).json({ message: "Register berhasil" });
  } catch (error) {
    res.status(400).json({ message: "Register Error " });
  }
};

export const PenjagaLogin = async (req, res) => {
  try {
    const penjaga = await Penjaga.findAll({ where: { email: req.body.email } });
    const match = await bcrypt.compare(req.body.password, penjaga[0].password);
    if (!match) {
      return res.status(401).json({ msg: "Password salah" });
    }
    const userId = penjaga[0].id;
    const name = penjaga[0].name;
    const email = penjaga[0].email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    console.log(refreshToken);
    console.log("hello");
    console.log(process.env.REFRESH_TOKEN_SECRET);
    await Penjaga.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // console.log(refreshToken);
    res.json({ accessToken: accessToken });
  } catch (error) {
    res.status(401).json({ msg: "email tidak ditemukan" });
  }
};

export const LogOut = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const penjaga = await Penjaga.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!penjaga[0]) return res.sendStatus(204);
  const userId = penjaga[0].id;
  await Penjaga.update({ refresh_token: null }, { where: { id: userId } });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user by email (replace with your user lookup logic)
    const penjaga = await Penjaga.findAll({ where: { email: email } });
    if (penjaga) {
      // Create a JWT with the user's email
      const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      console.log(token);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "capstonekelompok17@gmail.com",
          pass: "ywyv ypgy gpnp jjhp",
        },
      });

      // Send magic link email
      function sendMagicLinkEmail(email, token) {
        const mailOptions = {
          from: "capstonekelompok17@gmail.com",
          to: email,
          subject: "Link Lupa Kata Sandi Anda",
          text: `Click the following link to reset your password: http://localhost:3000/forgot-password/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
      // Send the magic link email
      sendMagicLinkEmail(email, token);

      res.json({
        success: true,
        message: "Link lupa kata sandi terkirim, cek email anda !",
      });
    } else {
      res.status(403).json({ success: false, message: "User not found." });
    }
  } catch (error) {
    res.status(403).json({ msg: "Email tidak ditemukan" });
  }
};

export const ResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);

    // Check if the token is associated with a valid user
    const penjaga = await Penjaga.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!penjaga) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset token
    await penjaga.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
