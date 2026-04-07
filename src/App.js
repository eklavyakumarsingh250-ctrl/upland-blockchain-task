import React, { useState } from 'react';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import BlockchainViewer from './components/BlockchainViewer';
import TransactionForm from './components/TransactionForm';
import Wallet from './components/Wallet'; // Task 1: Import
import useBlockchain from './hooks/useBlockchain';

function App() {
  const { chain, stats, refresh } = useBlockchain();
  const [activeWallet, setActiveWallet] = useState(null);

  return (
    <div className="App">
      <Header />
      <div className="app-container">
        <div className="main-content">
          <div className="left-panel">
            <Wallet onWalletLoaded={setActiveWallet} />
            <StatsPanel stats={stats} onMine={refresh} />
            <TransactionForm wallet={activeWallet} onTransactionAdded={refresh} />
          </div>
          <div className="right-panel">
            <BlockchainViewer blockchain={chain} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
