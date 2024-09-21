'use client';
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';

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

const Swap: React.FC = () => {
  const tokenOptions = tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  }));

  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const handleSwap = async () => {
    // Implement swapping logic here
  };

  return (
    <section className="min-h-screen bg-borrow bg-no-repeat bg-contain text-center">
      <div className="pt-40 px-96 space-y-3">
        <h1 className="text-4xl font-bold text-white mb-8">Swap Tokens</h1>
        <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
          <CreatableSelect
            isClearable
            options={tokenOptions}
            styles={customStyles}
            placeholder="Select or Enter From Token"
            className="w-full"
            onChange={setFromToken}
          />
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="From Amount"
            className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
          />
          <CreatableSelect
            isClearable
            options={tokenOptions}
            styles={customStyles}
            placeholder="Select or Enter To Token"
            className="w-full"
            onChange={setToToken}
          />
          <input
            type="number"
            value={toAmount}
            readOnly
            placeholder="To Amount"
            className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
          />
          <Button
            onClick={handleSwap}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
          >
            Confirm Swap
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Swap;
