// components/ChainSwitchButton.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/moving-border';
import { switchChain } from '../utils/wallet';
import { IoIosGitNetwork } from "react-icons/io";

// Define the chain options, including Solana clusters
const chains = [
  { value: '0x34816e', label: 'Manta Network', soon: false, icon: 'https://seeklogo.com/images/M/manta-network-manta-logo-D595CAF1F9-seeklogo.com.png' },
  { value: '0x8274f', label: 'Scroll', soon: false, icon: 'https://global.discourse-cdn.com/standard11/uploads/scroll2/original/2X/3/3bc70fd653f9c50abbb41b7568e549535f768fcc.png' },
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
    <div className="relative inline-block text-left w-full">
      <Button
        className="mr-2"
        onClick={() => setMenuOpen(prev => !prev)} // Toggle menu visibility
      >
        {selectedChain ? (
          <img
            src={chains.find(chain => chain.value === selectedChain)?.icon}
            alt={chains.find(chain => chain.value === selectedChain)?.label}
            style={{ width: '24px', marginRight: '8px' }}
          />
        ) : (
          <IoIosGitNetwork style={{ marginRight: '8px' }} />
        )}
        {selectedChain ? chains.find(chain => chain.value === selectedChain)?.label : 'Select Chain'}
      </Button>

      {menuOpen && (
        <div className="absolute right-0 mt-5 w-64 p-3 text-white border border-gray-900 bg-black shadow-lg ">
          {chains.map((chain) => (
            <button
              key={chain.value}
              onClick={() => handleSwitchChain(chain.value)}
              className={`block w-full px-4 py-2 text-left hover:bg-gray-500 rounded-lg space-y-3 ${chain.soon ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={chain.soon}
            >
              <div className="flex items-center justify-between space-x-10">
                <div className="flex items-center">
                  {chain.icon && (
                    <img src={chain.icon} alt={`${chain.label} icon`} className="w-6 h-6 mr-3" />
                  )}
                  <span>{chain.label}</span>
                </div>
                {chain.soon && (
                  <span className=" inline-block py-1 px-3 text-xs font-regular text-white bg-black border border-gray-500 rounded-full">
                    Soon
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

      )}
    </div>
  );
};

export default ChainSwitchButton;
