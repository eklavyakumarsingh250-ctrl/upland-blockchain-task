const { blockchain, Transaction } = require('../models');
const persistenceService = require('../services/persistence.service');
const { sendSuccess, sendCreated, sendError } = require('../utils/response');
const { isValidAddress, isValidAmount, sanitizeAddress, sanitizeAmount } = require('../utils/validator');

/**
 * Task 1 & 2: Adds a new signed transaction to the pending pool.
 */
const addTransaction = async (req, res, next) => {
  try {
    const { fromAddress, toAddress, amount, signature } = req.body;

    // 1. Basic Validation
    if (!isValidAddress(fromAddress) || !isValidAddress(toAddress)) {
      return sendError(res, 'Invalid wallet address format', 400);
    }
    if (!isValidAmount(amount)) {
      return sendError(res, 'Amount must be a positive number', 400);
    }

    // 2. Create Transaction Instance
    const transaction = new Transaction(
      sanitizeAddress(fromAddress),
      sanitizeAddress(toAddress),
      sanitizeAmount(amount)
    );
    
    // Attach the signature sent from the frontend
    transaction.signature = signature;

    // 3. Task 1: The model will now check if transaction.isValid()
    // If signature is missing or wrong, this will throw an error
    blockchain.addTransaction(transaction);

    // 4. Task 2: Auto-save the pending pool to disk
    await persistenceService.save(blockchain);

    sendCreated(res, {
      message: 'Transaction signed and added to pending pool',
      transaction,
    });
  } catch (err) {
    // If the signature is invalid, blockchain.addTransaction throws an error
    // which is caught here and sent back to the user.
    sendError(res, err.message, 400);
  }
};

const getPendingTransactions = (req, res) => {
  sendSuccess(res, {
    pendingTransactions: blockchain.pendingTransactions,
    count: blockchain.pendingTransactions.length,
  });
};

const getAllTransactions = (req, res) => {
  const transactions = blockchain.getAllTransactions();
  sendSuccess(res, { transactions, count: transactions.length });
};

module.exports = { addTransaction, getPendingTransactions, getAllTransactions };
