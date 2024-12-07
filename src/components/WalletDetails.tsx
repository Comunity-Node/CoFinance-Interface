import React from 'react';
import { BsCopy } from 'react-icons/bs';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Link from 'next/link';

const WalletDetails = ({
    connected,
    account,
    handleCopy,
    copySuccess,
    handleDisconnectWallet,
    loading,
  }: {
    connected: boolean;
    account: string;
    handleCopy: () => void;
    copySuccess: string;
    handleDisconnectWallet: () => void;
    loading: boolean;
}) => {
  return (
    <div className="space-y-4">
      {/* Wallet Info */}
      <ul
        className={`menu menu-lg ${
          connected
            ? 'bg-transparent border-gray-700 border-2 rounded-xl'
            : 'bg-[#141414]'
        } rounded-box w-full`}
      >
        <div className="p-4 space-y-4">
          <p className="text-green-700 text-sm">Connected with Metamask</p>
          <li className="p-1 hover:bg-transparent">
            <div
              className={`w-full space-x-2 flex items-center py-2 px-5 rounded-lg transition`}
            >
              <img
                className="w-10"
                src={`https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png`}
                alt={``}
              />
              <div className="flex flex-col w-full">
                <span className="text-xl flex items-center justify-between w-full">
                  {connected
                    ? `${account?.substring(0, 10)}...${account?.substring(
                        account.length - 10
                      )}`
                    : 'Connect Wallet'}
                </span>
              </div>
            </div>
          </li>

          <div className="flex items-center justify-between">
            <Link
              onClick={handleCopy}
              className={`flex gap-2 items-center text-sm text-gray-400 ${
                copySuccess ? 'tooltip tooltip-open tooltip-success' : ''
              }`}
              data-tip={copySuccess ? 'Copied' : ''}
              href={''}
            >
              <BsCopy /> Copy Address
            </Link>
            <Link
              className="flex gap-2 items-center text-sm text-gray-400"
              href={'/portofolio'}
            >
              <MdOutlineArrowOutward /> View Portfolio
            </Link>
          </div>
        </div>
      </ul>

      {/* Total Assets */}
      <div className="card bg-[#141414] w-full shadow-xl hover:bg-custom-radial-gradient">
        <div className="h-full px-5 py-7 space-y-1 z-50">
          <div className="flex">
            <p className="text-md font-normal text-gray-400 w-full limit-text">
              Total Assets
            </p>
            <MdOutlineArrowOutward />
          </div>
          <div>
            <span className="text-4xl font-bold text-white">15000</span>
          </div>
        </div>
      </div>

      {/* Disconnect Button */}
      <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
        <button
          className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
          onClick={handleDisconnectWallet}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <span className="loading loading-bars loading-sm"></span>
            </div>
          ) : (
            <>
              Disconnect <MdOutlineArrowOutward />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WalletDetails;