// components/ChainSwitchButton.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/moving-border';
import { switchChain } from '../utils/wallet';

// Define the chain options, including Solana clusters
const chains = [
  { value: '0x1', label: 'Ethereum', soon: false, icon: 'https://www.logo.wine/a/logo/Ethereum/Ethereum-Logo.wine.svg' },
  { value: '0x50b', label: 'Swisstronik', soon: false, icon: 'https://s3-ap-southeast-2.amazonaws.com/www.cryptoknowmics.com/airdrops/SWTR_LOGO_SYMBOL_PNG.png' },
  { value: '0x61', label: 'BSC', soon: false, icon: 'https://i0.wp.com/www.followchain.org/wp-content/uploads/2024/03/icons8-bnb-330.png?fit=330%2C330&ssl=1' },
  { value: '0x1ba5', label: 'Planq', soon: false, icon: 'https://evm.planq.network/og-image.png' },
  { value: '0x67266a7', label: 'Orichain', soon: false, icon: 'https://images.prismic.io/uphold/3f0371cb-ed69-4a01-84cb-8b9c2a814421_ORAI%402x.png?auto=compress,format' },
  { value: '0x8274f', label: 'Scroll', soon: false, icon: 'https://global.discourse-cdn.com/standard11/uploads/scroll2/original/2X/3/3bc70fd653f9c50abbb41b7568e549535f768fcc.png' },
  { value: '0x2105', label: 'Base', soon: false, icon: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.webp' },
  { value: '0x103d', label: 'Cross Finance', soon: false, icon: 'https://miro.medium.com/v2/resize:fit:256/1*jTN3cYGlobHuPdnhu2lYhg.png' },
  { value: '0x89', label: 'Polygon', soon: false, icon: 'https://cdn-icons-png.freepik.com/512/12114/12114233.png' },
  { value: '-', label: 'Cardano', soon: true, icon: 'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-512.png' },
  { value: '-', label: 'Solana', soon: true, icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
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
        <div className="absolute right-0 mt-5 w-auto p-3 text-white border border-gray-900 bg-black shadow-lg shadow-blue-950 rounded-lg">
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
                  <span className=" inline-block py-1 px-3 text-xs font-regular text-white bg-transparent border border-gray-500 rounded-full">
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
