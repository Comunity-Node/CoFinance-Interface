// components/ChainSwitchButton.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/moving-border';
import { switchChain } from '../utils/wallet';
import { IoIosGitNetwork } from "react-icons/io";

// Define the chain options, including Solana clusters
const chains = [
  { value: '0x103d', label: 'Cross Finance', soon: false, icon: 'https://miro.medium.com/v2/resize:fit:256/1*jTN3cYGlobHuPdnhu2lYhg.png' },
  { value: '0x1', label: 'Taiko', soon: false, icon: 'https://s2.coinmarketcap.com/static/img/coins/200x200/31525.png' },
  { value: '0x61', label: 'Binance Smart Chain', soon: false, icon: 'https://i0.wp.com/www.followchain.org/wp-content/uploads/2024/03/icons8-bnb-330.png?fit=330%2C330&ssl=1' },
  { value: '0x50b', label: 'Swisstronik', soon: false, icon: 'https://s3-ap-southeast-2.amazonaws.com/www.cryptoknowmics.com/airdrops/SWTR_LOGO_SYMBOL_PNG.png' },
  { value: '0x1ba5', label: 'Planq', soon: false, icon: 'https://planq.network/_next/image?url=https%3A%2F%2Fcdn.builder.io%2Fapi%2Fv1%2Fimage%2Fassets%252F9770b285ecd94682a83d82643e538cdf%252F352051f7ea1344578a069ae40f99d9d1&w=256&q=75' },
  { value: '0x67266a7', label: 'Sei', soon: false, icon: 'https://www.tbstat.com/wp/uploads/2023/10/Sei_Logo_-_Transparent.png' },
  { value: '-', label: 'Cardano', soon: true, icon: 'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-512.png' },
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
    <div className="relative inline-block text-left z-50">
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
        <div className="absolute right-0 mt-5 z-50 w-auto p-3 text-white border border-gray-900 bg-black shadow-lg ">
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
