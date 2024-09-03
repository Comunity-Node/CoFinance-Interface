'use client';
import React from 'react';
import { ethers } from 'ethers';

type AccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
};

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, account, setAccount }) => {
  const handleChangeAccount = async () => {
    setAccount(null);
    try {
      if ((window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
      } else {
        console.error("No Ethereum provider detected");
      }
    } catch (err) {
      console.error("Failed to request accounts:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '400px',
      backgroundColor: '#1a202c',
      border: '1px solid #2d3748',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      zIndex: '1000',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 'bold' }}>Account</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#e2e8f0',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Close
        </button>
      </div>

      <div style={{
        borderRadius: '8px',
        border: '1px solid #2d3748',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#2d3748',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ color: '#e2e8f0', fontSize: '14px' }}>Connected with MetaMask</span>
          <button
            onClick={handleChangeAccount}
            style={{
              background: 'none',
              border: '1px solid #2b6cb0',
              borderRadius: '4px',
              color: '#2b6cb0',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '4px 8px',
            }}
          >
            Change
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          {/* Assuming Identicon component is defined elsewhere */}
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#e2e8f0',
            borderRadius: '50%',
            marginRight: '8px',
          }}></div>
          <span style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '600' }}>
            {account && `${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <button
            onClick={() => navigator.clipboard.writeText(account || '')}
            style={{
              background: 'none',
              border: 'none',
              color: '#e2e8f0',
              cursor: 'pointer',
              fontSize: '14px',
              marginRight: '16px',
            }}
          >
            Copy Address
          </button>
          <a
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#e2e8f0',
              fontSize: '14px',
              textDecoration: 'underline',
            }}
          >
            View on Explorer
          </a>
        </div>
      </div>

      <p style={{ color: '#e2e8f0', fontSize: '16px', textAlign: 'left', marginTop: 'auto' }}>
        Your transactions will appear here...
      </p>
    </div>
  );
};

export default AccountModal;
