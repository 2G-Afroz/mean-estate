import express from 'express';
import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";

const router = express.Router();

router.post("/signup", async (req, res) => {
	const {username, email, password} = req.body;
	const hashedPass = bcryptjs.hashSync(password, 10);
	const user = new User({username, email, password: hashedPass});
	try {
		await user.save();
		res.status(201).json("User created successfully" + user);
	}
	catch(err) {
		res.status(500).json(err.message);
	}
});

export default router;