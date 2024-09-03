// components/ChainSwitchButton.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/moving-border';
import { switchChain } from '../utils/wallet'; 

// Define the chain options, including Solana clusters
const chains = [
  { value: '0x1', label: 'Ethereum' }, 
  { value: '0x50b', label: 'Swisstronik' },
  { value: '0x61', label: 'BSC' }, 
  { value: '0x1ba5', label: 'Planq' }, 
  { value: '0x67266a7', label: 'Orichain' },
  { value: '0x8274f', label: 'Scroll' },
  { value: '0x2105', label: 'Base' },
  { value: '0x103d', label: 'Cross Finance' },
  { value: '0x89', label: 'Polygon' },
  { value: '-', label: 'Cardano (Soon)' },
  { value: '-', label: 'Solana (Soon)' },
];

const ChainSwitchButton: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleSwitchChain = async (chainId: string) => {
    try {
      if (chainId.startsWith('solana')) {
        console.log(`Selected ${chainId}, switching Solana cluster.`);
        setSelectedChain(chainId);
        setMenuOpen(false); 
      } else {
        await switchChain(chainId);
        setSelectedChain(chainId);
        setMenuOpen(false);
        console.log(`Switched to chain ID: ${chainId}`);
      }
    } catch (err) {
      console.error("Failed to switch chain:", err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        className="mr-2"
        onClick={() => setMenuOpen(prev => !prev)} // Toggle menu visibility
      >
        {selectedChain ? chains.find(chain => chain.value === selectedChain)?.label : 'Select Chain'}
      </Button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white border border-gray-600 rounded-md shadow-lg">
          {chains.map((chain) => (
            <button
              key={chain.value}
              onClick={() => handleSwitchChain(chain.value)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-700"
            >
              {chain.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainSwitchButton;
