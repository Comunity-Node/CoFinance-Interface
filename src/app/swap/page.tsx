'use client';
import React, { useState } from 'react';
import Select, { components, SingleValueProps, OptionProps } from 'react-select';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';
import '../../styles/global.css'; 

// Define types for token options
interface TokenOption {
  value: string;
  label: string;
  image: string;
  balance: number; 
}

const CustomOption = (props: OptionProps<TokenOption, false>) => (
  <components.Option {...props} className="react-select-option">
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
      {props.data.label}
    </div>
  </components.Option>
);

const CustomSingleValue = (props: SingleValueProps<TokenOption>) => (
  <components.SingleValue {...props} className="react-select-single-value">
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
      {props.data.label}
    </div>
  </components.SingleValue>
);

const Swap: React.FC = () => {
  const [fromToken, setFromToken] = useState<TokenOption | null>(null);
  const [toToken, setToToken] = useState<TokenOption | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.2'); // Slippage percentage
  const [fee, setFee] = useState<number>(0.01); // Fee percentage (1%)

  // Mock balances for tokens
  const tokenOptions = tokens.tokens.map((token: { name: string; image: string }) => ({
    value: token.name,
    label: token.name,
    image: token.image,
    balance: Math.random() * 100, // Replace with actual balance retrieval
  }));

  // Mock exchange rate function
  const getExchangeRate = (fromToken: TokenOption | null, toToken: TokenOption | null) => {
    if (fromToken && toToken) {
      // Mock rate, replace with actual rate fetching logic
      return Math.random() * 2; // Example rate between 0 and 2
    }
    return 0;
  };

  const calculateToAmount = () => {
    const rate = getExchangeRate(fromToken, toToken);
    const amount = parseFloat(fromAmount);
    const calculatedToAmount = amount * rate;
    const slippageAmount = (parseFloat(slippage) / 100) * calculatedToAmount;
    const feeAmount = fee * calculatedToAmount;

    // Adjust the final amount by slippage and fee
    const finalAmount = (calculatedToAmount + slippageAmount - feeAmount).toFixed(2);

    return { finalAmount, slippage: parseFloat(slippage).toFixed(2) }; // Include slippage in the result
  };

  const handleSwap = () => {
    const { finalAmount, slippage } = calculateToAmount();
    setToAmount(finalAmount);
    setSlippage(slippage); // Update slippage
    console.log('Swapping', fromAmount, fromToken, 'to', finalAmount, toToken);
  };

  const getBalance = (token: TokenOption | null) => {
    return token ? token.balance.toFixed(2) : '0.00';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Swap Tokens</h1>

      <div className="text-center text-white mb-12">
        {/* Display wallet address if needed */}
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
          <div className="mb-4">
            <label className="block text-white mb-2">From Token</label>
            <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 p-4 rounded-lg shadow-md">
              <Select
                options={tokenOptions}
                value={fromToken}
                onChange={(selectedOption) => setFromToken(selectedOption as TokenOption)}
                className="react-select-control"
                classNamePrefix="react-select"
                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                placeholder="Select token"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                    border: '1px solid #4A4A4A',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: '#1a1a1a',
                  }),
                }}
              />
              <div className="mt-2 text-white">
                <span className="font-bold">Available Balance:</span> {getBalance(fromToken)} tokens
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Amount</label>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => {
                setFromAmount(e.target.value);
                const { finalAmount } = calculateToAmount();
                setToAmount(finalAmount);
              }}
              placeholder="Amount"
              className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">To Token</label>
            <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 p-4 rounded-lg shadow-md">
              <Select
                options={tokenOptions}
                value={toToken}
                onChange={(selectedOption) => setToToken(selectedOption as TokenOption)}
                className="react-select-control"
                classNamePrefix="react-select"
                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                placeholder="Select token"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                    border: '1px solid #4A4A4A',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: '#1a1a1a',
                  }),
                }}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Amount</label>
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="Amount"
              className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
            />
          </div>
          <div className="flex justify-between items-center">
            <Button
              onClick={handleSwap}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
            >
              Confirm Swap
            </Button>
            <span className="text-white text-lg">Slippage: {slippage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Swap;
