const fs = require('fs/promises');
const path = require('path');
const logger = require('../utils/logger');

const STORAGE_PATH = path.join(__dirname, '../blockchain.json');

/**
 * Task 2: Persistence Service
 * Handles saving and loading the blockchain state to a JSON file.
 * File structure: { chain: Array, pendingTransactions: Array }
 */
class PersistenceService {
  /**
   * Saves the current state of the blockchain to disk.
   */
  async save(blockchain) {
    try {
      const data = JSON.stringify({
        chain: blockchain.chain,
        pendingTransactions: blockchain.pendingTransactions
      }, null, 2);
      
      await fs.writeFile(STORAGE_PATH, data);
      logger.info('Blockchain state saved successfully to disk.');
    } catch (err) {
      logger.error(`Failed to save blockchain: ${err.message}`);
    }
  }

  /**
   * Loads the blockchain state from disk.
   * Returns the data object or null if no file exists.
   */
  async load() {
    try {
      const data = await fs.readFile(STORAGE_PATH, 'utf8');
      logger.info('Blockchain state loaded from disk.');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        logger.warn('No saved blockchain found. Starting fresh.');
        return null;
      }
      logger.error(`Corruption or read error: ${err.message}`);
      return null;
    }
  }

  /**
   * Clears the saved state (for testing purposes).
   */
  async clear() {
    try {
      await fs.unlink(STORAGE_PATH);
      logger.info('Saved blockchain state cleared.');
    } catch (err) {
      logger.error(`Clear failed: ${err.message}`);
    }
  }
}

module.exports = new PersistenceService();
