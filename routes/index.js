import express from "express";
import {
  getAllPenjaga,
  RegisterPenjaga,
  PenjagaLogin,
  LogOut,
} from "../controller/Penjaga";
import { getAllKondisiAir } from "../controller/kondisiAir";
import { verifyToken } from "../middleware/verifyToken";
import { RefreshToken } from "../controller/refreshToken";

const router = express.Router();

//LOGIN,LOGOUT,REGISTER PENJAGA
router.get("/", verifyToken, getAllPenjaga);
router.post("/", RegisterPenjaga);
router.post("/login", PenjagaLogin);
router.get("/token", RefreshToken);
router.delete("/logout", LogOut);

//KONDISI AIR
router.get("/kondisiair", getAllKondisiAir);

export default router;
