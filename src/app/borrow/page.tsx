'use client';
import React, { useEffect, useState, useRef } from 'react';
import Drawer from '@/components/Drawer';
import Collateral from '@/components/inner-page/Collateral';
import BorrowTokens from '@/components/inner-page/BorrowTokens';
import tokens from '@/data/token.json';
import { durations } from '@/utils/durations';
import { ethers } from 'ethers';
import { getUserCollateralBalances } from '@/utils/CoFinance';
import { useAccount } from '../RootLayout';
import { FaWallet } from 'react-icons/fa';
import { connectMetaMask } from '@/utils/wallet';
import BorrowCard from '@/components/inner-page/BorrowCard';

const Borrow: React.FC = () => {
  const { account, setAccount } = useAccount();
  const [connected, setConnected] = React.useState<boolean>(!!account);
  const [collateralBalance, setCollateralBalance] = useState<number>(0);
  const providerRef = useRef<ethers.BrowserProvider | null>(null);

  const collateralList = [
    {
      id: 1,
      title: "Deposit Collateral",
      date: "2024-11-29T10:00:00Z",
      images: ["/tokens/CoFi.png", "/tokens/USDTT.png"],
      amount: 100,
    },
    {
      id: 2,
      title: "Deposit Collateral",
      date: "2024-11-28T15:30:00Z",
      images: ["/tokens/BUSD.png", "/tokens/bitcoin.png"],
      amount: 50,
    },
  ];

  const borrowedList = [
    {
      id: 1,
      title: "Borrow Successfully!",
      date: "2024-11-29T10:00:00Z",
      images: ["/tokens/CoFi.png", "/tokens/USDTT.png"],
      amount: 100,
      duration: 7,
    },
    {
      id: 2,
      title: "Borrow Successfully!",
      date: "2024-11-28T15:30:00Z",
      images: ["/tokens/BUSD.png", "/tokens/bitcoin.png"],
      amount: 50,
      duration: 90,
    },
    {
      id: 2,
      title: "Borrow Successfully!",
      date: "2024-11-28T15:30:00Z",
      images: ["/tokens/BUSD.png", "/tokens/bitcoin.png"],
      amount: 50,
      duration: 90,
    },
    {
      id: 2,
      title: "Borrow Successfully!",
      date: "2024-11-28T15:30:00Z",
      images: ["/tokens/BUSD.png", "/tokens/bitcoin.png"],
      amount: 50,
      duration: 90,
    },
    {
      id: 2,
      title: "Borrow Successfully!",
      date: "2024-11-28T15:30:00Z",
      images: ["/tokens/BUSD.png", "/tokens/bitcoin.png"],
      amount: 50,
      duration: 90,
    },
    {
      id: 2,
      title: "Borrow Successfully!",
      date: "2024-11-28T15:30:00Z",
      images: ["/tokens/BUSD.png", "/tokens/bitcoin.png"],
      amount: 50,
      duration: 90,
    },
  ];

  const tabsBorrow = [
    {
      label: "Collateral",
      content: (
        <>
          <div className="flex items-start space-x-10">
            <div className="p-2 w-full">
              <Collateral
                tokenOptions={tokens.tokens.map(token => ({
                  value: token.address,
                  label: token.name,
                  image: token.image,
                }))}
                handleDepositCollateral={async (amount) => {
                  return { amount: 0 };
                }}
                account={account || ''}
                provider={providerRef.current as ethers.BrowserProvider} />
            </div>
            <div className="p-2 space-y-5 w-3/4">
              <div className="flex items-center justify-between rounded-xl w-full px-10 bg-explore py-5">
                <div className="text-start">
                  <p className="text-4xl font-bold text-white">${collateralBalance.toLocaleString()}</p>
                </div>
                <div className="text-end" data-aos="fade-left">
                  <p className='text-gray-600 text-md uppercase'>Your Deposited Collateral</p>
                  <p className="py-2 text-2xl leading-8 font-semibold tracking-tight text-white sm:text-4xl">
                    Collateral
                  </p>
                  <p className="text-sm font-normal text-gray-400">On Our Platforms.</p>
                </div>
              </div>
              <BorrowCard lists={collateralList} />
            </div>
          </div>
        </>
      ),
    },
    {
      label: "Borrow",
      content: (
        <div className="flex items-start space-x-10">
          <div className="p-2 w-full">
            <div role="alert" className="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info h-6 w-6 shrink-0">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>You can borrow in here!</span>
            </div>
            <BorrowTokens
              tokenOptions={tokens.tokens.map(token => ({
                value: token.address,
                label: token.name,
                image: token.image,
              }))}
              durationOptions={durations.map(duration => ({
                value: String(duration.value),
                label: duration.label,
              }))}
              handleBorrowAmounts={async (amount) => {
                return { amount: 0 };
              }}
              account={account || ''}
              provider={providerRef.current as ethers.BrowserProvider} />
          </div>
          <div className="p-2 space-y-5 w-3/4">
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
            <BorrowCard lists={borrowedList} />
          </div>
        </div>
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
      if (!window.ethereum || null) return;

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
    console.log("Account Fetch : " + account);
  }, [account]);


  const handleConnectMetaMask = async () => {
    try {
      const address = await connectMetaMask();
      if (address) {
        console.log(address);
        setAccount(address);
        setConnected(true);
      } else {
        console.error("Failed to connect MetaMask.");
      }
    } catch (err) {
      console.error("Failed to connect MetaMask:", err);
    }
  };

  const handleDisconnectWallet = () => {
    setAccount(null);
    setConnected(false);
  };
  const CardConnectButton = () => (
    <div className="absolute text-center justify-center flex items-center z-50" data-aos="fade-up">
      <div className='rounded-lg bg-[#141414] w-96 shadow-xl'>
        <figure>
          <img className='bg-cover w-full rounded-t-xl'
            src="/redesign/Connect.png"
            alt="Shoes" />
        </figure>
        <div className="card-body space-y-3">
          <p>Please connect your wallet to use the platform features.</p>
          <div className="card-actions justify-end">
            <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
              <button onClick={connected ? handleDisconnectWallet : handleConnectMetaMask} className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full">
                <FaWallet className="mr-2" /> Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen animation-bounce bg-borrow bg-no-repeat bg-contain image-full text-center max-w-screen">
      <div className="pt-40 max-w-screen px-48 space-y-3">
        <div className={`bg-[#141414] rounded-xl h-full flex items-center justify-center`}>
          {account ? null : <CardConnectButton />}
          <div className={`bg-[#141414] rounded-xl h-full px-10 py-5 w-full space-y-3 ${account == null ? 'blur-lg' : ''}`}>
            <Drawer
              drawerItems={tabsBorrow}
              title='Test'
              classParent='bg-transparent border border-[#bdc3c7] rounded-lg p-1 z-40'
              classActiveTab="bg-[#bdc3c7] font-normal text-[#141414] w-full py-2 px-4 rounded-md text-center"
              classDeactiveTab='py-2 px-4 rounded-md font-normal text-[#141414] text-center text-white w-full'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Borrow;
function loadAccount() {
  throw new Error('Function not implemented.');
}

