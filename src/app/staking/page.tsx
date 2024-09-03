// pages/staking.js
'use client';

import React, { useState } from 'react';
import Select, { components } from 'react-select';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';
import Image from 'next/image';
import StakeCard from '../../components/StakeCard';

// Custom styles for react-select
const customStyles = {
  control: (base) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)', // Glossy black
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white'
  }),
  menu: (base) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)', // Glossy black
  }),
  option: (base, { isFocused }) => ({
    ...base,
    background: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  input: (base) => ({
    ...base,
    color: 'white',
  }),
};

// Custom Option component to display image in the select dropdown
const CustomOption = (props) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <Image src={props.data.image} alt={props.data.label} width={24} height={24} className="mr-2" />
      {props.data.label}
    </div>
  </components.Option>
);

// Custom SingleValue component to display image in the selected value
const CustomSingleValue = (props) => (
  <components.SingleValue {...props}>
    <div className="flex items-center">
      <Image src={props.data.image} alt={props.data.label} width={24} height={24} className="mr-2" />
      {props.data.label}
    </div>
  </components.SingleValue>
);

// Define the staking duration options
const stakingDurations = [
  { value: 7, label: '7 Days' },
  { value: 14, label: '14 Days' },
  { value: 21, label: '21 Days' },
];

const stakedPools = [
  { tokenA: 'Token A', tokenB: 'Token B', liquidity: '200', imageA: '/promotions/planq.jpg', imageB: '/promotions/planq.jpg' },
  { tokenA: 'Token C', tokenB: 'Token D', liquidity: '150', imageA: '/promotions/planq.jpg', imageB: '/promotions/planq.jpg' },
];

function Staking() {
  // State for Pool Staking
  const [selectedPool, setSelectedPool] = useState<{ value: string; label: string; image: string } | null>(null);
  const [amountPool, setAmountPool] = useState('');
  const [stakingDurationPool, setStakingDurationPool] = useState<{ value: number; label: string } | null>(null);
  const [aprPool, setAprPool] = useState<number | null>(null);

  const tokenOptions = tokens.tokens.map((token) => ({
    value: token.name,
    label: token.name,
    image: token.image,
  }));

  const calculateApr = (duration: number, baseApr: number) => {
    const durationMultiplier = duration / 21; // Example multiplier
    return baseApr * durationMultiplier;
  };

  const handleStakePool = () => {
    if (selectedPool && stakingDurationPool) {
      const baseApr = 5; // Base APR
      setAprPool(calculateApr(stakingDurationPool.value, baseApr));
      // Add staking logic here
      console.log('Staking', amountPool, 'of', selectedPool, 'for', stakingDurationPool);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">CoFinance Staking Yield</h1>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl text-white mb-4">Your Staked Pools</h2>
        <div className="flex flex-col space-y-4 mb-8">
          {stakedPools.map((pool, index) => (
            <StakeCard key={index} pool={pool} />
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-center space-x-4">
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
            <h2 className="text-xl text-white mb-4">Pool Staking</h2>
            <div className="mb-4">
              <label className="block text-white mb-2">Pool</label>
              <Select
                options={tokenOptions}
                value={selectedPool}
                onChange={setSelectedPool}
                styles={customStyles}
                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                placeholder="Select pool"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Amount</label>
              <input
                type="number"
                value={amountPool}
                onChange={(e) => setAmountPool(e.target.value)}
                placeholder="Amount"
                className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Staking Duration</label>
              <div className="grid grid-cols-2 gap-4">
                {stakingDurations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => setStakingDurationPool(duration)}
                    className={`p-2 rounded text-white ${stakingDurationPool?.value === duration.value ? 'bg-gray-600' : 'bg-gray-700'}`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>
            <Button 
            onClick={handleStakePool}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
            >Stake Pool</Button>
            {aprPool && <p className="text-white mt-4">Estimated APR: {aprPool}%</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;
