import express from "express";
import { Hello, getAllKondisiAir } from "../controller/kondisiAir";
import { verifyToken } from "../middleware/verifyToken";
import { RefreshToken } from "../controller/RefreshToken";
import {
  getAllUser,
  userforgotPassword,
  userResetPassword,
} from "../controller/User";
import { getAllRole } from "../controller/Role";
import {
  RegisterUserRole,
  getAllUserRole,
  userRoleLogOut,
  userRoleLogin,
} from "../controller/userRole";

const router = express.Router();

//Token
router.get("/api/token", RefreshToken);

//KONDISI AIR
router.get("/api/kondisiair", getAllKondisiAir);
router.get("/", Hello);

//USER
router.get("/api/user", getAllUser);
// router.post("/api/login", userLogin);
router.post("/api/forgot-password", userforgotPassword);
router.post("/api/reset-password", userResetPassword);

//role
router.get("/api/roles", getAllRole);

//userRole
router.get("/api", verifyToken, getAllUserRole);
router.get("/api/token", RefreshToken);
router.post("/api/registerpengelola", RegisterUserRole);
router.delete("/api/logout", userRoleLogOut);
router.post("/api/login", userRoleLogin);

export default router;
