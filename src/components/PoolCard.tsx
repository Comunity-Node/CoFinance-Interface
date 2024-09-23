import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/moving-border';
import AddLiquidityModal from './inner-page/AddLiquidityModal'; 
import WithdrawLiquidityModal from './inner-page/WithdrawLiquidityModal'; 

const DEFAULT_IMAGE_URL = '/tokens/CoFi.png';

interface PoolCardProps {
  pool: {
    address: string;
    liquidity?: {
      totalA: string;
      totalB: string;
    };
    tokenA?: {
      label: string;
      image: string;
    };
    tokenB?: {
      label: string;
      image: string;
    };
  };
}

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const handleButtonClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAddPool = () => {
    setAddModalOpen(true);
    setMenuOpen(false); 
  };

  const handleWithdrawPool = () => {
    setWithdrawModalOpen(true);
    setMenuOpen(false); 
  };

  return (
    <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 rounded-lg shadow-lg flex items-center">
      <div className="flex items-center">
        <Image
          src={pool.tokenA?.image || DEFAULT_IMAGE_URL}
          alt={pool.tokenA?.label || 'Default Token'}
          width={50}
          height={50}
          className="object-cover rounded-full"
        />
        <span className="mx-2 text-white">/</span>
        <Image
          src={pool.tokenB?.image || DEFAULT_IMAGE_URL}
          alt={pool.tokenB?.label || 'Default Token'}
          width={50}
          height={50}
          className="object-cover rounded-full"
        />
      </div>
      <div className="flex-grow px-4">
        <h3 className="text-xl font-semibold text-white">
          {pool.tokenA?.label || 'Token A'} / {pool.tokenB?.label || 'Token B'}
        </h3>
        {pool.liquidity ? (
          <>
            <p className="text-gray-400">Liquidity Token A: {pool.liquidity.totalA}</p>
            <p className="text-gray-400">Liquidity Token B: {pool.liquidity.totalB}</p>
          </>
        ) : (
          <p className="text-gray-400">Liquidity data not available</p>
        )}
      </div>
      <div className="relative">
        <Button
          onClick={handleButtonClick}
          className="text-white px-4 py-2 rounded-md focus:outline-none"
        >
          Actions
        </Button>
        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 text-white p-4 rounded-lg shadow-lg z-10 bg-gray-800">
            <button
              onClick={handleAddPool}
              className="block w-full text-left p-2 rounded-md hover:bg-gray-700"
            >
              Add
            </button>
            <button
              onClick={handleWithdrawPool}
              className="block w-full text-left p-2 rounded-md hover:bg-gray-700"
            >
              Withdraw
            </button>
          </div>
        )}
      </div>
      <AddLiquidityModal 
        open={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        tokenA={pool.tokenA} 
        tokenB={pool.tokenB} 
      />
      <WithdrawLiquidityModal 
        open={isWithdrawModalOpen} 
        onClose={() => setWithdrawModalOpen(false)} 
        tokenA={pool.tokenA} 
        tokenB={pool.tokenB} 
      />
    </div>
  );
};

export default PoolCard;
