'use client';
import React, { useState } from 'react';
import tokens from '../../data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-dark/dark.css';
import { PiArrowsLeftRightBold } from "react-icons/pi";
import { MdOutlineArrowOutward } from 'react-icons/md';

const MySwal = withReactContent(Swal);

const Swap: React.FC = () => {
  const defaultTokenOptions = tokens.tokens.map(token => ({
    value: token.address,
    label: token.name,
    image: token.image,
  }));


  const [fromToken, setFromToken] = useState<ImageSelect | null>(null);
  const [toToken, setToToken] = useState<ImageSelect | null>(null);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [isSwap, setIsSwap] = useState<boolean>(false);


  const onConfirmSwap = async () => {
    // Validate that both tokens are selected
    if (!fromToken || !toToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Token Selection',
        text: 'Please select both From and To tokens.',
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
      });
      return;
    }

    // Validate that fromAmount is filled and greater than 0
    if (!fromAmount || fromAmount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Please enter a valid amount to swap.',
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
      });
      return;
    }

    if (fromToken || fromAmount || toAmount || toToken) {
      Swal.fire({
        icon: 'success',
        title: 'Swap Successfully',
        html: `
              <div style="display: flex; align-items: center; justify-content: space-around; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; justify-content: start;">
                    <img src="${fromToken.image}" alt="${fromToken.label}" style="border-radius: 50%; width: 30px; height: 30px; margin-right: 10px;">
                    <strong>${fromToken.label}</strong>
                </div>
                    <strong>$${fromAmount}</strong>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-around; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; justify-content: start;">
                    <img src="${toToken.image}" alt="${toToken.label}" style="border-radius: 50%; width: 30px; height: 30px; margin-right: 10px;">
                    <strong>${toToken.label}</strong>
                </div>
                    <strong>$${toAmount}</strong>
              </div>
              `,

        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
      });
    }

    // Proceed with the swap logic here
    // Example: await swapTokens(fromToken, toToken, fromAmount);
  };


  const onSwap = async () => {
    // Auto-fill toAmount with fromAmount value
    setToAmount(fromAmount);
    setFromAmount(toAmount);

    // Swap the tokens
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };


  return (
    <section className="min-h-screen bg-trade bg-no-repeat bg-contain">
      <div className="pt-40 px-96 space-y-3 flex justify-center">
        <div className="bg-[#141414] rounded-xl p-6 space-y-4 max-w-xl">
          {/* From Tokens */}
          <h1 className="text-3xl font-semibold text-white my-3 text-center ">Swap Tokens</h1>
          <p className='text-gray-500 text-md uppercase'>From</p>
          <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
            <CustomSelectSearch
              tokenOptions={defaultTokenOptions}
              handleOnChange={setFromToken}
              handleValue={fromToken}
              className="border-none hover:border-0"
              placeholder="Choose Tokens"
            />
            <input
              type="tel"
              value={fromAmount || ''}
              onChange={(e) => setFromAmount(parseFloat(e.target.value))}
              onKeyUp={() => {
                if ((!fromToken && !fromAmount) || !toToken) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Token Selection',
                    text: 'Please select both From and To tokens.',
                    customClass: {
                      popup: 'my-custom-popup',
                      confirmButton: 'my-custom-confirm-button',
                      cancelButton: 'my-custom-cancel-button',
                    },
                  });
                  setToAmount(0);
                  setFromAmount(0);
                  return;
                } else {
                  const conversionRate = 10;
                  setToAmount(fromAmount * conversionRate);
                }
              }}
              placeholder="0"
              className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
            />
          </div>

          <div className="divider">
            <button className='btn rounded-xl' onClick={onSwap}>
              <PiArrowsLeftRightBold />
            </button>
          </div>

          {/* To Tokens */}
          <div className="flex items-center">
            <p className='text-gray-500 text-md uppercase'>To</p>
          </div>
          <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
            <CustomSelectSearch
              tokenOptions={defaultTokenOptions}
              handleOnChange={setToToken}
              handleValue={toToken}
              className="border-none hover:border-0"
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
              className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
              onClick={onConfirmSwap}
              disabled={isSwap}
            >
              {isSwap ? (
                <div className="flex items-center justify-center w-full">
                  <span className="loading loading-bars loading-sm"></span>
                </div>
              ) : (
                <>
                  Swap <MdOutlineArrowOutward />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Swap;
