import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import Listing from '../models/listing.model.js';

const router = express.Router();

router.post("/create", verifyToken, async (req, res, next) => {
	try {
		const listing = await Listing.create(req.body);
		return res.status(201).json(listing);
	}
	catch(err) {
		next(err);
	}
});

router.delete("/delete/:id", verifyToken, async (req, res, next) => {
		const listing = await Listing.findById(req.params.id);
		if(!listing) {
			return res.status(404).json("Listing not found.");
		}
		if(req.user.id !== listing.userRef) {
			return res.status(403).json("You are not allowed to delete this listing.");
		}

	try {
		await Listing.findByIdAndDelete(req.params.id);
		res.status(200).json("Listing has been deleted.");
	}
	catch(err) {
		next(err);
	}
});

export default router;