import React, { useState, useEffect, useRef } from 'react';
import { ImageSelect } from '@/types/ImageSelect';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import tokens from '../../data/token.json';
import { ethers } from 'ethers';
import { getTokenBalance, approveToken } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory'; 
import { provideLiquidity } from '../../utils/CoFinance';
import { WrapNative } from '@/utils/Wrapped';

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
  const defaultTokenOptions = tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  }));

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

      const fetchBalance = async (token: ImageSelect | null) => {
        if (token.value === "0x10e6414ddea2e2be27e23584c651bc0a49e11e07") {
          const balance = await providerRef.current.getBalance(account);
          return ethers.formatEther(balance); 
        }
        return await getTokenBalance(providerRef.current, token.value, account);
      };

      const balanceA = await fetchBalance(selectedTokenA);
      const balanceB = await fetchBalance(selectedTokenB);

      setBalanceA(balanceA);
      setBalanceB(balanceB);
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

  const handleConfirm = async () => {
    if (!account || !selectedTokenA || !selectedTokenB || !poolAddressFromAPI || !providerRef.current) return;

    try {
      if (selectedTokenA.value === "0x10e6414ddea2e2be27e23584c651bc0a49e11e07") {
        await WrapNative(providerRef.current, amountA.toString());
        setAmountA(0); 
      }
      if (selectedTokenB.value === "0x10e6414ddea2e2be27e23584c651bc0a49e11e07") {
        await WrapNative(providerRef.current, amountB.toString());
        setAmountB(0); 
      }
      
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
            <CustomSelectSearch
              tokenOptions={defaultTokenOptions}
              handleOnChange={setSelectedTokenA}
              handleValue={selectedTokenA}
              className="border-none hover:border-0"
              placeholder="Choose Token A"
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
            <CustomSelectSearch
              tokenOptions={defaultTokenOptions}
              handleOnChange={setSelectedTokenB}
              handleValue={selectedTokenB}
              className="border-none hover:border-0"
              placeholder="Choose Token B"
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
