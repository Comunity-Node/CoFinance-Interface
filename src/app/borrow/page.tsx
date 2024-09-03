'use client';
import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';

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
const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center">
        <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
        {props.data.label}
      </div>
    </components.Option>
  );
};

// Custom SingleValue component to display image in the selected value
const CustomSingleValue = (props) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center">
        <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
        {props.data.label}
      </div>
    </components.SingleValue>
  );
};

// Define the borrowing duration options
const borrowingDurations = [
  { value: 10, label: '30 Days' },
  { value: 30, label: '60 Days' },
  { value: 50, label: '90 Days' },
];

function Borrow() {
  const [selectedToken, setSelectedToken] = useState<{ value: string; label: string; image: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [depositCollateral, setDepositCollateral] = useState(''); // New state for depositing collateral
  const [selectedDepositToken, setSelectedDepositToken] = useState<{ value: string; label: string; image: string } | null>(null); // New state for deposit token
  const [borrowingDuration, setBorrowingDuration] = useState<{ value: number; label: string } | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [tvl, setTVL] = useState<number>(1000000); // Example TVL
  const [depositedCollateral, setDepositedCollateral] = useState<number>(0); // New state to track deposited collateral

  const tokenOptions = tokens.tokens.map((token) => ({
    value: token.name,
    label: token.name,
    image: token.image,
  }));

  const calculateInterestRate = () => {
    if (selectedToken && borrowingDuration) {
      const baseRate = 3; // Base Interest Rate
      const durationMultiplier = borrowingDuration.value / 30; // Example multiplier
      setInterestRate(baseRate * durationMultiplier);
    } else {
      setInterestRate(null);
    }
  };

  const handleBorrow = () => {
    calculateInterestRate();
    // Add borrowing logic here
    console.log('Borrowing', amount, 'of', selectedToken, 'for', borrowingDuration);
  };

  const handleDepositCollateral = () => {
    if (selectedDepositToken) {
      setDepositedCollateral(depositedCollateral + parseFloat(depositCollateral));
      setDepositCollateral(''); // Reset deposit collateral input
      console.log('Deposited Collateral:', depositCollateral, 'Token:', selectedDepositToken.label);
    } else {
      console.log('Please select a token for deposit.');
    }
  };

  useEffect(() => {
    calculateInterestRate(); // Recalculate on token or duration change
  }, [selectedToken, borrowingDuration]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Borrow Tokens</h1>

      {/* Summary Section */}
      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-screen-lg flex flex-wrap">
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-lg font-bold mb-4 text-white">Summary</h2>
            <ul className="text-white space-y-4">
              <li className="flex justify-between">
                <span>Borrowed Token:</span>
                <span>{selectedToken?.label || 'None'}</span>
              </li>
              <li className="flex justify-between">
                <span>Borrowed Amount:</span>
                <span>{amount || '0'}</span>
              </li>
              <li className="flex justify-between">
                <span>Collateral Amount:</span>
                <span>{collateralAmount || '0'}</span>
              </li>
              <li className="flex justify-between">
                <span>Deposited Collateral:</span>
                <span>{depositedCollateral.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>TVL:</span>
                <span>${tvl.toLocaleString()}</span>
              </li>
              <li className="flex justify-between">
                <span>Days Until Borrowing Ends:</span>
                <span>{borrowingDuration?.label || 'N/A'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-screen-lg flex flex-wrap">
          <div className="w-full md:w-1/2 p-4">
            <label className="block text-white mb-2">Select Token for Collateral</label>
            <Select
              options={tokenOptions}
              value={selectedDepositToken}
              onChange={setSelectedDepositToken}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select token"
            />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <label className="block text-white mb-2">Deposit Collateral</label>
            <input
              type="number"
              value={depositCollateral}
              onChange={(e) => setDepositCollateral(e.target.value)}
              placeholder="Deposit Collateral"
              className="w-full p-2 bg-black bg-opacity-60 border border-gray-600 rounded text-white"
            />
          </div>
          <div className="w-full p-4">
            <Button 
              onClick={handleDepositCollateral}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
            >
              Deposit Collateral
            </Button>
          </div>
        </div>
      </div>

      {/* Borrow Form */}
      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-screen-lg flex flex-wrap">
          <div className="w-full md:w-1/2 p-4">
            <label className="block text-white mb-2">Token</label>
            <Select
              options={tokenOptions}
              value={selectedToken}
              onChange={setSelectedToken}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select token"
            />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <label className="block text-white mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 bg-black bg-opacity-60 border border-gray-600 rounded text-white"
            />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <label className="block text-white mb-2">Borrowing Duration</label>
            <Select
              options={borrowingDurations}
              value={borrowingDuration}
              onChange={setBorrowingDuration}
              styles={customStyles}
              placeholder="Select duration"
            />
          </div>
          <div className="w-full p-4">
            <Button 
              onClick={handleBorrow}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
            >
              Borrow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Borrow;
