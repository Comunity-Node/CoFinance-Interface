'use client';
import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import tokens from '../../data/token.json';
import { Button } from '@/components/ui/moving-border';
import Drawer from '@/components/Drawer';
import { FaArrowCircleRight } from 'react-icons/fa';


// Custom styles for the select
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#111827', // Customize the control background color
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '5px 3px',
    width: "300px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1f2937', // Customize the dropdown background color
  }),
  option: (provided: any, state: { isSelected: any; }) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#374151' : '#1f2937',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#374151',
    },

  }),
  indicatorSeparator: (provided: any) => ({
    display: 'none',            // Hide the separator (vertical line)
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#fff',              // Search input text color set to white
  }),
};

// Custom styles for the select
const customStyles2 = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#111827', // Customize the control background color
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '5px',
    width: "100%",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1f2937', // Customize the dropdown background color
  }),
  option: (provided: any, state: { isSelected: any; }) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#374151' : '#1f2937',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#374151',
    },
  }),
  indicatorSeparator: (provided: any) => ({
    display: 'none',            // Hide the separator (vertical line)
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#fff',              // Search input text color set to white
  }),
};


// Custom Option component to display images and text
const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center">
        <img
          src={props.data.image}
          alt={props.data.label}
          className="w-6 h-6 rounded-full mr-3"
        />
        {props.data.label}
      </div>
    </components.Option>
  );
};

// Custom SingleValue component to display selected option with image
const CustomSingleValue = (props: any) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center">
        <img
          src={props.data.image}
          alt={props.data.label}
          className="w-6 h-6 rounded-full mr-3"
        />
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

  const handleDepositCollateralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositCollateral(e.target.value);
    // You may update collateralAmount or other states if needed
  };

  const handleKeyUp = () => {
    setCollateralAmount(depositedCollateral.toFixed(2));
  };
  const Corrateral = () => (
    <div className='space-y-4 py-4 h-96'>
      <div className="flex items-center justify-between w-full space-x-2 bg-[#111827] rounded-tl-2xl rounded-tr-2xl px-4 py-2">
        <Select
          isSearchable={true}
          options={tokenOptions}
          value={selectedDepositToken}
          onChange={setSelectedDepositToken}
          styles={customStyles}
          components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
          placeholder="Choose Token" />
        <input
          type="number"
          value={depositCollateral}
          onChange={handleDepositCollateralChange}
          onKeyUp={handleKeyUp}
          placeholder="0"
          className="text-right w-full rounded-xl p-5 text-3xl bg-[#111827] focus:border-0 text-white placeholder:text-gray-600" />
      </div>
      <div className="w-full text-end rounded-bl-2xl rounded-br-2xl p-1 bg-gray-500">
        <button className="btn border-0 bg-transparent hover:bg-transparent text-gray-950  w-full" onClick={handleDepositCollateral}>Deposit <FaArrowCircleRight /></button>

      </div>
    </div>
  );

  const BorrowTokens = () => (
    <div className='space-y-4 py-4 h-96'>
      <div className="flex items-center justify-between w-full space-x-2 bg-[#111827] rounded-tl-2xl rounded-tr-2xl px-4 py-2">
        <Select
          options={tokenOptions}
          value={selectedToken}
          onChange={setSelectedToken}
          styles={customStyles}
          components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
          placeholder="Select token"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="text-right w-full rounded-xl p-5 text-3xl bg-[#111827] focus:border-0 text-white placeholder:text-gray-600" />
      </div>
      <div className='p-1 bg-[#111827] rounded-xl'>
        <Select
          options={borrowingDurations}
          value={borrowingDuration}
          onChange={setBorrowingDuration}
          styles={customStyles2}
          placeholder="Borrowing Duration"
        />
      </div>
      <div className="w-full text-end rounded-bl-2xl rounded-br-2xl p-1 bg-gray-500">
        <button className="btn border-0 bg-transparent hover:bg-transparent text-gray-950 w-full" onClick={handleBorrow}>Borrow <FaArrowCircleRight /></button>
      </div>
    </div>
  );

  const tabsBorrow = [
    {
      label: "Collateral",
      content: <Corrateral />,
    },
    {
      label: "Borrow",
      content: <BorrowTokens />,
    },
  ];

  return (
    <div className="pt-40 px-56">
      <div className="grid grid-cols-5 grid-rows-2 gap-4">
        {/* Left Column - 3/5 width */}
        <div className="col-span-3 bg-gray-950 rounded-xl h-full px-10 py-5">
          <Drawer drawerItems={tabsBorrow}
            title='Borrow Tokens'
            classParent='bg-transparent border border-gray-800 rounded-full p-1'
            classActiveTab="bg-gray-800 font-semibold w-full py-2 px-4 rounded-full text-center text-white w-full"
            classDeactiveTab='py-2 px-4 rounded-full text-center text-white w-full' />
        </div>

        {/* Right Column - 2/5 width */}
        <div className="col-span-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg h-full">
          <div className="w-full p-5">
            <h2 className="text-xl text-start font-semibold pt-3 pb-6 text-black">Summary</h2>
            <div className="flex items-center justify-between rounded-xl border border-gray-300 px-3 py-5">
              <p className="text-2xl font-medium text-gray-500">TVL</p>
              <p className="text-2xl font-bold text-black">${tvl.toLocaleString()}</p>
            </div>
            <div className="divider"></div>
            {/* Collateral */}
            <div className="rounded-xl border border-gray-300 px-3 py-5 space-y-3">
              <h3 className="text-xl text-gray-600 font-semibold">Collateral</h3>
              <div className="divider"></div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-500">Amount</p>
                <p className="font-bold text-black">{collateralAmount || '0'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-500">Deposit</p>
                <p className="font-bold text-black">{depositedCollateral.toFixed(2)}</p>
              </div>
            </div>
            {/* Borrow */}
            <div className="divider"></div>
            <div className="rounded-xl border border-gray-300 px-3 py-5 space-y-3">
              <h3 className="text-xl text-gray-600 font-semibold">Borrow</h3>
              <div className="divider"></div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-500">Tokens</p>
                <p className="font-bold text-black">{selectedToken?.label || 'None'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-500">Amount</p>
                <p className="font-bold text-black">{amount || '0'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-500">Borrowing Ends</p>
                <p className="font-bold text-black">{borrowingDuration?.label || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Borrow;
