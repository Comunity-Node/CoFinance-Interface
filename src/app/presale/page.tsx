'use client';

import React from 'react';
import PresaleCard from '../../components/presaleCard';

// Type for presale pool
interface PresalePool {
  token: string;
  amount: string;
  image: string;
  description: string;
  softCap: string;
  hardCap: string;
  accumulatedCap: string;
}

const presalePools: PresalePool[] = [
  { 
    token: 'CoFi', 
    amount: '500', 
    image: '/tokens/CoFi.png',
    description: 'A revolutionary new token offering. Visit our website for more details.',
    website: 'https://www.cofinance.io',
    softCap: '1000 XFI',
    hardCap: '5000 XFI',
    accumulatedCap: '1200 XFI'
  },
  { 
    token: 'CoFi', 
    amount: '300', 
    image: '/tokens/CoFi.png',
    description: 'An innovative project with great potential. Learn more on our website.',
    website: 'https://www.cofinance.io',
    softCap: '2000 USDT',
    hardCap: '7000 USDT',
    accumulatedCap: '3000 USDT'
  },
];


const Presale: React.FC = () => {
  const handleParticipate = (token: string, amount: string) => {
    // Handle the participation logic here
    console.log('Participating in presale with', amount, 'of', token);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">CoFinance Presale</h1>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl text-white mb-4">Active Presale</h2>
        <div className="flex flex-col space-y-4 mb-8">
          {presalePools.map((pool, index) => (
            <PresaleCard key={index} pool={pool} onParticipate={handleParticipate} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Presale;
