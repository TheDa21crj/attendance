const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// Public
router.post(
  "/start",
  [check("values", "values is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { values } = req.body;

    try {
      console.log(values);
      console.log(typeof values);
      return res.status(202).json("Success");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
);

module.exports = router;
