'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/moving-border';
import ChainSwitchButton from './SwitchChain'; // Update path as necessary
import { connectMetaMask } from '../utils/wallet'; // Update path as necessary

interface ConnectButtonProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ account, setAccount }) => {
  const [connected, setConnected] = React.useState<boolean>(!!account);
  const [visible, setVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  React.useEffect(() => {
    setConnected(!!account);
  }, [account]);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > lastScrollTop) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const handleConnectMetaMask = async () => {
    try {
      const address = await connectMetaMask();
      if (address) {
        console.log(address);
        setAccount(address);
        setConnected(true);
      } else {
        console.error("Failed to connect MetaMask.");
      }
    } catch (err) {
      console.error("Failed to connect MetaMask:", err);
    }
  };

  const handleDisconnectWallet = () => {
    setAccount(null);
    setConnected(false);
  };

  return (
    <div
      className={`fixed top-10 right-4 z-50 transition-transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center space-x-4">
        <ChainSwitchButton />
        <Button onClick={connected ? handleDisconnectWallet : handleConnectMetaMask}>
          {connected ? `${account?.substring(0, 6)}...${account?.substring(account.length - 4)}` : 'Connect Wallet'}
        </Button>
      </div>
    </div>
  );
};

export default ConnectButton;
