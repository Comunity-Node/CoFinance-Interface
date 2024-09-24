'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import tokens from '../../data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-dark/dark.css';
import { PiArrowsLeftRightBold } from "react-icons/pi";
import { MdLocalGasStation, MdOutlineArrowOutward } from 'react-icons/md';
import { swapTokens, previewSwap } from '@/utils/CoFinance';
import { getPoolByPairs } from '@/utils/Factory';
import { getTokenBalance, approveToken } from '../../utils/TokenUtils';

const MySwal = withReactContent(Swal);

const Swap: React.FC = () => {
  const defaultTokenOptions = tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  }));

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [fromToken, setFromToken] = useState<ImageSelect | null>(null);
  const [toToken, setToToken] = useState<ImageSelect | null>(null);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [isSwap, setIsSwap] = useState<boolean>(false);
  const [poolAddress, setPoolAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
      } else {
        console.error('No crypto wallet found. Please install it.');
      }
    };

    initProvider();
  }, []);

  const fetchPoolAddress = async () => {
    if (fromToken && toToken && provider) {
      try {
        const address = await getPoolByPairs(provider, fromToken.value, toToken.value);
        setPoolAddress(address);
      } catch (error) {
        console.error('Error fetching pool address:', error);
        setPoolAddress(null);
      }
    }
  };

  useEffect(() => {
    fetchPoolAddress();
  }, [fromToken, toToken, provider]);

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setFromAmount(amount);
    
    if (poolAddress && fromToken && toToken && amount > 0 && provider) {
      try {
        const { outputAmount, feeAmount } = await previewSwap(provider, poolAddress, fromToken.value, amount.toString());
        setToAmount(parseFloat(outputAmount));
        setFeeAmount(parseFloat(feeAmount));
      } catch (error) {
        console.error('Error previewing swap:', error);
        setToAmount(0);
      }
    } else {
      setToAmount(0);
    }
  };

  const fetchTokenBalance = async (tokenAddress: string) => {
    if (provider) {
      const balance = await getTokenBalance(provider, tokenAddress, account);
      setTokenBalance(parseFloat(balance));
    }
  };

  useEffect(() => {
    if (fromToken) fetchTokenBalance(fromToken.value);
  }, [fromToken, provider]);

  const onConfirmSwap = async () => {
    if (!fromToken || !toToken || !poolAddress) {
      MySwal.fire({ icon: 'warning', title: 'Token Selection', text: 'Select both tokens.' });
      return;
    }

    if (!fromAmount || fromAmount <= 0 || fromAmount > tokenBalance) {
      MySwal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Enter a valid amount to swap.' });
      return;
    }

    try {
      await approveToken(provider, fromToken.value, poolAddress, fromAmount.toString());
      setIsSwap(true);
      await swapTokens(provider, poolAddress, fromToken.value, fromAmount.toString());
      MySwal.fire({ icon: 'success', title: 'Swap Successful' });
    } catch (error) {
      MySwal.fire({ icon: 'error', title: 'Swap Failed', text: 'Error during swap.' });
    } finally {
      setIsSwap(false);
    }
  };

  const onSwap = () => {
    setToAmount(fromAmount);
    setFromAmount(toAmount);
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  return (
    <section className="min-h-screen bg-trade bg-no-repeat bg-contain">
      <div className="pt-40 px-96 space-y-3 flex justify-center">
        <div className="bg-[#141414] rounded-xl p-6 space-y-4 max-w-xl">
          <h1 className="text-3xl font-semibold text-white my-3 text-center">Swap Tokens</h1>
          <p className='text-gray-500 text-md uppercase'>From</p>
          <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl px-4 py-2">
            <CustomSelectSearch
              tokenOptions={defaultTokenOptions}
              handleOnChange={setFromToken}
              handleValue={fromToken}
              placeholder="Choose Tokens"
            />
            <input
              type="tel"
              value={fromAmount || ''}
              onChange={handleAmountChange}
              placeholder="0"
              className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
            />
          </div>
          <p className="text-gray-300">Balance: {tokenBalance.toFixed(2)}</p>

          <div className="divider">
            <button className='btn rounded-xl' onClick={onSwap}>
              <PiArrowsLeftRightBold />
            </button>
          </div>

          <div className="flex items-center">
            <p className='text-gray-500 text-md uppercase'>To</p>
          </div>
          <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl px-4 py-2">
            <CustomSelectSearch
              tokenOptions={defaultTokenOptions}
              handleOnChange={setToToken}
              handleValue={toToken}
              placeholder="Choose Tokens"
            />
            <input
              type="text"
              value={toAmount || ''}
              readOnly
              placeholder="0"
              className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
            />
          </div>
          <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
            <button
              className="btn border-0 font-thin text-lg bg-transparent text-gray-950 w-full"
              onClick={onConfirmSwap}
              disabled={isSwap}
            >
              {isSwap ? (
                <div className="flex items-center justify-center w-full">
                  <span className="loading loading-bars loading-sm"></span>
                </div>
              ) : (
                <>Swap <MdOutlineArrowOutward /></>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-gray-500 text-md">
            <div>Estimated: <strong>{toAmount.toFixed(2)}</strong> {toToken?.label}</div>
            <div className='flex items-center space-x-1'><MdLocalGasStation /><span>{feeAmount.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Swap;
