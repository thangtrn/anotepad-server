import express from "express";
import noteCtrls from "../controllers/noteCtrl.js";
import auth from '../middleware/auth.js'
const router = express.Router();

// CREATE NOTE
router.post('/note', noteCtrls.createNote);

// GET ALL NOTEs
router.get('/notes', auth, noteCtrls.getNotes);

// GET NOTE
router.get('/note/:id', noteCtrls.getNote);

// DELETE NOTE
router.delete('/note/:id', auth, noteCtrls.deleteNote);

// EDIT NOTE
router.put('/note/:id', auth, noteCtrls.editNote);

export default router;
