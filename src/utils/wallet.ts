import { ethers } from 'ethers';

export const connectMetaMask = async (): Promise<string | null> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0] || null;
    } catch (error) {
      console.error('User rejected the request:', error);
      throw new Error('User rejected the request');
    }
  } else {
    console.error('MetaMask is not installed');
    throw new Error('MetaMask is not installed');
  }
};

export const switchChain = async (chainId: string): Promise<void> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        console.error('Chain not found. Please add the chain to MetaMask.');
      } else {
        console.error('Error switching chains:', error);
      }
    }
  } else {
    console.error('MetaMask is not installed.');
    throw new Error('MetaMask is not installed.');
  }
};

export const signMessage = async (message: string): Promise<string> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner(account);
      
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw new Error('Error signing message');
    }
  } else {
    console.error('MetaMask is not installed');
    throw new Error('MetaMask is not installed');
  }
};
