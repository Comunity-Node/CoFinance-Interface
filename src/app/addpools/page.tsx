'use client';
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';
import { getTokenInfo } from '../../utils/TokenUtils';
import { createPool } from '../../utils/Factory'; 
import { ethers } from 'ethers';
import { components } from 'react-select';

// Custom styles for React Select
const customStyles = {
  control: (base) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)', // Glossy black
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
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
};

const CustomOption = (props) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2 rounded-full" />
      {props.data.label}
    </div>
  </components.Option>
);

const AddPool: React.FC = () => {
  const [tokenA, setTokenA] = useState(null);
  const [tokenB, setTokenB] = useState(null);
  const [poolName, setPoolName] = useState('');
  const [priceFeed, setPriceFeed] = useState('');
  const [rewardToken, setRewardToken] = useState('');
  const [isIncentivized, setIsIncentivized] = useState(false);
  const [tokenOptions, setTokenOptions] = useState(tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  })));

  const handleAddPool = async () => {
    if (!tokenA || !tokenB || !rewardToken || !priceFeed) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const message = `Creating pool with: ${tokenA.label} and ${tokenB.label}`;
      const signature = await promptMetaMaskSign(message);
      console.log('Signature:', signature);
      const poolAddress = await createPool(
        provider,
        tokenA.value,
        tokenB.value,
        rewardToken,
        priceFeed,
        poolName,
        isIncentivized
      );
      alert('Pool added successfully');
      console.log('Pool added successfully. Contract address:', poolAddress);
    } catch (error) {
      console.error('Error adding pool:', error);
    }
  };

  return (
    <section className="min-h-screen bg-borrow bg-no-repeat bg-contain text-center">
      <div className="pt-40 px-96 space-y-5">
        <h1 className="text-4xl font-bold text-white mb-8">Create New Pools</h1>
        <div className="bg-[#141414] rounded-xl p-6 space-y-4">
          <input
            type="text"
            value={poolName}
            onChange={(e) => setPoolName(e.target.value)}
            placeholder="Pool Name"
            className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
          />
          <CreatableSelect
            isClearable
            options={tokenOptions}
            value={tokenA}
            onChange={setTokenA}
            styles={customStyles}
            components={{ Option: CustomOption }}
            placeholder="Select or Enter Token A"
            className="w-full"
          />
          <CreatableSelect
            isClearable
            options={tokenOptions}
            value={tokenB}
            onChange={setTokenB}
            styles={customStyles}
            components={{ Option: CustomOption }}
            placeholder="Select or Enter Token B"
            className="w-full"
          />
          <input
            type="text"
            value={priceFeed}
            onChange={(e) => setPriceFeed(e.target.value)}
            placeholder="Price Feed Address"
            className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
          />
          <input
            type="text"
            value={rewardToken}
            onChange={(e) => setRewardToken(e.target.value)}
            placeholder="Reward Token Address"
            className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isIncentivized}
              onChange={(e) => setIsIncentivized(e.target.checked)}
              className="mr-2"
            />
            <span className="text-white">Incentivized Pool</span>
          </div>
          <div className="text-center">
            <Button
              onClick={handleAddPool}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
            >
              Add Pool
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddPool;
