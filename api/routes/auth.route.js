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

router.post("/google", async (req, res, next) => {
	const { name, email, photo } = req.body;
	try {
		const user = await User.findOne({email});
		if(user) {
			const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
			const { password: pass, ...userData } = user._doc;
			res
			.cookie("access_token", token, {httpOnly: true})
			.status(200)
			.json(userData);
		}
		else {
			const generatedPass = Math.random().toString(36).slice(-8);
			const hashedPass = bcryptjs.hashSync(generatedPass, 10);
			const newUser = new User({username: name, email, password: hashedPass, avatar: photo});
			newUser.save();
			const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
			const { password: pass, ...userData } = newUser._doc;
			res
			.cookie("access_token", token, {httpOnly: true})
			.status(200)
			.json(userData);
		}
	}
	catch(err) {
		console.error(err);
		next(err);
	}
});

export default router;