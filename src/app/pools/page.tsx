'use client';
import React, { useState, useEffect } from 'react';
import PoolCard from '../../components/PoolCard';
import { Button } from '../../components/ui/moving-border';
import { getAllPools, getIncentivizedPools } from '../../utils/Factory';
import { getTotalLiquidity, getTokenAddresses, getLiquidityToken } from '../../utils/CoFinance';
import { getTokenInfo } from '../../utils/TokenUtils';
import { ethers } from 'ethers';
import WithdrawLiquidityModal from '@/components/inner-page/WithdrawLiquidityModal';
import AddLiquidityModal from '@/components/inner-page/AddLiquidityModal';

function Pools() {
  const [pools, setPools] = useState([]);
  const [userOwnedPools, setUserOwnedPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [liquidityTokenAddress, setLiquidityTokenAddress] = useState(null);
  const [addLiquidityModalOpen, setAddLiquidityModalOpen] = useState(false);
  const [account, setAccount] = useState(null); // State for account

  useEffect(() => {
    const loadPools = async () => {
      setLoading(true);
      try {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accountAddress = await signer.getAddress(); // Get connected account
        setAccount(accountAddress); // Set account state
        console.log("Connected Account:", accountAddress); // Log account

        const poolAddresses = await getAllPools(provider);
        const incentivizedPoolAddresses = await getIncentivizedPools(provider);

        const allPools = await Promise.all(
          poolAddresses.map(async (address) => await fetchPoolData(provider, address))
        );

        const userOwned = await Promise.all(
          incentivizedPoolAddresses.map(async (address) => await fetchPoolData(provider, address))
        );

        setPools(allPools);
        setUserOwnedPools(userOwned);
      } catch (error) {
        console.error('Error loading pools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPools();
  }, []);

  const fetchPoolData = async (provider, address) => {
    try {
      const { tokenA, tokenB } = await getTokenAddresses(provider, address);
      const [tokenAInfo, tokenBInfo, liquidityToken] = await Promise.all([
        getTokenInfo(provider, tokenA),
        getTokenInfo(provider, tokenB),
        getLiquidityToken(provider, address),
      ]);
      const liquidity = await getTotalLiquidity(provider, address);
      const scaledTotalA = parseFloat(liquidity.totalA) * Math.pow(10, 20);
      const scaledTotalB = parseFloat(liquidity.totalB) * Math.pow(10, 20);

      return {
        address,
        liquidity: { totalA: scaledTotalA, totalB: scaledTotalB },
        tokenA: {
          value: tokenAInfo.value,
          label: tokenAInfo.label,
          image: tokenAInfo.image,
        },
        tokenB: {
          value: tokenBInfo.value,
          label: tokenBInfo.label,
          image: tokenBInfo.image,
        },
        liquidityToken,
      };
    } catch (error) {
      console.error(`Error fetching liquidity for pool ${address}:`, error);
      return {
        address,
        liquidity: { totalA: 'N/A', totalB: 'N/A' },
        tokenA: { value: 'N/A', label: 'N/A', image: '/tokens/CoFi.png' },
        tokenB: { value: 'N/A', label: 'N/A', image: '/tokens/CoFi.png' },
      };
    }
  };

  const handleAddLiquidityClick = (pool) => {
    if (!account) {
      console.error("Account is not connected!");
      return;
    }
    setSelectedPool(pool);
    setAddLiquidityModalOpen(true); 
  };

  const handleWithdrawClick = (pool) => {
    setSelectedPool(pool);
    setLiquidityTokenAddress(pool.liquidityToken);
    setModalOpen(true);
  };

  return (
    <section className="min-h-screen animation-bounce bg-portfolio bg-no-repeat bg-contain py-12 pt-36">
      <div className="px-40">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold text-white">Pools Overview</h2>
          <Button onClick={() => window.location.href = '/addpools'}>Add New Pool</Button>
        </div>
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : (
          <>
            {userOwnedPools.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-4">Incentivized Pools</h3>
                <div className="bg-[#141414] p-6 rounded-lg shadow-lg">
                  <ul className="space-y-4">
                    {userOwnedPools.map((pool, index) => (
                      <PoolCard 
                        key={index} 
                        pool={pool} 
                        onWithdrawClick={() => handleWithdrawClick(pool)} 
                        onAddLiquidityClick={() => handleAddLiquidityClick(pool)} 
                      />
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="flex flex-col items-center">
              <p className="text-center text-white text-lg mb-6">Discover Pools</p>
              <div className="bg-[#141414] p-6 rounded-lg shadow-lg w-full max-w-6xl">
                {pools.length === 0 ? (
                  <p className="text-white text-center">No pools available</p>
                ) : (
                  <ul className="space-y-4">
                    {pools.map((pool, index) => (
                      <PoolCard 
                        key={index} 
                        pool={pool} 
                        onWithdrawClick={() => handleWithdrawClick(pool)} 
                        onAddLiquidityClick={() => handleAddLiquidityClick(pool)} 
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <WithdrawLiquidityModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        liquidityToken={{
          label: selectedPool?.liquidityToken?.label || '',
          balance: selectedPool?.liquidityToken?.balance || '0',
          address: selectedPool?.liquidityToken?.address || '',
          image: selectedPool?.liquidityToken?.image || '/tokens/CoFi.png',
        }} 
      />
      <AddLiquidityModal 
        open={addLiquidityModalOpen} 
        onClose={() => setAddLiquidityModalOpen(false)} 
        tokenA={selectedPool?.tokenA || { label: '', value: '', image: '' }} // Fallback
        tokenB={selectedPool?.tokenB || { label: '', value: '', image: '' }} // Fallback
        account={account || ''} // Ensure account is a string
        poolAddress={selectedPool?.address || ''} // Ensure poolAddress is defined
      />
    </section>
  );
}

export default Pools;
