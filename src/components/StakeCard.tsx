import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/moving-border'

const StakeCard = ({ pool }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleButtonClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAddPool = () => {
    console.log('Add pool');
    // Add logic to handle adding the pool
  };

  const handleWithdrawPool = () => {
    console.log('Withdraw pool');
    // Add logic to handle withdrawing the pool
  };

  return (
    <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 rounded-lg shadow-lg flex items-center">
      <Image src={pool.imageA} alt={pool.tokenA} width={50} height={50} />
      <div className="flex-grow px-4">
        <h3 className="text-xl font-semibold text-white">{pool.tokenA} / {pool.tokenB}</h3>
        <p className="text-gray-400">TotalShare: {pool.liquidity}</p>
      </div>
      <div className="relative">
        <Button
          onClick={handleButtonClick}
          className="text-white px-4 py-2 rounded-md focus:outline-none"
        >
          Actions
        </Button>
        {menuOpen && (
          <div className="absolute top-0 right-full mr-2 text-white p-4 rounded-lg shadow-lg z-10">
            <button
              onClick={handleAddPool}
              className="block w-full text-left p-2 hover:bg-gray-200 rounded-md"
            >
              Stake 
            </button>
            <button
              onClick={handleWithdrawPool}
              className="block w-full text-left p-2 hover:bg-gray-200 rounded-md"
            >
              Unstake 
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakeCard;
