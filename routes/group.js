const express = require("express");
const Group = require("../models/group");

const router = express.Router();

// Create group
router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      coverImage,
      profileImage,
      description,
      categoryKey,
      membersCount,
    } = req.body;

    const existingGroup = await Group.findOne({ slug: slug.trim().toLowerCase() });
    if (existingGroup) {
      return res.status(400).json({ message: "Group already exists" });
    }

    const newGroup = new Group({
      title,
      slug: slug.trim().toLowerCase(),
      coverImage: coverImage || "",
      profileImage: profileImage || "",
      description: description || "",
      categoryKey: categoryKey ? categoryKey.trim().toLowerCase() : "",
      membersCount: membersCount || 0,
    });

    await newGroup.save();

    res.status(201).json({
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create group",
      error: error.message,
    });
  }
});

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch groups",
      error: error.message,
    });
  }
});

// Get single group by slug
router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug.trim().toLowerCase();

    const group = await Group.findOne({ slug, isActive: true });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch group",
      error: error.message,
    });
  }
});

module.exports = router;