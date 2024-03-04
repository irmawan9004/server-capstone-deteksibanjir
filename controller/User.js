import User from "../model/userModel";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import userRole from "../model/userRoles";

export const getAllUser = async (req, res) => {
  try {
    const user = await User.findAll({
      attributes: ["id", "name", "email"],
    });
    console.log(user);
    res.json(user);
    res.status(200);
  } catch (error) {
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const user = await User.findAll({ where: { email: req.body.email } });
    // console.log(user);
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.status(401).json({ msg: "Password salah" });
    }
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
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
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
    await userRole.update(
      { refresh_token: refreshToken },
      {
        where: { userId: userId },
      }
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

export const userLogOut = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await User.update({ refresh_token: null }, { where: { id: userId } });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const userforgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user by email (replace with your user lookup logic)
    const user = await User.findAll({
      where: { email: email },
      attributes: ["email"],
    });
    if (user.length > 0) {
      // Create a JWT with the user's email
      const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });

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
        message: `Link lupa kata sandi terkirim ke ${email}, cek email anda !`,
      });
    } else {
      res
        .status(403)
        .json({ success: false, message: "Email tidak ditemukan." });
    }
  } catch (error) {
    res.status(403).json({ msg: "Email tidak ditemukan" });
  }
};

//Reset Passsword
export const userResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);

    // Check if the token is associated with a valid user
    const user = await User.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset token
    await user.update({
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
