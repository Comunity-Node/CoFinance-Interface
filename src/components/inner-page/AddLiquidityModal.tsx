import React, { useState, useEffect, useRef } from 'react';
import { ImageSelect } from '@/types/ImageSelect';
import tokens from '../../data/token.json';
import { ethers } from 'ethers';
import { getTokenBalance, approveToken, getTokenInfo } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory';
import { provideLiquidity } from '../../utils/CoFinance';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';

const customStyles = {
  control: (base: any) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  }),
  menu: (base: any) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)',
  }),
  option: (base: any, { isFocused }: any) => ({
    ...base,
    background: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'white',
  }),
};

const CustomOption = (props: any) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2 rounded-full" />
      {props.data.label}
    </div>
  </components.Option>
);

interface AddLiquidityModalProps {
  open: boolean;
  onClose: () => void;
  tokenA: ImageSelect | null;
  tokenB: ImageSelect | null;
}

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ open, onClose, tokenA, tokenB }) => {
  const [selectedTokenA, setSelectedTokenA] = useState<ImageSelect | null>(tokenA);
  const [selectedTokenB, setSelectedTokenB] = useState<ImageSelect | null>(tokenB);
  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);
  const [balanceA, setBalanceA] = useState<string>('0');
  const [balanceB, setBalanceB] = useState<string>('0');
  const [poolAddressFromAPI, setPoolAddressFromAPI] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const providerRef = useRef<ethers.BrowserProvider | null>(null);
  const [tokenOptions, setTokenOptions] = useState(tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  })));

  useEffect(() => {
    const loadAccountAndPools = async () => {
      setLoading(true);
      try {
        if (!window.ethereum) return;
        if (!providerRef.current) {
          providerRef.current = new ethers.BrowserProvider(window.ethereum);
        }
        const signer = await providerRef.current.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        console.log("Connected Account:", accountAddress);
      } catch (error) {
        console.error('Error loading account and pools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountAndPools();
  }, []);

  useEffect(() => {
    setSelectedTokenA(tokenA);
    setSelectedTokenB(tokenB);
  }, [tokenA, tokenB]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!providerRef.current || !account) return;

      if (selectedTokenA) {
        const balanceA = await getTokenBalance(providerRef.current, selectedTokenA.value, account);
        setBalanceA(balanceA);
      }
      if (selectedTokenB) {
        const balanceB = await getTokenBalance(providerRef.current, selectedTokenB.value, account);
        setBalanceB(balanceB);
      }
    };

    fetchBalances();
  }, [selectedTokenA, selectedTokenB, account]);

  useEffect(() => {
    const fetchPool = async () => {
      if (!providerRef.current || !selectedTokenA || !selectedTokenB) return;

      const poolAddress = await getPoolByPairs(providerRef.current, selectedTokenA.value, selectedTokenB.value);
      setPoolAddressFromAPI(poolAddress);
    };

    fetchPool();
  }, [selectedTokenA, selectedTokenB]);

  const handleCustomTokenInput = async (input: string, setSelectedToken: React.Dispatch<React.SetStateAction<ImageSelect | null>>) => {
    if (ethers.isAddress(input)) {
      const provider = providerRef.current;
      if (!provider) return;

      try {
        const tokenInfo = await getTokenInfo(provider, input);
        if (tokenInfo) {
          setTokenOptions((prevOptions) => [...prevOptions, tokenInfo]);
          setSelectedToken({
            value: tokenInfo.address,
            label: tokenInfo.name,
            image: tokenInfo.image,
          });
        } else {
          alert('Failed to fetch token info');
        }
      } catch (error) {
        console.error('Error fetching token info:', error);
      }
    } else {
      alert('Invalid address');
    }
  };

  const handleConfirm = async () => {
    if (!account || !selectedTokenA || !selectedTokenB || !poolAddressFromAPI || !providerRef.current) return;

    try {
      await approveToken(providerRef.current, selectedTokenA.value, poolAddressFromAPI, amountA.toString());
      await approveToken(providerRef.current, selectedTokenB.value, poolAddressFromAPI, amountB.toString());
      await provideLiquidity(providerRef.current, poolAddressFromAPI, amountA.toString(), amountB.toString());
      console.log("Liquidity added successfully:", selectedTokenA.label, selectedTokenB.label, amountA, amountB);
      alert(`Successfully added liquidity: ${amountA} ${selectedTokenA.label} and ${amountB} ${selectedTokenB.label}`);
      onClose();
    } catch (error) {
      console.error('Error during liquidity provision:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-[#141414] p-6 rounded-xl max-w-lg w-full h-auto overflow-auto">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">Add Liquidity</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
          <div className="mb-4">
            <p className="text-gray-500 text-md uppercase">Token A:</p>
            <CreatableSelect
              isClearable
              options={tokenOptions}
              value={selectedTokenA}
              onChange={setSelectedTokenA}
              onCreateOption={(inputValue) => handleCustomTokenInput(inputValue, setSelectedTokenA)}
              styles={customStyles}
              components={{ Option: CustomOption }}
              placeholder="Select or Enter Token A"
              className="w-full"
            />
            <p className="text-gray-300">Available Balance: {balanceA}</p>
            <input
              type="number"
              value={amountA || ''}
              onChange={(e) => setAmountA(parseFloat(e.target.value))}
              placeholder={`Amount of ${selectedTokenA?.label || 'Token A'}`}
              className="border border-gray-600 bg-transparent text-white p-2 rounded-xl w-full mt-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <p className="text-gray-500 text-md uppercase">Token B:</p>
            <CreatableSelect
              isClearable
              options={tokenOptions}
              value={selectedTokenB}
              onChange={setSelectedTokenB}
              onCreateOption={(inputValue) => handleCustomTokenInput(inputValue, setSelectedTokenB)}
              styles={customStyles}
              components={{ Option: CustomOption }}
              placeholder="Select or Enter Token B"
              className="w-full"
            />
            <p className="text-gray-300">Available Balance: {balanceB}</p>
            <input
              type="number"
              value={amountB || ''}
              onChange={(e) => setAmountB(parseFloat(e.target.value))}
              placeholder={`Amount of ${selectedTokenB?.label || 'Token B'}`}
              className="border border-gray-600 bg-transparent text-white p-2 rounded-xl w-full mt-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLiquidityModal;