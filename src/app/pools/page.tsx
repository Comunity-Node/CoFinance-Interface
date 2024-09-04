'use client';
import React, { useState, useEffect } from 'react';
import PoolCard from '../../components/PoolCard';
import { Button } from '../../components/ui/moving-border';
import { getAllPools, getIncentivizedPools } from '../../utils/Factory';
import { getTotalLiquidity, getTokenAddresses } from '../../utils/CoFinance';
import { getTokenInfo } from '../../utils/TokenUtils';
import { ethers } from 'ethers';

function Pools() {
  const [pools, setPools] = useState([]);
  const [userOwnedPools, setUserOwnedPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPools = async () => {
      setLoading(true);
      try {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const poolAddresses = await getAllPools(provider);
        const userOwned = await getIncentivizedPools(provider);
        const poolData = await Promise.all(
          poolAddresses.map(async (address: string) => {
			    console.log(address);
            try {
              const { tokenA, tokenB } = await getTokenAddresses(provider, address);
              const [tokenAInfo, tokenBInfo] = await Promise.all([
                getTokenInfo(provider, tokenA),
                getTokenInfo(provider, tokenB)
              ]);
              console.log(tokenAInfo);
              console.log(tokenBInfo)
              const liquidity = await getTotalLiquidity(provider, address);
              const scaledTotalA = parseFloat(liquidity.totalA) * Math.pow(10, 20);
              const scaledTotalB = parseFloat(liquidity.totalB) * Math.pow(10, 20);
        return {
          address,
          liquidity: { totalA: scaledTotalA, totalB: scaledTotalB },
          tokenA: tokenAInfo,
          tokenB: tokenBInfo
        };
      } catch (error) {
        console.error(`Error fetching liquidity for pool ${address}:`, error);
        return {
          address,
          liquidity: { totalA: 'N/A', totalB: 'N/A' },
          tokenA: { value: 'N/A', label: 'N/A', image: '/tokens/default.png' },
          tokenB: { value: 'N/A', label: 'N/A', image: '/tokens/default.png' }
        }; // Handle error gracefully
            }
          })
        );

        setPools(poolData);
        setUserOwnedPools(userOwned);
      } catch (error) {
        console.error('Error loading pools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPools();
  }, []);

  const handleAddPoolClick = () => {
    window.location.href = '/addpools';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : (
        <>
          {userOwnedPools.length > 0 && (
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-lg md:text-4xl font-sans font-bold mb-6 text-white">Incentive-Pools</h2>
              <Button onClick={handleAddPoolClick}>Add New Pool</Button>
              <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
                <ul className="space-y-4">
                  {userOwnedPools.map((pool: string, index: number) => (
                    <PoolCard key={index} pool={{ address: pool }} />
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center">
            <p className="text-center text-white text-lg mb-12 max-w-4xl mx-auto px-4">
              Discover Pools
            </p>
            <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
              {pools.length === 0 ? (
                <p className="text-white text-center">No pools available</p>
              ) : (
                <ul className="space-y-4">
                  {pools.map((pool, index) => (
                    <PoolCard key={index} pool={pool} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Pools;