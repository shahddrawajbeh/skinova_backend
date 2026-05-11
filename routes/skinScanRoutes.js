const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadDir = "uploads/skin-scans";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

router.post(
  "/analyze",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const frontImage = req.files?.frontImage?.[0];
      const leftImage = req.files?.leftImage?.[0];
      const rightImage = req.files?.rightImage?.[0];

      if (!frontImage || !leftImage || !rightImage) {
        return res.status(400).json({
          message: "Please upload front, left, and right face images.",
        });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const scanImages = {
        front: `${baseUrl}/${frontImage.path.replace(/\\/g, "/")}`,
        left: `${baseUrl}/${leftImage.path.replace(/\\/g, "/")}`,
        right: `${baseUrl}/${rightImage.path.replace(/\\/g, "/")}`,
      };

      return res.status(200).json({
        skinScore: 72,
        skinType: "Combination",
        severity: "Moderate",

        conditions: [
          "Acne",
          "Redness",
          "Dark spots",
          "Uneven texture",
        ],

        expertAnalysis:
          "Your skin scan used front, left, and right face photos. Your skin shows signs of combination skin with an oily T-zone and normal-to-dry cheeks. Mild acne and redness are visible, especially around the cheeks and forehead. Some dark spots may be post-acne marks. A gentle routine with hydration, acne control, and daily sunscreen is recommended.",

        scanImages,

        morningRoutine: [
          {
            step: 1,
            name: "Gentle Cleanser",
            duration: "60 sec",
            instruction:
              "Use a gentle cleanser with lukewarm water. Avoid harsh scrubbing because it can irritate the skin.",
            category: "Cleanse",
          },
          {
            step: 2,
            name: "Niacinamide Serum",
            duration: "30 sec",
            instruction:
              "Apply a few drops to help control oil, reduce redness, and support the skin barrier.",
            category: "Treat",
          },
          {
            step: 3,
            name: "Light Moisturizer",
            duration: "30 sec",
            instruction:
              "Use a lightweight moisturizer to keep the skin hydrated without making it too oily.",
            category: "Moisturize",
          },
          {
            step: 4,
            name: "Sunscreen SPF 50",
            duration: "30 sec",
            instruction:
              "Apply sunscreen every morning. This helps protect the skin and prevents dark spots from becoming worse.",
            category: "Protect",
          },
        ],

        nightRoutine: [
          {
            step: 1,
            name: "Gentle Cleanser",
            duration: "60 sec",
            instruction:
              "Clean your face at night to remove sunscreen, oil, sweat, and dirt.",
            category: "Cleanse",
          },
          {
            step: 2,
            name: "Salicylic Acid",
            duration: "1 min",
            instruction:
              "Use 2-3 times per week to help with acne, clogged pores, and oily areas. Do not overuse it.",
            category: "Treat",
          },
          {
            step: 3,
            name: "Hydrating Serum",
            duration: "30 sec",
            instruction:
              "Apply hyaluronic acid or another hydrating serum to keep the skin comfortable and hydrated.",
            category: "Hydrate",
          },
          {
            step: 4,
            name: "Barrier Repair Cream",
            duration: "30 sec",
            instruction:
              "Use a moisturizer with calming ingredients to support and repair the skin barrier overnight.",
            category: "Moisturize",
          },
        ],
      });
    } catch (error) {
      return res.status(500).json({
        message: "Skin analysis failed",
        error: error.message,
      });
    }
  }
);

module.exports = router;