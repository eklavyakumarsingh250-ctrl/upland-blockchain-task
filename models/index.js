const { Blockchain, Transaction } = require('./blockchain');
const config = require('../config');
const persistenceService = require('../services/persistence.service');
const logger = require('../utils/logger');

const { difficulty, miningReward } = config.blockchain;

/**
 * Task 2: Initialize Blockchain with Persistence
 * We load the state from disk if it exists, otherwise start fresh.
 */
const initBlockchain = async () => {
  const blockchain = new Blockchain(difficulty, miningReward);
  const savedState = await persistenceService.load();

  if (savedState) {
    try {
      // Restore chain and transactions
      // Re-instantiate Blocks/Transactions so they have their methods
      blockchain.chain = savedState.chain;
      blockchain.pendingTransactions = savedState.pendingTransactions;
      
      if (!blockchain.isChainValid()) {
        logger.warn('Loaded chain is invalid. Starting fresh for security.');
        return new Blockchain(difficulty, miningReward);
      }
    } catch (err) {
      logger.error('Failed to restore blockchain state. Starting fresh.');
    }
  } else if (config.demoData.enabled) {
    // Seed demo data only if no saved state exists
    config.demoData.transactions.forEach(({ from, to, amount }) => {
      blockchain.addTransaction(new Transaction(from, to, amount));
    });
    blockchain.minePendingTransactions(config.blockchain.initialMinerAddress);
  }

  return blockchain;
};

// We export a promise-based singleton for the app
const blockchainPromise = initBlockchain();

module.exports = { 
  blockchainPromise, 
  Transaction,
  // Helper to get the resolved blockchain instance
  getBlockchain: async () => await blockchainPromise 
};
