import React, { useState, useEffect } from 'react';
import { ImageSelect } from '@/types/ImageSelect';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import tokens from '../../data/token.json';
import { ethers } from 'ethers';
import { getTokenBalance, approveToken } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory'; 
import { provideLiquidity } from '../../utils/CoFinance';

interface AddLiquidityModalProps {
  open: boolean;
  onClose: () => void;
  tokenA: ImageSelect | null;
  tokenB: ImageSelect | null;
}

const promptMetaMaskSign = async (message: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(message);
  return signature;
};

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
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      if (selectedTokenA && account) {
        const balanceA = await getTokenBalance(provider, selectedTokenA.value, account);
        setBalanceA(balanceA);
      }
      if (selectedTokenB && account) {
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

  const handleConfirm = async () => {
    if (!account || !selectedTokenA || !selectedTokenB || !poolAddressFromAPI) return;
  
    const provider = new ethers.BrowserProvider(window.ethereum);
  
    try {
      const signer = provider.getSigner();
      console.log(`Approving ${amountA} ${selectedTokenA.label} for liquidity...`);
      const txA = await approveToken(signer, selectedTokenA.value, poolAddressFromAPI, ethers.parseUnits(amountA.toString(), 18));
      await txA.wait(); 
      console.log(`${amountA} ${selectedTokenA.label} approved for liquidity`);

      const approveMessageA = `I have approved ${amountA} ${selectedTokenA.label} for liquidity.`;
      const signatureA = await promptMetaMaskSign(approveMessageA);
      console.log("Token A Approval Signature:", signatureA);
  
      console.log(`Approving ${amountB} ${selectedTokenB.label} for liquidity...`);
      const txB = await approveToken(signer, selectedTokenB.value, poolAddressFromAPI, ethers.parseUnits(amountB.toString(), 18));
      await txB.wait(); 
      console.log(`${amountB} ${selectedTokenB.label} approved for liquidity`);

      const approveMessageB = `I have approved ${amountB} ${selectedTokenB.label} for liquidity.`;
      const signatureB = await promptMetaMaskSign(approveMessageB);
      console.log("Token B Approval Signature:", signatureB);
      
      const message = `I am about to add liquidity: ${amountA} ${selectedTokenA.label} and ${amountB} ${selectedTokenB.label}`;
      const signature = await promptMetaMaskSign(message);
      console.log("Signature:", signature);
  
      await provideLiquidity(signer, poolAddressFromAPI, amountA.toString(), amountB.toString());
      console.log("Liquidity added successfully:", selectedTokenA.label, selectedTokenB.label, amountA, amountB);
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
