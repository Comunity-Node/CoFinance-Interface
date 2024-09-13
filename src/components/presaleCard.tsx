import React, { useState } from 'react';
import Image from 'next/image';
import Select, { components, SingleValueProps, OptionProps } from 'react-select';
import tokens from '../data/token.json';
import { Button } from './ui/moving-border';

// Type for token option
export interface TokenOption {
  value: string;
  label: string;
  image: string;
}

interface PresaleCardProps {
  pool: {
    token: string;
    amount: string;
    image: string;
    description: string;
    website?: string; // Optional website URL
    softCap: string;
    hardCap: string;
    accumulatedCap: string;
  };
  onParticipate: (token: string, amount: string) => void;
}

const tokenOptions: TokenOption[] = tokens.tokens.map((token) => ({
  value: token.name,
  label: token.name,
  image: token.image,
}));

const customStyles = {
  control: (base: any) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)', // Glossy black
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  }),
  menu: (base: any) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)', // Glossy black
  }),
  option: (base: any, { isFocused }: { isFocused: boolean }) => ({
    ...base,
    background: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'white',
  }),
  input: (base: any) => ({
    ...base,
    color: 'white',
  }),
};

const CustomOption = (props: OptionProps<TokenOption>) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <Image src={props.data.image} alt={props.data.label} width={24} height={24} className="mr-2" className="rounded-full" />
      {props.data.label}
    </div>
  </components.Option>
);

const CustomSingleValue = (props: SingleValueProps<TokenOption>) => (
  <components.SingleValue {...props}>
    <div className="flex items-center">
      <Image src={props.data.image} alt={props.data.label} width={24} height={24} className="mr-2" className="rounded-full" />
      {props.data.label}
    </div>
  </components.SingleValue>
);

const PresaleCard: React.FC<PresaleCardProps> = ({ pool, onParticipate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenOption | null>(null);
  const [amount, setAmount] = useState<string>('');

  const handleParticipateClick = () => {
    if (selectedToken && amount) {
      onParticipate(selectedToken.value, amount);
    } else {
      console.error('Please select a token and enter an amount.');
    }
  };

  // Convert string amounts to numbers
  const softCap = parseFloat(pool.softCap.replace(' ETH', ''));
  const hardCap = parseFloat(pool.hardCap.replace(' ETH', ''));
  const accumulatedCap = parseFloat(pool.accumulatedCap.replace(' ETH', ''));

  // Calculate percentage of hard cap reached
  const progressPercentage = (accumulatedCap / hardCap) * 100;

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 rounded-lg shadow-lg flex flex-col">
      <div className="flex items-center mb-4">
        <Image src={pool.image} alt={pool.token} width={50} height={50} className="rounded-full" />
        <div className="ml-4">
          <h3 className="text-xl text-white font-bold">{pool.token}</h3>
          <p className="text-white">Amount: {pool.amount}</p>
        </div>
      </div>

      {/* Soft cap and hard cap displayed horizontally */}
      <div className="flex justify-between text-white mb-4">
        <div className="flex-1">
          <p><strong>Soft Cap:</strong> {pool.softCap}</p>
        </div>
        <div className="flex-1 text-right">
          <p><strong>Hard Cap:</strong> {pool.hardCap}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="bg-green-500 h-2"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-white mb-4 text-center">{progressPercentage.toFixed(2)}% of Hard Cap Reached</p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-400 hover:underline mb-4"
      >
        {isExpanded ? 'Hide Details' : 'Show Details'}
      </button>

      {/* Show description only when expanded */}
      {isExpanded && (
        <div className="text-white">
          <p><strong>Description:</strong> {pool.description}</p>
          {pool.website && (
            <p className="mt-2">
              <strong>Website:</strong> <a href={pool.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{pool.website}</a>
            </p>
          )}
          <div className="mt-4">
            <h4 className="text-lg text-white mb-2">Participate in Presale</h4>
            <div className="mb-4">
              <label className="block text-white mb-2">Token</label>
              <Select
                options={tokenOptions}
                value={selectedToken}
                onChange={(selected) => setSelectedToken(selected as TokenOption)}
                styles={customStyles}
                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                placeholder="Select token"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
              />
            </div>
            <Button
              onClick={handleParticipateClick}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
            >
              Participate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresaleCard;
