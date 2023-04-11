const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// Public
router.post(
  "/start",
  [check("payload", "payload is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { payload } = req.body;

    try {
      return res.status(202).json({ message: payload });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
);

module.exports = router;
