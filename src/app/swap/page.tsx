'use client';
import React, { useState, useEffect  } from 'react';
import Select, { components, SingleValueProps, OptionProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';
import { getTokenInfo } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory'
import { swapTokens } from '../../utils/CoFinance';
import { ethers } from 'ethers';

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

const CustomOption = (props: OptionProps<any, false>) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2 rounded-full" />
      {props.data.label}
    </div>
  </components.Option>
);

const CustomSingleValue = (props: SingleValueProps<any>) => (
  <components.SingleValue {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2 rounded-full" />
      {props.data.label}
    </div>
  </components.SingleValue>
);

const promptMetaMaskSign = async (message: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(message);

  return signature;
};

const Swap: React.FC = () => {
  const [fromToken, setFromToken] = useState<{ value: string; label: string; image: string } | null>(null);
  const [toToken, setToToken] = useState<{ value: string; label: string; image: string } | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.2');
  const [fee, setFee] = useState<number>(0.01);
  const [tokenOptions, setTokenOptions] = useState(tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  })));
  const [pool, setPool] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (fromToken && toToken) {
      const fetchPools = async () => {
        setLoading(true);
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const fetchedPool = await getPoolByPairs(provider, fromToken.value, toToken.value);
          console.log(fetchedPool);
          setPool(fetchedPool);
        } catch (error) {
          console.error('Failed to fetch pool:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPools();
    }
  }, [fromToken, toToken]);

  const handleAddCustomOption = async (inputValue: string, setSelectedOption: (option: any) => void) => {
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

  const getExchangeRate = (fromToken: any, toToken: any) => {
    if (fromToken && toToken) {
      return Math.random() * 2; // Mock rate
    }
    return 0;
  };

  const calculateToAmount = () => {
    const rate = getExchangeRate(fromToken, toToken);
    const amount = parseFloat(fromAmount);
    const calculatedToAmount = amount * rate;
    const slippageAmount = (parseFloat(slippage) / 100) * calculatedToAmount;
    const feeAmount = fee * calculatedToAmount;

    const finalAmount = (calculatedToAmount + slippageAmount - feeAmount).toFixed(2);
    return { finalAmount, slippage: parseFloat(slippage).toFixed(2) };
  };

  const handleSwap = async () => {
    const { finalAmount } = calculateToAmount();
    setToAmount(finalAmount);
    console.log('Swapping', fromAmount, fromToken, 'to', finalAmount, toToken);
  
    if (fromToken && toToken && pool) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum); // Use Web3Provider
        const tokenAmount = finalAmount; 
        const message = `Swapping ${fromAmount} of ${fromToken.label} to ${finalAmount} of ${toToken.label}`;
        const signature = await promptMetaMaskSign(message);
        console.log('Signature:', signature);
        console.log(pool);
        await swapTokens(provider, pool, fromToken.value, tokenAmount);
        console.log('Swap transaction sent successfully');
      } catch (error) {
        console.error('Error executing swap:', error);
      }
    } else {
      console.error('Swap parameters are incomplete.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Swap Tokens</h1>

      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
          <div className="mb-4">
            <label className="block text-white mb-2">From Token</label>
            <CreatableSelect
              isClearable
              options={tokenOptions}
              value={fromToken}
              onChange={setFromToken}
              onCreateOption={(inputValue) => handleAddCustomOption(inputValue, setFromToken)}
              styles={customStyles}
              placeholder="Select or Enter Token"
              className="w-full"
            />
            <div className="mt-2 text-white">
              <span className="font-bold">Available Balance:</span> {/* Mock balance */}
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
            <CreatableSelect
              isClearable
              options={tokenOptions}
              value={toToken}
              onChange={setToToken}
              onCreateOption={(inputValue) => handleAddCustomOption(inputValue, setToToken)}
              styles={customStyles}
              placeholder="Select or Enter Token"
              className="w-full"
            />
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
          <div className="mt-6">
            <h2 className="text-white text-xl mb-4">Available Pool</h2>
            {loading ? (
              <p className="text-center text-white">Loading...</p>
            ) : (
              <div className="text-white">
                {pool ? (
                  <p>Pool Address: {pool}</p> // Adjust according to actual pool properties
                ) : (
                  <p>No pool available for selected tokens.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Swap;
