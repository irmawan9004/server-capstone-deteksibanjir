import express from "express";
import {
  getAllPenjaga,
  RegisterPenjaga,
  PenjagaLogin,
  LogOut,
} from "../controller/Penjaga";
import { Hello, getAllKondisiAir } from "../controller/kondisiAir";
import { verifyToken } from "../middleware/verifyToken";
import { RefreshToken } from "../controller/refreshToken";

const router = express.Router();

//LOGIN,LOGOUT,REGISTER PENJAGA
router.get("/api", verifyToken, getAllPenjaga);
router.post("/api/regist", RegisterPenjaga);
router.post("/api/login", PenjagaLogin);
router.get("/api/token", RefreshToken);
router.delete("/api/logout", LogOut);

//KONDISI AIR
router.get("/api/kondisiair", getAllKondisiAir);
router.get("/", Hello);

export default router;
