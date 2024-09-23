import React, { useState, useEffect } from 'react';
import { ImageSelect } from '@/types/ImageSelect';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import tokens from '../../data/token.json';
import { ethers } from 'ethers';
import { getTokenBalance } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory';

interface AddLiquidityModalProps {
  open: boolean;
  onClose: () => void;
  tokenA: ImageSelect | null;
  tokenB: ImageSelect | null;
  account: string; 
  poolAddress: string;
}

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ open, onClose, tokenA, tokenB, account, poolAddress }) => {
  const [selectedTokenA, setSelectedTokenA] = useState<ImageSelect | null>(tokenA);
  const [selectedTokenB, setSelectedTokenB] = useState<ImageSelect | null>(tokenB);
  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);
  const [balanceA, setBalanceA] = useState<string>('0');
  const [balanceB, setBalanceB] = useState<string>('0');
  const [poolAddressFromAPI, setPoolAddressFromAPI] = useState<string | null>(null); // Store single pool address

  const defaultTokenOptions = tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  }));

  useEffect(() => {
    console.log("Props in Modal:", { open, account, poolAddress });
  }, [open, account, poolAddress]);

  useEffect(() => {
    setSelectedTokenA(tokenA);
    setSelectedTokenB(tokenB);
  }, [tokenA, tokenB]);

  useEffect(() => {
    const fetchBalances = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);

      if (selectedTokenA) {
        const balanceA = await getTokenBalance(provider, selectedTokenA.value, account);
        setBalanceA(balanceA);
      }

      if (selectedTokenB) {
        const balanceB = await getTokenBalance(provider, selectedTokenB.value, account);
        setBalanceB(balanceB);
      }
    };

    if (account) {
      fetchBalances();
    }
  }, [selectedTokenA, selectedTokenB, account]);

  useEffect(() => {
    const fetchPool = async () => {
      if (selectedTokenA && selectedTokenB) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const poolAddress = await getPoolByPairs(provider, selectedTokenA.value, selectedTokenB.value);
        setPoolAddressFromAPI(poolAddress); 
      }
    };

    fetchPool();
  }, [selectedTokenA, selectedTokenB]);

  if (!open) return null;

  const handleConfirm = () => {
    console.log("Adding liquidity:", selectedTokenA, selectedTokenB, amountA, amountB);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-[#141414] p-6 rounded-xl max-w-lg w-full h-auto overflow-auto">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">Add Liquidity</h2>

        <p className="text-gray-300 mb-2">Connected Account: {account}</p>
        <p className="text-gray-300 mb-4">Pool Address: {poolAddressFromAPI || 'Fetching...'}</p>

        <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
          <div className="mb-4">
            <p className="text-gray-500 text-md uppercase">Select Token A:</p>
            <CustomSelectSearch
              tokenOptions={defaultTokenOptions}
              handleOnChange={setSelectedTokenA}
              handleValue={selectedTokenA}
              className="border-none hover:border-0"
              placeholder="Choose Token A"
            />
            <p className="text-gray-300">Balance: {balanceA}</p>
            <input 
              type="number" 
              value={amountA || ''}
              onChange={(e) => setAmountA(parseFloat(e.target.value))}
              placeholder={`Amount of ${selectedTokenA?.label || 'Token A'}`}
              className="border border-gray-600 bg-transparent text-white p-2 rounded-xl w-full mt-2 focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div className="mb-4">
            <p className="text-gray-500 text-md uppercase">Select Token B:</p>
            <CustomSelectSearch
              tokenOptions={defaultTokenOptions}
              handleOnChange={setSelectedTokenB}
              handleValue={selectedTokenB}
              className="border-none hover:border-0"
              placeholder="Choose Token B"
            />
            <p className="text-gray-300">Balance: {balanceB}</p>
            <input 
              type="number" 
              value={amountB || ''}
              onChange={(e) => setAmountB(parseFloat(e.target.value))}
              placeholder={`Amount of ${selectedTokenB?.label || 'Token B'}`}
              className="border border-gray-600 bg-transparent text-white p-2 rounded-xl w-full mt-2 focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div className="mb-4">
            <p className="text-gray-500 text-md uppercase">Available Pool:</p>
            <p className="text-gray-300">{poolAddressFromAPI ? poolAddressFromAPI : 'No pool available for this pair'}</p>
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
