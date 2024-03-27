import express from 'express';
import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
	const {username, email, password} = req.body;
	const hashedPass = bcryptjs.hashSync(password, 10);
	const user = new User({username, email, password: hashedPass});
	try {
		await user.save();
		res.status(201).json("User created successfully");
	}
	catch(err) {
		next(err);
	}
});

export default router;