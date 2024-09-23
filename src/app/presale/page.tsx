'use client';

import React, { useState } from 'react';
import PresaleDetails from '@/components/inner-page/PresaleDetails';
import { FaInfoCircle } from 'react-icons/fa';
import tokens from '@/data/token.json';

// Type for presale pool
interface PresalePool {
  id: number;
  token: string;
  amount: number;
  image: string;
  convert: string;
  description: string;
  softCap: number;
  hardCap: number;
  accumulatedCap: number;
  website: string;
}

const presalePools: PresalePool[] = [
  {
    id: 1,
    token: 'CoFi',
    convert: 'XFI',
    amount: 500,
    image: '/tokens/CoFi.png',
    description: 'A revolutionary new token offering. Visit our website for more details.',
    website: 'https://www.cofinance.io',
    softCap: 1000,
    hardCap: 5000,
    accumulatedCap: 1200
  },
  {
    id: 2,
    token: 'CoFi',
    convert: 'USDT',
    amount: 300,
    image: '/tokens/CoFi.png',
    description: 'An innovative project with great potential. Learn more on our website.',
    website: 'https://www.cofinance.io',
    softCap: 2000,
    hardCap: 7000,
    accumulatedCap: 3000
  },
];


const Presale: React.FC = () => {
  // State to hold the currently selected presale pool
  const [selectedPool, setSelectedPool] = useState<PresalePool | null>(null);

  const ActivePresale = ({ active }) => (
    <div className="bg-[#141414] p-6 rounded-lg min-w-full">
      {active.length === 0 ? (
        <p className="text-white text-center">No presale available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-400">Projects</th>
                <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">Amount</th>
                <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">SoftCap (%)</th>
                <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">HardCap (%)</th>
                <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">Reached
                  <button className="tooltip tooltip-left ms-2 mt-2" data-tip="(%) of Hard Cap Reached"><FaInfoCircle /></button>
                </th>
              </tr>
            </thead>
            <tbody>
              {presalePools.map((pool, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#576574] hover:text-[#141414] hover:rounded-lg transition cursor-pointer duration-300 ease-in-out"
                  onClick={() => setSelectedPool(pool)} // Set the selected pool when row is clicked
                >
                  <td className="p-4 flex items-center space-x-4">
                    <img src={pool.image} alt={pool.token} className="w-10 h-10 rounded-full border-none" />
                    <span className="text-gray-200 font-regular text-lg">{pool.token}</span>
                  </td>
                  <td className="p-4 text-right text-gray-200">{pool.amount.toFixed(2)}</td>
                  <td className="p-4 text-right text-gray-200">{pool.softCap.toFixed(2)} %</td>
                  <td className="p-4 text-right text-gray-200">{pool.hardCap.toFixed(2)} %</td>
                  <td className="p-4 text-right text-gray-200">{((pool.accumulatedCap / pool.hardCap) * 100).toFixed(2)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const fallbackPool = presalePools[0];

  return (
    <div className="min-h-screen bg-presale bg-no-repeat bg-contain">
      <div className="pt-40 pb-20 px-56">
        <div className="flex items-center justify-center">
          <div className="py-5 space-y-3 ">
            <p className="text-4xl text-center font-medium text-white sm:text-4xl">
              <span className='bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-700 mr-2'>CoFinance</span>
              Presales
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="bg-[#141414] rounded-xl py-4 px-0 space-y-6 basis-10/12">
            <ActivePresale active={presalePools} />
          </div>
          <div className="bg-[#141414] rounded-xl p-4 space-y-6 basis-1/2">
            {selectedPool || fallbackPool ? (
              <PresaleDetails
                tokenOptions={tokens.tokens.map(token => ({
                  value: token.address,
                  label: token.name,
                  image: token.image,
                }))}
                pool={selectedPool || fallbackPool} // Pass the selected pool as a prop
                handleAmountPaticipate={async (amount: number) => {
                  // Mock implementation for handleAmountPaticipate
                  return { amount };
                }}
              />
            ) : (
              <div className="flex items-center justify-center">
                <p className="text-white text-center">Please select a presale to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Presale;
