'use client';
import Drawer from '@/components/Drawer';
import React from 'react';
import { FaArrowsAltH } from 'react-icons/fa';

// Calculate total liquidity
const totalLiquidityData = [
  {
    id: '1',
    tokenA: 'planq',
    tokenB: 'swisstronik',
    liquidity: 1000,
    imageA: '/planq.jpg',
    imageB: '/tokens/swisstronik.png'
  },
  {
    id: '2',
    tokenA: 'bitcoin',
    tokenB: 'oraichain',
    liquidity: 500,
    imageA: '/tokens/bitcoin.png',
    imageB: '/tokens/orai.jpg'
  },
  // Add more pools as needed
];

const totalLiquidity = totalLiquidityData.reduce((total, pool) => total + pool.liquidity, 0);

// Dummy data for staked pools, borrowed amount, and staking assets
const stakedPools = 1600;
const borrowedAmount = 1000;
const stakingAssets = 1200;

const overviewList = [
  {
    title: "Total Assets",
    amount: totalLiquidity,
    unit: "tokens",
  },
  {
    title: "Staked Pools",
    amount: stakedPools,
    unit: "",
  },
  {
    title: "Borrowed Amounts",
    amount: borrowedAmount,
    unit: "",
  },
  {
    title: "Staking Assets",
    amount: stakingAssets,
    unit: "",
  },
];

const PoolContent = ({ pools }: { pools: Array<{ id: number; imageA: string; tokenA: string; imageB: string; tokenB: string; liquidity: number }> }) => (
  // <div className="w-full">
  <div className="bg-custom-radial-gradient p-6 rounded-lg min-w-full shadow-lg shadow-blue-900">
    {pools.length === 0 ? (
      <p className="text-white text-center">No pools available</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-800 text-left">Token - Chain</th>
              <th className="p-4 border-b border-gray-800 text-right">Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool) => (
              <tr key={pool.id} className="hover:bg-blue-950 hover:rounded-lg transition duration-300 ease-in-out">
                <td className="p-4 flex items-center space-x-4">
                  <img src={pool.imageA} alt={pool.tokenA} className="w-10 h-10 rounded-xl border border-gray-600" />
                  <span className="text-white font-semibold text-lg">{pool.tokenA}</span>
                  <FaArrowsAltH />
                  <img src={pool.imageB} alt={pool.tokenB} className="w-10 h-10 rounded-xl border border-gray-600" />
                  <span className="text-white font-semibold text-lg">{pool.tokenB}</span>
                </td>
                <td className="p-4  text-right text-white">$ {pool.liquidity.toFixed(2)} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  // </div>
);


const TokenHolders = ({ tokenHolders }: { tokenHolders: Array<{ id: number; image: string; name: string; tokens: number }> }) => (
  <div className="w-full">
    <div className="bg-custom-radial-gradient p-6 rounded-lg w-full shadow-lg shadow-blue-900">
      {tokenHolders.length === 0 ? (
        <p className="text-white text-center">No token holders available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-800 text-left">Holder</th>
                <th className="p-4 border-b border-gray-800 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {tokenHolders.map((holder) => (
                <tr key={holder.id} className="hover:bg-blue-950 hover:rounded-lg transition duration-300 ease-in-out">
                  <td className="p-4 flex items-center space-x-4">
                    <img src={holder.image} alt={holder.name} className="w-10 h-10 rounded-xl border border-gray-600" />
                    <span className="text-white font-semibold text-lg">{holder.name}</span>
                  </td>
                  <td className="p-4 text-right text-white">${holder.tokens.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);


const StakingTokens = ({ stakingTokens }: { stakingTokens: Array<{ id: number; image: string; tokenName: string; amount: number }> }) => (
  <div className="w-full">
    <div className="bg-custom-radial-gradient p-6 rounded-lg shadow-lg w-full shadow-blue-900">
      {stakingTokens.length === 0 ? (
        <p className="text-white text-center">No staking tokens available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-800 text-left">Token</th>
                <th className="p-4 border-b border-gray-800 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stakingTokens.map((token) => (
                <tr key={token.id} className="hover:bg-blue-950 hover:rounded-lg transition duration-300 ease-in-out">
                  <td className="p-4 flex items-center space-x-4">
                    <img src={token.image} alt={token.tokenName} className="w-10 h-10 rounded-xl border border-gray-600" />
                    <span className="text-white font-semibold text-lg">{token.tokenName}</span>
                  </td>
                  <td className="p-4 text-right text-white">{token.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);



const drawerList = [
  {
    label: "Liquidity",
    content: <PoolContent pools={[
      {
        tokenA: 'planq',
        tokenB: 'swisstronik',
        liquidity: 1000,
        imageA: '/planq.jpg',
        imageB: '/tokens/swisstronik.png',
        id: 1
      },
      {
        tokenA: 'bitcoin',
        tokenB: 'oraichain',
        liquidity: 500,
        imageA: '/tokens/bitcoin.png',
        imageB: '/tokens/orai.jpg',
        id: 2
      },
      // Add more pools as needed
    ]} />,
  },
  {
    label: "Token Holders",
    content: <TokenHolders tokenHolders={[
      {
        id: 1,
        name: 'planq',
        tokens: 2000,
        image: '/tokens/planq.jpg', // Add the image path
      },
      {
        id: 2,
        name: 'oraichain',
        tokens: 1500,
        image: '/tokens/orai.jpg', // Add the image path
      },
      {
        id: 3,
        name: 'bitocin',
        tokens: 3000,
        image: '/tokens/bitcoin.png', // Add the image path
      },
      // Add more holders as needed
    ]} />,
  },
  {
    label: "Staking Tokens",
    content: <StakingTokens stakingTokens={[
      {
        id: 1,
        tokenName: 'planq',
        amount: 500,
        image: '/tokens/planq.jpg', // Add the image path
      },
      {
        id: 2,
        tokenName: 'swisstronik',
        amount: 300,
        image: '/tokens/swisstronik.png', // Add the image path
      },
      // Add more staking tokens as needed
    ]} />,
  },
];

function Portofolio() {
  return (
    <section className="pt-40 px-40">
      <div className="flex items-center justify-between">
        <div className="text-end py-5 space-y-3">
          <p className="text-4xl font-bold text-white sm:text-4xl">
            Overview
          </p>
        </div>
      </div>
      <div className="flex flex-row-reverse items-center py-5 gap-4 px-10 justify-between rounded-xl max-w-screen bg-explore shadow-md shadow-gray-800">
        {overviewList.map((item, index) => (
          <div key={index} className="card bg-black w-80 shadow-xl hover:bg-custom-radial-gradient">
            <div className="h-full p-5 space-y-4 z-50">
              <p className="text-lg font-semibold text-gray-200 w-full limit-text">
                {item.title}
              </p>
              <div>
                <span className="text-4xl font-bold text-blue-400 leading-normal">
                  {item.amount ? `$${item.amount.toFixed(2)}` : "N/A"}
                </span>
                {item.unit && (
                  <span className="ml-2 text-md font-medium text-gray-400">
                    {item.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="py-5">
        <Drawer drawerItems={drawerList} bgCustom='bg-custom-radial-gradient' />
      </div>
    </section>
  );
}

export default Portofolio;
