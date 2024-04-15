import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import Listing from "../models/listing.model.js";

const router = express.Router();

router.post("/create", verifyToken, async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
});

router.delete("/delete/:id", verifyToken, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json("Listing not found.");
    }
    if (req.user.id !== listing.userRef) {
      return res
        .status(403)
        .json("You are not allowed to delete this listing.");
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted.");
  } catch (err) {
    next(err);
  }
});

router.post("/update/:id", verifyToken, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json("Listing not found.");
    }
    if (req.user.id !== listing.userRef) {
      return res
        .status(403)
        .json("You are not allowed to update this listing.");
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
	try {
		const listing = await Listing.findById(req.params.id);
		if(!listing) {
			return res.status(404).json("Listing not found.");
		}
		res.status(200).json(listing);
	}
	catch(err) {
		next(err);
	}
});

router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const stratIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if(offer === undefined || offer === 'false') {
      offer = { $in: [true, false] };
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false') {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if(parking === undefined || parking === 'false') {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if(type === undefined || type === 'all') {
      type = { $in: ['sell', 'rent'] };
    }

    let searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type
    }).sort({ [sort]: order }).limit(limit).skip(stratIndex);

    res.status(200).json(listings);

  }
  catch(err) {
    next(err);
  }
});

export default router;
