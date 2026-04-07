const { Router } = require('express');
const { generateWallet } = require('../controllers/wallet.controller');
const { writeLimiter } = require('../middleware/rateLimit.middleware');

const router = Router();

// We apply the writeLimiter to prevent bot spamming wallet generation
router.post('/', writeLimiter, generateWallet);

module.exports = router;
