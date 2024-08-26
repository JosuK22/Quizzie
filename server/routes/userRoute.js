const express = require('express');
const { updateUser, getUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Updated import

const router = express.Router();

router.patch('/', protect, updateUser);
router.get('/', protect, getUser);

module.exports = router;
