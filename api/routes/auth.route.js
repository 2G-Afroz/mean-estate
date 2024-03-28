import express from 'express';
import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

router.post("/signin", async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const validUser = await User.findOne({email});
		if(!validUser) return next(errorHandler(404, "User not found."));
		const compPass = bcryptjs.compareSync(password, validUser.password);
		if(!compPass) return next(errorHandler(401, "Wrond Email or Password."));
		const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
		const { password: pass, ...user } = validUser._doc;
		res
		.cookie("access_token", token, {httpOnly: true})
		.status(200)
		.json(user);

	}
	catch(err) {
		next(err);
	}
});

export default router;