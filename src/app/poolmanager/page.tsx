'use client';
import React, { useState } from 'react';
import Select, { components } from 'react-select';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';
import { ethers } from 'ethers';

// Replace with your smart contract ABI and address
const POOL_MANAGER_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "tokenA", "type": "address" },
      { "name": "tokenB", "type": "address" },
      { "name": "rewardToken", "type": "address" },
      { "name": "priceFeed", "type": "address" },
      { "name": "liquidityToken", "type": "address" },
      { "name": "stakingContract", "type": "address" },
      { "name": "isPoolIncentivized", "type": "bool" }
    ],
    "name": "createCoFinanceContract",
    "outputs": [{ "name": "", "type": "address" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "poolAddress", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "depositIntoIncentivePool",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "poolAddress", "type": "address" },
      { "name": "rewardToken", "type": "address" },
      { "name": "isIncentivized", "type": "bool" }
    ],
    "name": "updatePoolIncentivization",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "tokenA", "type": "address" },
      { "name": "tokenB", "type": "address" },
      { "name": "amountA", "type": "uint256" },
      { "name": "amountB", "type": "uint256" }
    ],
    "name": "addLiquidity",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "tokenA", "type": "address" },
      { "name": "tokenB", "type": "address" },
      { "name": "amountA", "type": "uint256" },
      { "name": "amountB", "type": "uint256" }
    ],
    "name": "withdrawLiquidity",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const POOL_MANAGER_ADDRESS = 'YOUR_CONTRACT_ADDRESS'; // Replace with your actual contract address

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
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
      {props.data.label}
    </div>
  </components.Option>
);

