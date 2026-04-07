import client from './client';
import ENDPOINTS from './endpoints';

export const fetchChain = () => client.get(ENDPOINTS.CHAIN);
export const fetchStats = () => client.get(ENDPOINTS.STATS);

/**
 * Task 1: Requests a new ECDSA key pair from the server.
 */
export const generateNewWallet = () => client.post(ENDPOINTS.WALLETS);

/**
 * Task 1: Sends a SIGNED transaction to the backend.
 */
export const addSignedTransaction = (fromAddress, toAddress, amount, signature) =>
  client.post(ENDPOINTS.TRANSACTIONS, { fromAddress, toAddress, amount, signature });

export const mineBlock = (miningRewardAddress) =>
  client.post(ENDPOINTS.MINE, { miningRewardAddress });

export const fetchBalance = (address) =>
  client.get(ENDPOINTS.balance(address));
