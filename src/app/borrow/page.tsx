'use client';
import React, { useEffect, useState, useRef } from 'react';
import Drawer from '@/components/Drawer';
import Collateral from '@/components/inner-page/Collateral';
import BorrowTokens from '@/components/inner-page/BorrowTokens'; 
import tokens from '@/data/token.json';
import durationsData from '@/data/durations.json';
import { ethers } from 'ethers';
import { getUserCollateralBalances } from '../../utils/CoFinance';

const Borrow: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [collateralBalance, setCollateralBalance] = useState<number>(0); 
  const providerRef = useRef<ethers.BrowserProvider | null>(null);

  const tabsBorrow = [
    {
      label: "Collateral",
      content: (
        <Collateral
          tokenOptions={tokens.tokens.map(token => ({
            value: token.address,
            label: token.name,
            image: token.image,
          }))}
          handleDepositCollateral={async (amount) => {
            return { amount: 0 };
          }}
        />
      ),
    },
    {
      label: "Borrow",
      content: (
        <BorrowTokens
          tokenOptions={tokens.tokens.map(token => ({
            value: token.address,
            label: token.name,
            image: token.image,
          }))}
          durationOptions={durationsData.durations.map(items => ({
            value: String(items.value),
            label: items.label,
          }))}
          handleBorrowAmounts={async (amount) => {
            return { amount: 0 };
          }}
        />
      ),
    },
  ];

  const fetchCollateralBalance = async () => {
    if (!providerRef.current || !account) return;

    try {
      const balances = await getUserCollateralBalances(providerRef.current, account);
      const totalCollateral = Object.values(balances).reduce((acc, balance) => acc + parseFloat(balance.collateralA) + parseFloat(balance.collateralB), 0);
      setCollateralBalance(totalCollateral);
    } catch (error) {
      console.error('Error fetching collateral balances:', error);
    }
  };

  useEffect(() => {
    const loadAccount = async () => {
      if (!window.ethereum) return;

      providerRef.current = new ethers.BrowserProvider(window.ethereum);
      const signer = await providerRef.current.getSigner();
      const accountAddress = await signer.getAddress();
      setAccount(accountAddress);
    };

    loadAccount();
  }, []);

  useEffect(() => {
    if (account) {
      fetchCollateralBalance();
    }
  }, [account]);

  return (
    <section className="min-h-screen animation-bounce bg-borrow bg-no-repeat bg-contain image-full text-center max-w-screen">
      <div className="pt-40 px-96 space-y-3">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-between rounded-xl w-full px-10 bg-explore py-5">
            <div className="text-start">
              <p className="text-4xl font-bold text-white">${collateralBalance.toLocaleString()}</p> {/* Changed to collateralBalance */}
            </div>
            <div className="text-end" data-aos="fade-left">
              <p className='text-gray-600 text-md uppercase'>Your Deposited Collateral</p>
              <p className="py-2 text-2xl leading-8 font-semibold tracking-tight text-white sm:text-4xl">
                Collateral
              </p>
              <p className="text-sm font-normal text-gray-400">On Our Platforms.</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl w-full px-10 bg-explore py-5">
            <div className="text-start">
              <p className="text-4xl font-bold text-white">${0}</p> {/* Placeholder for borrowed amounts */}
            </div>
            <div className="text-end" data-aos="fade-left">
              <p className='text-gray-600 text-md uppercase'>Your Borrowed Amounts</p>
              <p className="py-2 text-2xl leading-8 font-semibold tracking-tight text-white sm:text-4xl">
                Borrows
              </p>
              <p className="text-sm font-normal text-gray-400">On Our Platforms.</p>
            </div>
          </div>
        </div>
        <div className="bg-[#141414] rounded-xl h-full px-10 py-5 space-y-3">
          <Drawer
            drawerItems={tabsBorrow}
            title='Borrow Tokens'
            classParent='bg-transparent border border-[#bdc3c7] rounded-lg p-1 z-50'
            classActiveTab="bg-[#bdc3c7] font-normal text-[#141414] w-full py-2 px-4 rounded-md text-center"
            classDeactiveTab='py-2 px-4 rounded-md font-normal text-[#141414] text-center text-white w-full'
          />
        </div>
      </div>
    </section>
  );
};

export default Borrow;
