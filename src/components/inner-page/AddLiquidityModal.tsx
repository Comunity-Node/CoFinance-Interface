import React, { useState, useEffect, useRef } from 'react';
import { ImageSelect } from '@/types/ImageSelect';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import tokens from '../../data/token.json';
import { ethers } from 'ethers';
import { getTokenBalance, approveToken } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory'; 
import { provideLiquidity } from '../../utils/CoFinance';
import { WrapNative, approveAllowance } from '@/utils/Wrapped';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-dark/dark.css';

const MySwal = withReactContent(Swal);
const Wrapped_Address = "0x28cc5edd54b1e4565317c3e0cfab551926a4cd2a"; 

interface AddLiquidityModalProps {
  open: boolean;
  onClose: () => void;
  tokenA: ImageSelect | null;
  tokenB: ImageSelect | null;
}

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ open, onClose, tokenA, tokenB }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
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
        if (token.value.toLowerCase() === Wrapped_Address.toLowerCase()) {
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

    if (amountA <= 0 || amountB <= 0 || amountA > parseFloat(balanceA) || amountB > parseFloat(balanceB)) {
      MySwal.fire({
        icon: 'warning',
        title: 'Invalid Amounts',
        text: 'Please enter valid amounts for both tokens.',
      });
      return;
    }

    try {
      let txHash;

      if (selectedTokenA.value.toLowerCase() === Wrapped_Address.toLowerCase()) {
        await WrapNative(providerRef.current, amountA.toString());
        txHash = await approveAllowance(providerRef.current, poolAddressFromAPI, amountA.toString());
      } else if (selectedTokenB.value.toLowerCase() === Wrapped_Address.toLowerCase()) {
        await WrapNative(providerRef.current, amountB.toString());
        txHash = await approveAllowance(providerRef.current, poolAddressFromAPI, amountB.toString());
      } else {
        txHash = await approveToken(providerRef.current, selectedTokenA.value, poolAddressFromAPI, amountA.toString());
        txHash = await approveToken(providerRef.current, selectedTokenB.value, poolAddressFromAPI, amountB.toString());
      }

      const liquidityTxHash = await provideLiquidity(providerRef.current, poolAddressFromAPI, amountA.toString(), amountB.toString());

      MySwal.fire({
        icon: 'success',
        title: 'Liquidity Added!',
        text: `Successfully added ${amountA} ${selectedTokenA.label} and ${amountB} ${selectedTokenB.label}. Transaction Hash: ${liquidityTxHash}`,
      });

      onClose();
    } catch (error) {
      console.error('Error during liquidity provision:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Liquidity Provision Failed',
        text: 'An error occurred during liquidity provision.',
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div ref={modalRef} className="bg-[#141414] p-6 rounded-xl max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">Add Liquidity</h2>
        
        <div className="mb-4">
          <p className="text-gray-500 text-md uppercase">Token A:</p>
          <CustomSelectSearch
            tokenOptions={defaultTokenOptions}
            handleOnChange={setSelectedTokenA}
            handleValue={selectedTokenA}
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
          <input 
            type="range" 
            min={0} 
            max={parseFloat(balanceA)} 
            value={amountA} 
            onChange={(e) => setAmountA(parseFloat(e.target.value))}
            className="range range-xs"
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-md uppercase">Token B:</p>
          <CustomSelectSearch
            tokenOptions={defaultTokenOptions}
            handleOnChange={setSelectedTokenB}
            handleValue={selectedTokenB}
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
          <input 
            type="range" 
            min={0} 
            max={parseFloat(balanceB)} 
            value={amountB} 
            onChange={(e) => setAmountB(parseFloat(e.target.value))}
            className="range range-xs"
          />
        </div>

        <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
          <button 
            type="button" 
            onClick={handleConfirm} 
            className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
          >
            Add Liquidity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityModal;
