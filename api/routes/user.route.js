import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

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
			req.body.password = bcrypt.hashSync(req.body.password, 10);
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

export default router;