import express from "express";
import {
  getAllPenjaga,
  RegisterPenjaga,
  PenjagaLogin,
  LogOut,
  forgotPassword,
} from "../controller/Penjaga";
import { Hello, getAllKondisiAir } from "../controller/kondisiAir";
import { verifyToken } from "../middleware/verifyToken";
import { RefreshToken } from "../controller/RefreshToken";

const router = express.Router();

router.get("/api", verifyToken, getAllPenjaga);
router.get("/api/token", RefreshToken);
router.post("/api/regist", RegisterPenjaga);
router.post("/api/login", PenjagaLogin);
router.post("/api/forgot-password", forgotPassword);
router.delete("/api/logout", LogOut);

//KONDISI AIR
router.get("/api/kondisiair", getAllKondisiAir);
router.get("/", Hello);

export default router;
