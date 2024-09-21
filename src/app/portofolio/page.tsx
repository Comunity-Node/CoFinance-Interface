'use client';
import Drawer from '@/components/Drawer';
import React, { useState } from 'react';
import { FaArrowsAltH } from 'react-icons/fa';
import { MdOutlineArrowOutward } from 'react-icons/md';

// Calculate total liquidity
const totalLiquidityData = [
  {
    id: '1',
    tokenA: 'planq',
    tokenB: 'swisstronik',
    liquidity: 1000,
    imageA: '/planq.jpg',
    imageB: '/tokens/swisstronik.png',
  },
  {
    id: '2',
    tokenA: 'bitcoin',
    tokenB: 'oraichain',
    liquidity: 500,
    imageA: '/tokens/bitcoin.png',
    imageB: '/tokens/orai.jpg',
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

// PoolContent Component
const PoolContent = ({ pools }) => (
  <div className="bg-[#141414] p-6 rounded-lg min-w-full">
    {pools.length === 0 ? (
      <p className="text-white text-center">No pools available</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-400">Liquidity</th>
              <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool) => (
              <tr key={pool.id} className="hover:bg-[#576574] hover:text-[#141414] hover:rounded-lg transition duration-300 ease-in-out">
                <td className="p-4 flex items-center space-x-4">
                  <img src={pool.imageA} alt={pool.tokenA} className="w-10 h-10 rounded-full" />
                  <span className="text-gray-200 hover:text-[#141414] font-regular text-lg">{pool.tokenA}</span>
                  <FaArrowsAltH />
                  <img src={pool.imageB} alt={pool.tokenB} className="w-10 h-10 rounded-full" />
                  <span className="text-gray-200 hover:text-[#141414] font-regular text-lg">{pool.tokenB}</span>
                </td>
                <td className="p-4 text-right text-gray-200 hover:text-[#141414]">$ {pool.liquidity.toFixed(2)} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// TokenHolders Component
const TokenHolders = ({ tokenHolders }) => (
  <div className="bg-[#141414] p-6 rounded-lg min-w-full">
    {tokenHolders.length === 0 ? (
      <p className="text-white text-center">No token holders available</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-400">Holder</th>
              <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {tokenHolders.map((holder) => (
              <tr key={holder.id} className="hover:bg-[#576574] hover:text-[#141414] hover:rounded-lg transition duration-300 ease-in-out">
                <td className="p-4 flex items-center space-x-4">
                  <img src={holder.image} alt={holder.name} className="w-10 h-10 rounded-full" />
                  <span className="text-gray-200 font-regular text-lg">{holder.name}</span>
                </td>
                <td className="p-4 text-right text-gray-200">${holder.tokens.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// StakingTokens Component
function StakingTokens({ stakingTokens }) {

  return (
    <div className="bg-[#141414] p-6 rounded-lg min-w-full ">
      {stakingTokens.length === 0 ? (
        <p className="text-white text-center">No staking tokens available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-300">Token</th>
                <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stakingTokens.map((token) => (
                <tr key={token.id} className="hover:bg-[#576574] hover:text-[#141414] hover:rounded-lg transition duration-300 ease-in-out">
                  <td className="p-4 flex items-center space-x-4">
                    <img src={token.image} alt={token.tokenName} className="w-10 h-10 rounded-full border-none" />
                    <span className="text-gray-200 font-regular text-lg">{token.tokenName}</span>
                  </td>
                  <td className="p-4 text-right text-gray-200">${token.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StakingLPTokens({ stakingLPTokens }) {
  const [imageError, setImageError] = useState(true);

  const getInitials = (name: string) => {
    if (!name) return 'N/A'; // Handle missing names
    const words = name.split(' ').filter(word => isNaN(Number(word))); // Split by spaces and ignore numbers
    const initials = words.map(word => word[0]).join('').toUpperCase(); // Get first letter of each word and join them
    return initials.slice(0, 2); // Return only the first two initials
  };


  return (
    <div className="bg-[#141414] p-6 rounded-lg min-w-full mt-6"> {/* Added mt-6 for margin-top */}
      {stakingLPTokens.length === 0 ? (
        <p className="text-white text-center">No LP tokens available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-300">Staking LP</th>
                <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stakingLPTokens.map((token) => (
                <tr key={token.id} className="hover:bg-[#576574] hover:text-[#141414] hover:rounded-lg transition duration-300 ease-in-out">
                  <td className="p-4 flex items-center space-x-4">
                    {!token.image || imageError ? (
                      // Fallback if image is missing or fails to load
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">
                          {getInitials(token.tokenName)}
                        </span>
                      </div>
                    ) : (
                      // Render image if it exists and loads successfully
                      <img
                        src={token.image}
                        alt={getInitials(token.tokenName)}
                        className="w-10 h-10 rounded-full"
                        onError={() => setImageError(false)} // If image fails to load, set imageError to true
                      />
                    )}

                    <span className="text-gray-200 font-regular text-lg">{token.tokenName}</span>
                  </td>

                  <td className="p-4 text-right text-gray-200">${token.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Loans = ({ loans }) => (
  <div className="bg-[#141414] p-6 rounded-lg min-w-full">
    {loans.length === 0 ? (
      <p className="text-white text-center">No loans available</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-300">Collateral Type</th>
              <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-300">Loan Amount</th>
              <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-300">Collateral</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-[#576574] hover:text-[#141414] hover:rounded-lg transition duration-300 ease-in-out">
                <td className="p-4 text-gray-200">{loan.collateralType}</td>
                <td className="p-4 text-right text-gray-200">${loan.loanAmount.toFixed(2)}</td>
                <td className="p-4 text-right text-gray-200">${loan.collateral.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

function Portofolio() {
  // Dummy data for staking LP tokens and loans
  const stakingLPTokens = [
    {
      id: 1,
      tokenName: 'LP Token 1',
      amount: 800,
      image: '/tokens/lp-token1.png',
    },
    {
      id: 2,
      tokenName: 'LP Token 2',
      amount: 500,
      image: '/tokens/lp-token2.png',
    },
  ];

  const loans = [
    {
      id: 1,
      loanAmount: 500,
      collateral: 1000,
      collateralType: 'PLANQ',
    },
    {
      id: 2,
      loanAmount: 300,
      collateral: 600,
      collateralType: 'SWISSTRONIK',
    },
  ];

  // Update the drawer list to include new components
  const drawerList = [
    {
      label: "Liquidity",
      content: (
        <>
          <PoolContent pools={totalLiquidityData} />
          <StakingLPTokens stakingLPTokens={stakingLPTokens} />
        </>
      ),
    },
    {
      label: "Token Holders",
      content: <TokenHolders tokenHolders={[]} />, // Add token holders data here
    },
    {
      label: "Staking Tokens",
      content: <StakingTokens stakingTokens={[]} />, // Add staking tokens data here
    },
    {
      label: "Loans",
      content: <Loans loans={loans} />,
    },
  ];

  return (
    <section className="min-h-screen animation-bounce bg-portfolio bg-no-repeat bg-contain image-full">
      <div className="pt-40 px-40">
        <div className="flex items-center justify-between">
          <div className="text-end py-5 space-y-3">
            <p className="text-4xl font-bold text-white sm:text-4xl">Overview</p>
          </div>
        </div>
        <div className="flex flex-row-reverse items-center py-5 gap-6 px-0 justify-between rounded-xl max-w-screen bg-transparent">
          {overviewList.map((item, index) => (
            <div key={index} className="card bg-[#141414] w-full shadow-xl hover:bg-custom-radial-gradient">
              <div className="h-full px-5 py-7 space-y-1 z-50">
                <div className="flex">
                  <p className="text-md font-normal text-gray-400 w-full limit-text">{item.title}</p>
                  <MdOutlineArrowOutward />
                </div>
                <div>
                  <span className="text-4xl font-bold text-white">
                    {item.amount ? `$${item.amount.toFixed(2)}` : "N/A"}
                  </span>
                  {item.unit && (
                    <span className="ml-2 text-md font-medium text-gray-400">{item.unit}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="py-0">
          <Drawer
            drawerItems={drawerList}
            classParent='py-2'
            title='Token Assets'
            classActiveTab='bg-[#bdc3c7] py-2 px-4 rounded-sm text-left text-[#141414]'
            classDeactiveTab='bg-transparent border border-[#bdc3c7] py-2 px-4 rounded-sm text-left text-gray-300'
          />
        </div>
      </div>
    </section>
  );
}

export default Portofolio;
