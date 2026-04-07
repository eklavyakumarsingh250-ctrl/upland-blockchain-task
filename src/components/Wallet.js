import React, { useState, useEffect } from 'react';
import { generateNewWallet, fetchBalance } from '../api/blockchain.api';

const Wallet = ({ onWalletLoaded }) => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);

  const createWallet = async () => {
    try {
      const data = await generateNewWallet();
      setWallet(data); // Contains { publicKey, privateKey }
      onWalletLoaded(data); // Pass to parent (App.js) to use for signing
    } catch (err) {
      console.error("Wallet generation failed", err);
    }
  };

  useEffect(() => {
    if (wallet?.publicKey) {
      const updateBalance = async () => {
        const res = await fetchBalance(wallet.publicKey);
        setBalance(res.balance);
      };
      updateBalance();
    }
  }, [wallet]);

  return (
    <div className="stats-card">
      <h3>🔐 Your Wallet</h3>
      {!wallet ? (
        <button className="mine-button" onClick={createWallet}>Generate New Wallet</button>
      ) : (
        <div className="wallet-info">
          <p><strong>Address:</strong> <code className="hash-text">{wallet.publicKey.substring(0, 15)}...</code></p>
          <p><strong>Balance:</strong> {balance} Credits</p>
          <p className="warning-text">⚠️ Private Key stored locally for signing.</p>
        </div>
      )}
    </div>
  );
};

export default Wallet;
