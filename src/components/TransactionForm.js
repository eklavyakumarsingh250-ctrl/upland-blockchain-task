import React, { useState } from 'react';
import { addSignedTransaction } from '../api/blockchain.api';
import { ec as EC } from 'elliptic'; // Standard library for secp256k1

const ec = new EC('secp256k1');

const TransactionForm = ({ wallet, onTransactionAdded }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet) return setStatus('❌ Generate a wallet first!');

    try {
      // 1. Create the Transaction Hash (Logic must match Backend)
      const timestamp = Date.now();
      const message = wallet.publicKey + toAddress + amount + timestamp;
      
      // 2. Task 1: Sign the message locally with the Private Key
      const key = ec.keyFromPrivate(wallet.privateKey);
      const signature = key.sign(message).toDER('hex');

      // 3. Send the SIGNED transaction to the API
      await addSignedTransaction(wallet.publicKey, toAddress, amount, signature);
      
      setStatus('✅ Transaction Signed & Sent!');
      onTransactionAdded(); // Refresh the UI
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="stats-card">
      <h3>💸 Send Credits</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="To Address (Public Key)" 
          value={toAddress} 
          onChange={(e) => setToAddress(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        />
        <button type="submit" className="mine-button">Sign & Send</button>
      </form>
      {status && <p className="status-msg">{status}</p>}
    </div>
  );
};

export default TransactionForm;
