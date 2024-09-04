'use client';
import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';
import { getTokenInfo } from '../../utils/TokenUtils';
import { createPool } from '../../utils/Factory'; 

import { ethers } from 'ethers';

const promptMetaMaskSign = async (message: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  // Initialize provider and signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Request MetaMask to sign the message
  const signature = await signer.signMessage(message);

  return signature;
};

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

const CustomOption = (props) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2 rounded-full" />
      {props.data.label}
    </div>
  </components.Option>
);

const CustomSingleValue = (props) => (
  <components.SingleValue {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2 rounded-full" />
      {props.data.label}
    </div>
  </components.SingleValue>
);


function AddPool() {
  const [tokenA, setTokenA] = useState<{ value: string; label: string; image: string } | null>(null);
  const [tokenB, setTokenB] = useState<{ value: string; label: string; image: string } | null>(null);
  const [poolName, setPoolName] = useState('');
  const [priceFeed, setPriceFeed] = useState('');
  const [rewardToken, setRewardToken] = useState('');
  const [isIncentivized, setIsIncentivized] = useState(false);
  const [tokenOptions, setTokenOptions] = useState(tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  })));

  const handleAddCustomOption = async (inputValue, setSelectedOption) => {
    if (ethers.isAddress(inputValue)) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenInfo = await getTokenInfo(provider, inputValue);
      if (tokenInfo) {
        setTokenOptions((prevOptions) => [...prevOptions, tokenInfo]);
        setSelectedOption(tokenInfo);
      } else {
        alert('Failed to fetch token info');
      }
    } else {
      alert('Invalid address');
    }
  };

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
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Add Liquidity to Pool</h1>

      <div className="text-center text-white mb-12"></div>

      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
          <div className="mb-4">
            <input
              type="text"
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              placeholder="Pool Name"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4 flex items-center">
            <CreatableSelect
              isClearable
              options={tokenOptions}
              value={tokenA}
              onChange={setTokenA}
              onCreateOption={(inputValue) => handleAddCustomOption(inputValue, setTokenA)}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select or Enter Token"
              className="w-full" 
            />
          </div>
          <div className="mb-4 flex items-center">
            <CreatableSelect
              isClearable
              options={tokenOptions}
              value={tokenB}
              onChange={setTokenB}
              onCreateOption={(inputValue) => handleAddCustomOption(inputValue, setTokenB)}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select or Enter Token"
              className="w-full" 
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={priceFeed}
              onChange={(e) => setPriceFeed(e.target.value)}
              placeholder="Price Feed Address"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={rewardToken}
              onChange={(e) => setRewardToken(e.target.value)}
              placeholder="Reward Token Address"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={"CofinanceLiquidity"}
              readOnly
              placeholder="Liquidity Token Name"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
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
    </div>
  );
}

export default AddPool;
