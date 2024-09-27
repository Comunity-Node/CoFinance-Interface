'use client';

import React, { useState, useEffect, useRef } from 'react';
import Select, { components } from 'react-select';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import { Button } from '../../components/ui/moving-border';
import { getIncentivizedPools } from '@/utils/Factory';
import { getLiquidityToken } from '@/utils/CoFinance'; 
import { getTokenInfo, getTokenBalance } from '@/utils/TokenUtils'; 

const customStyles = {
  control: (base) => ({
    ...base,
    background: 'rgba(20, 20, 20, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  }),
  menu: (base) => ({
    ...base,
    background: 'rgba(20, 20, 20, 0.7)',
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

const CustomOption = (props) => (
  <components.Option {...props}>
    <div className="flex flex-col">
      <span>{props.data.label}</span>
      <span className="text-gray-400 text-sm">Available Balance: {props.data.balance}</span>
    </div>
  </components.Option>
);

const stakingDurations = [
  { value: 7, label: '7 Days' },
  { value: 14, label: '14 Days' },
  { value: 21, label: '21 Days' },
];

function Staking() {
  const [selectedPool, setSelectedPool] = useState(null);
  const [amountPool, setAmountPool] = useState('');
  const [stakingDurationPool, setStakingDurationPool] = useState(null);
  const [aprPool, setAprPool] = useState(null);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [balance, setBalance] = useState('0');
  const providerRef = useRef(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProviderAndAccount = async () => {
      if (window.ethereum) {
        providerRef.current = new ethers.BrowserProvider(window.ethereum);
        const signer = await providerRef.current.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
      } else {
        console.error("Ethereum provider not found.");
      }
    };
    loadProviderAndAccount();
  }, []);

  useEffect(() => {
    const fetchIncentivizedPools = async () => {
      if (!providerRef.current) return;
      try {
        const pools = await getIncentivizedPools(providerRef.current);
        const poolAddresses = Array.from(pools);

        const options = await Promise.all(
          poolAddresses.map(async (poolAddress) => {
            const liquidityToken = await getLiquidityToken(providerRef.current, poolAddress);
            let tokenInfo = {};
            let balance = '0';

            try {
              tokenInfo = await getTokenInfo(providerRef.current, liquidityToken);
              balance = await getTokenBalance(providerRef.current, liquidityToken, account);
            } catch (error) {
              tokenInfo = { value: liquidityToken, label: 'Unsupported Token', image: '/tokens/CoFi.png' };
            }

            return {
              value: tokenInfo.value,
              label: tokenInfo.label,
              poolAddress,
              balance: balance || '0',
              image: tokenInfo.image,
            };
          })
        );

        setTokenOptions(options);
      } catch (error) {
        console.error('Error fetching incentivized pools:', error);
      }
    };

    fetchIncentivizedPools();
  }, [account]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!selectedPool || !account) return;
      try {
        const balance = await getTokenBalance(providerRef.current, selectedPool.value, account);
        setBalance(balance.toString());
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [selectedPool, account]);

  const calculateApr = (duration, baseApr) => {
    const durationMultiplier = duration / 21;
    return baseApr * durationMultiplier;
  };

  const handleStakePool = async () => {
    if (selectedPool && stakingDurationPool) {
      const baseApr = 5; 
      setAprPool(calculateApr(stakingDurationPool.value, baseApr));
      try {
        console.log('Staking', amountPool, 'of', selectedPool.value, 'for', stakingDurationPool);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        Swal.fire({
          title: 'Success!',
          text: `Staked ${amountPool} of ${selectedPool.label} for ${stakingDurationPool.label}.`,
          icon: 'success',
          confirmButtonText: 'Close',
        });
      } catch (error) {
        console.error('Error staking:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue with your staking request.',
          icon: 'error',
          confirmButtonText: 'Close',
        });
      }
    }
  };

  return (
    <section className="min-h-screen animation-bounce bg-borrow bg-no-repeat bg-contain image-full text-center">
      <div className="pt-40 px-96 space-y-3">
        <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">CoFinance Staking Yield</h1>
        <h2 className="text-2xl text-white mb-4">Your Staked Pools</h2>
        <div className="bg-[#141414] rounded-xl h-full px-10 py-5 space-y-3">
          <h2 className="text-xl text-white mb-4">Pool Staking</h2>
          <div className="mb-4">
            <label className="block text-white mb-2">Pool</label>
            <Select
              options={tokenOptions}
              value={selectedPool}
              onChange={setSelectedPool}
              styles={customStyles}
              components={{ Option: CustomOption }}
              placeholder="Select pool"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Amount</label>
            <div className="space-y-2">
              <input
                type="number"
                value={amountPool}
                onChange={(e) => setAmountPool(e.target.value)}
                placeholder="Amount"
                className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
              />
              <input 
                type="range" 
                min="0" 
                max={balance} 
                value={amountPool} 
                onChange={(e) => setAmountPool(e.target.value)} 
                className="range range-xs" // Apply your custom slider styles
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Staking Duration</label>
            <div className="grid grid-cols-2 gap-4">
              {stakingDurations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setStakingDurationPool(duration)}
                  className={`p-2 rounded text-white ${stakingDurationPool?.value === duration.value ? 'bg-gray-600' : 'bg-gray-700'}`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
          <Button 
            onClick={handleStakePool}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
          >
            Stake Pool
          </Button>
          {aprPool && <p className="text-white mt-4">Estimated APR: {aprPool}%</p>}
          <p className="text-white mt-4">Available Balance: {balance}</p>
        </div>
      </div>
    </section>
  );
}

export default Staking;
