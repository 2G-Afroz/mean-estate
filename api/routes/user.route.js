import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import Listing from '../models/listing.model.js';

const router = express.Router();

router.get("/", (req, res) => {
	res.send("hello");
});

router.post("/update/:id", verifyToken, async (req, res, next) => {
	if(req.user.id !== req.params.id) {
		return next(errorHandler(403, "You are not allowed to update this user."));
	}
	try {
		if(req.body.password) {
			req.body.password = bcryptjs.hashSync(req.body.password, 10);
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.id, {
			$set: {
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
				avatar: req.body.avatar
			}
		}, { new: true });

		const { password, ...others } = updatedUser._doc;

		res.status(200).json(others);
	}
	catch(err) {
		next(err);
	}
});

router.delete("/delete/:id", verifyToken, async (req, res, next) => {
	if(req.user.id !== req.params.id) {
		return next(errorHandler(403, "You are not allowed to delete this user."));
	}
	try {
		await User.findByIdAndDelete(req.params.id);
		res.clearCookie("access_token");
		res.status(200).json("User has been deleted.");
	}
	catch(err) {
		next(err);
	}
});

router.get("/logout", (req, res) => {
	try {
		res.clearCookie("access_token");
		res.status(200).json("User has been logged out.");
	}
	catch(err) {
		next(err);
	}
});

router.get("/listings/:id", verifyToken, async (req, res, next) => {
	if(req.user.id !== req.params.id) {
		return next(errorHandler(403, "You are not allowed to view this user's listings."));
	}
	try {
		const listings = await Listing.find({ userRef: req.params.id });
		res.status(200).json(listings);
	}
	catch(err) {
		next(err);
	}
});

export default router;