// Custom SingleValue component to display image in the selected value
const CustomSingleValue = (props) => (
  <components.SingleValue {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
      {props.data.label}
    </div>
  </components.SingleValue>
);

function PoolsManager() {
  const [tokenA, setTokenA] = useState<{ value: string; label: string; image: string } | null>(null);
  const [tokenB, setTokenB] = useState<{ value: string; label: string; image: string } | null>(null);
  const [rewardToken, setRewardToken] = useState('');
  const [priceFeed, setPriceFeed] = useState('');
  const [liquidityToken, setLiquidityToken] = useState('');
  const [stakingContract, setStakingContract] = useState('');
  const [isIncentivized, setIsIncentivized] = useState(false);
  const [action, setAction] = useState<'withdraw' | 'add' | 'incentivize' | 'updateIncentivization'>('incentivize');
  const [poolAddress, setPoolAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');

  const tokenOptions = tokens.tokens.map((token) => ({
    value: token.address,
    label: token.name,
    image: token.image,
  }));

  const handleAction = async () => {
    if (action === 'incentivize' && (!poolAddress || !amount)) {
      alert('Please fill in all required fields.');
      return;
    }

    if (action === 'updateIncentivization' && (!poolAddress || !rewardToken)) {
      alert('Please fill in all required fields.');
      return;
    }

    if (action === 'add' && (!tokenA || !tokenB || !amountA || !amountB)) {
      alert('Please fill in all required fields.');
      return;
    }

    if (action === 'withdraw' && (!tokenA || !tokenB || !amountA || !amountB)) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Initialize ethers provider and contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const poolManager = new ethers.Contract(POOL_MANAGER_ADDRESS, POOL_MANAGER_ABI, signer);
        if (action === 'incentivize') {
          const tx = await poolManager.depositIntoIncentivePool(poolAddress, ethers.parseUnits(amount, 18));
          await tx.wait();
          alert('Deposit into incentive pool successful');
          console.log('Deposit successful');
        } else if (action === 'updateIncentivization') {
          const tx = await poolManager.updatePoolIncentivization(poolAddress, rewardToken, isIncentivized);
          await tx.wait();
          alert('Pool incentivization updated successfully');
          console.log('Incentivization updated');
        } else if (action === 'add') {
          const tx = await poolManager.addLiquidity(tokenA.value, tokenB.value, ethers.parseUnits(amountA, 18), ethers.parseUnits(amountB, 18));
          await tx.wait();
          alert('Liquidity added successfully');
          console.log('Liquidity added');
        } else if (action === 'withdraw') {
          const tx = await poolManager.withdrawLiquidity(tokenA.value, tokenB.value, ethers.parseUnits(amountA, 18), ethers.parseUnits(amountB, 18));
          await tx.wait();
          alert('Liquidity withdrawn successfully');
          console.log('Liquidity withdrawn');
      }

    } catch (error) {
      console.error('Error handling action:', error);
      alert('Error handling action. Please check the console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Pools Manager</h1>

      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
          <div className="mb-4">
            <label className="block text-white mb-2">Select Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as 'withdraw' | 'add' | 'incentivize' | 'updateIncentivization')}
              className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
            >
              <option value="incentivize">Incentivize Pool</option>
              <option value="updateIncentivization">Update Incentivization</option>
              <option value="add">Add Liquidity</option>
              <option value="withdraw">Withdraw Liquidity</option>
            </select>
          </div>

          {(action === 'incentivize' || action === 'updateIncentivization') && (
            <div className="mb-4">
              <label className="block text-white mb-2">Ammount to deposited pools</label>
              <input
                type="text"
                value={poolAddress}
                onChange={(e) => setPoolAddress(e.target.value)}
                placeholder="Enter Pool Address"
                className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
              />
            </div>
          )}

          {action === 'updateIncentivization' && (
            <>
              <div className="mb-4">
                <label className="block text-white mb-2">Reward Token Address</label>
                <input
                  type="text"
                  value={rewardToken}
                  onChange={(e) => setRewardToken(e.target.value)}
                  placeholder="Enter Reward Token Address"
                  className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Incentivized?</label>
                <input
                  type="checkbox"
                  checked={isIncentivized}
                  onChange={(e) => setIsIncentivized(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-white">Yes</span>
              </div>
            </>
          )}

          {action === 'add' && (
            <>
              <div className="mb-4">
                <label className="block text-white mb-2">Token A</label>
                <Select
                  options={tokenOptions}
                  value={tokenA}
                  onChange={(option) => setTokenA(option || null)}
                  components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                  styles={customStyles}
                  placeholder="Select Token A"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Amount A</label>
                <input
                  type="text"
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                  placeholder="Amount of Token A"
                  className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Token B</label>
                <Select
                  options={tokenOptions}
                  value={tokenB}
                  onChange={(option) => setTokenB(option || null)}
                  components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                  styles={customStyles}
                  placeholder="Select Token B"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Amount B</label>
                <input
                  type="text"
                  value={amountB}
                  onChange={(e) => setAmountB(e.target.value)}
                  placeholder="Amount of Token B"
                  className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
                />
              </div>
            </>
          )}

          {action === 'withdraw' && (
            <>
              <div className="mb-4">
                <label className="block text-white mb-2">Token A</label>
                <Select
                  options={tokenOptions}
                  value={tokenA}
                  onChange={(option) => setTokenA(option || null)}
                  components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                  styles={customStyles}
                  placeholder="Select Token A"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Amount A</label>
                <input
                  type="text"
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                  placeholder="Amount of Token A"
                  className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Token B</label>
                <Select
                  options={tokenOptions}
                  value={tokenB}
                  onChange={(option) => setTokenB(option || null)}
                  components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                  styles={customStyles}
                  placeholder="Select Token B"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Amount B</label>
                <input
                  type="text"
                  value={amountB}
                  onChange={(e) => setAmountB(e.target.value)}
                  placeholder="Amount of Token B"
                  className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
                />
              </div>
            </>
          )}

            <Button
              onClick={handleAction}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
            >
              Execute
            </Button>
        </div>
      </div>
    </div>
  );
}

export default PoolsManager;
