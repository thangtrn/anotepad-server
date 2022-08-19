import express from "express";
import authCtrls from "../controllers/authCtrl.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// REGISTER
router.post('/auth/register', authCtrls.register)

// LOGIN
router.post('/auth/login', authCtrls.login)

// LOGOUT
router.post('/auth/logout', auth ,authCtrls.logout)

// FORGOT PASSWORD
router.post('/auth/forgot_password', authCtrls.forgotPassword)

// RESET PASSWORD
router.post('/auth/reset_password',auth, authCtrls.resetPassword)
export default router;
