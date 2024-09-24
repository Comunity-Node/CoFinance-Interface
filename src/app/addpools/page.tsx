'use client';
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';
import { getTokenInfo } from '../../utils/TokenUtils';
import { createPool } from '../../utils/Factory'; 
import { ethers } from 'ethers';
import { components } from 'react-select';

const promptMetaMaskSign = async (message: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(message);
  return signature;
};

const customStyles = {
  control: (base) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  }),
  menu: (base) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)',
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

function AddPool() {
  const [tokenA, setTokenA] = useState<{ value: string; label: string; image: string } | null>(null);
  const [tokenB, setTokenB] = useState<{ value: string; label: string; image: string } | null>(null);
  const [poolName, setPoolName] = useState('');
  const [priceFeed, setPriceFeed] = useState('0xCeF22be4B4209fbDF23330Fd85dA490693B6C8bf'); // Set default price feed
  const [rewardToken, setRewardToken] = useState<{ value: string; label: string; image: string } | null>(null);
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
        rewardToken.value,
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
            onCreateOption={(inputValue) => handleAddCustomOption(inputValue, setTokenA)}
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
            onCreateOption={(inputValue) => handleAddCustomOption(inputValue, setTokenB)}
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
          <CreatableSelect
            isClearable
            options={tokenOptions}
            value={rewardToken}
            onChange={setRewardToken}
            onCreateOption={(inputValue) => handleAddCustomOption(inputValue, setRewardToken)}
            styles={customStyles}
            components={{ Option: CustomOption }}
            placeholder="Select or Enter Reward Token"
            className="w-full"
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
