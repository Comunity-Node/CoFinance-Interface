'use client';
import React, { useState, useEffect } from 'react';
import PoolCard from '../../components/PoolCard';
import { getAllPools, getIncentivizedPools } from '../../utils/Factory';
import { getTotalLiquidity, getTokenAddresses, getLiquidityToken } from '../../utils/CoFinance';
import { getTokenInfo } from '../../utils/TokenUtils';
import { ethers } from 'ethers';
import WithdrawLiquidityModal from '@/components/inner-page/WithdrawLiquidityModal';
import AddLiquidityModal from '@/components/inner-page/AddLiquidityModal';
import Drawer from '@/components/Drawer';
import { FaArrowsAltH, FaSwimmingPool } from 'react-icons/fa';

function Pools() {
  const [pools, setPools] = useState([]);
  const [userOwnedPools, setUserOwnedPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [liquidityTokenAddress, setLiquidityTokenAddress] = useState(null);
  const [addLiquidityModalOpen, setAddLiquidityModalOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const DEFAULT_IMAGE_URL = '/img-default.png';

  useEffect(() => {

    const loadPools = async () => {
      console.log("DEFAULT_IMAGE_URL" + DEFAULT_IMAGE_URL);
      setLoading(true);
      try {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        console.log("Connected Account : ", accountAddress);

        const poolAddresses = await getAllPools(provider);
        const incentivizedPoolAddresses = await getIncentivizedPools(provider);

        const allPools = await Promise.all(
          poolAddresses.map(async (address: any) => await fetchPoolData(provider, address))
        );

        const userOwned = await Promise.all(
          incentivizedPoolAddresses.map(async (address: any) => await fetchPoolData(provider, address))
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

  const fetchPoolData = async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const { tokenA, tokenB } = await getTokenAddresses(provider, address);
      const [tokenAInfo, tokenBInfo, liquidityToken] = await Promise.all([
        getTokenInfo(provider, tokenA),
        getTokenInfo(provider, tokenB),
        getLiquidityToken(provider, address),
      ]);
      const liquidity = await getTotalLiquidity(provider, address);
      const scaledTotalA = parseFloat(liquidity.totalA);
      const scaledTotalB = parseFloat(liquidity.totalB);
      if (tokenAInfo.label === 'WXFI') tokenAInfo.label = 'XFI';
      if (tokenBInfo.label === 'WXFI') tokenBInfo.label = 'XFI';

      console.log("address pool " + address);

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
      // console.error(`Error fetching liquidity for pool ${address}:`, error);
      return {
        address,
        liquidity: { totalA: '0.0', totalB: '0.0' },
        tokenA: { value: 'N/A', label: 'N/A', image: DEFAULT_IMAGE_URL },
        tokenB: { value: 'N/A', label: 'N/A', image: DEFAULT_IMAGE_URL },
      };
    }
  };

  const handleAddLiquidityClick = (pool: any) => {
    if (!account) {
      console.error("Account is not connected!");
      return;
    }
    setSelectedPool(pool);
    setAddLiquidityModalOpen(true);
  };

  const handleWithdrawClick = (pool: any) => {
    setSelectedPool(pool);
    setLiquidityTokenAddress(pool.liquidityToken);
    setModalOpen(true);
  };


  const DiscoverPools = ({ pools }) => (
    <div className="bg-[#141414] p-6 rounded-lg min-w-full h-96">
      {pools.length === 0 ? (
        <p className="text-white text-center">No pools available</p>
      ) : (
        <div className="overflow-x-auto h-screen">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-400">Liquidity</th>
                <th className="p-4 border-b border-gray-800 text-center font-normal text-gray-400">Token A</th>
                <th className="p-4 border-b border-gray-800 text-center font-normal text-gray-400">Token B</th>
                <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">#</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}>
                  {pools.map((pool: { address: string; liquidity?: { totalA: string; totalB: string; }; tokenA?: { label: string; image: string; }; tokenB?: { label: string; image: string; }; }, index: React.Key | null | undefined) => (
                    <PoolCard
                      key={index}
                      pool={pool}
                      onWithdrawClick={() => handleWithdrawClick(pool)}
                      onAddLiquidityClick={() => handleAddLiquidityClick(pool)}
                    />
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const IncentivizedPools = ({ userOwnedPools }) => (
    <div className="bg-[#141414] p-6 rounded-lg min-w-full h-96">
      {pools.length === 0 ? (
        <p className="text-white text-center">No pools available</p>
      ) : (
        <div className="overflow-x-auto h-screen">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-400">Liquidity</th>
                <th className="p-4 border-b border-gray-800 text-center font-normal text-gray-400">Token A</th>
                <th className="p-4 border-b border-gray-800 text-center font-normal text-gray-400">Token B</th>
                <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">#</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}>
                  {userOwnedPools.map((pool: { address: string; liquidity?: { totalA: string; totalB: string; }; tokenA?: { label: string; image: string; }; tokenB?: { label: string; image: string; }; }, index: React.Key | null | undefined) => (
                    <PoolCard
                      key={index}
                      pool={pool}
                      onWithdrawClick={() => handleWithdrawClick(pool)}
                      onAddLiquidityClick={() => handleAddLiquidityClick(pool)}
                    />
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );


  const drawerList = [
    {
      label: "Discover",
      content: <DiscoverPools pools={pools} />,
    },
    {
      label: "Incentivized",
      content: <IncentivizedPools userOwnedPools={userOwnedPools} />,
    },
  ];

  return (
    <section className="min-h-screen animation-bounce bg-pools bg-no-repeat bg-contain py-12 pt-36">
      <div className="px-40">
        <div className="flex items-center justify-between py-6">
          <h2 className="text-4xl font-bold text-white">Overview</h2>
          <button className='btn btn-base-200 rounded-lg' onClick={() => window.location.href = '/addpools'}>
            Add New Pool</button>
        </div>
        <div className="py-2">
          {loading ?
            <div className="flex items-center justify-center">
              <span className="loading loading-bars loading-lg"></span>
            </div>
            :
            <Drawer
              drawerItems={drawerList}
              classParent='py-2'
              title=''
              classActiveTab='bg-[#141414] py-2 border border-[#bdc3c7] px-4 text-lg font-medium rounded-sm text-left text-[#bdc3c7]'
              classDeactiveTab='bg-transparent text-lg font-medium py-2 px-4 rounded-sm text-left text-white'
            />
          }
        </div>
      </div>

      <WithdrawLiquidityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        liquidityToken={{
          label: selectedPool?.liquidityToken?.label || '',
          balance: selectedPool?.liquidityToken?.balance || '0',
          address: selectedPool?.liquidityToken?.address || '',
          image: selectedPool?.liquidityToken?.image || DEFAULT_IMAGE_URL,
        }}
      />

      <AddLiquidityModal
        open={addLiquidityModalOpen}
        onClose={() => setAddLiquidityModalOpen(false)}
        tokenA={selectedPool?.tokenA || { label: '', value: '', image: '' }}
        tokenB={selectedPool?.tokenB || { label: '', value: '', image: '' }}
        account={account || ''}
        poolAddress={selectedPool?.address || ''}
      />

    </section>
  );
}

export default Pools;
