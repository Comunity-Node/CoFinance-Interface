import React, { useState, useEffect } from 'react';
import { BsCopy } from 'react-icons/bs';
import { FaWallet } from 'react-icons/fa';
import { MdOutlineArrowOutward } from 'react-icons/md';

interface CardAccountDetailsProps {
    account: { address?: string };
    stakedAmount: string;
    balance: string;
    reward: string;
    selectedValidator: any;
    disconnectWallet: () => void;
}

const CardAccountDetails: React.FC<CardAccountDetailsProps> = ({ account, balance, stakedAmount, reward, selectedValidator, disconnectWallet }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    // Handle copying the wallet address to clipboard
    const handleCopy = () => {
        if (account?.address) {
            navigator.clipboard.writeText(account.address);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        }
    };

    return (
        <div className="text-center w-full justify-center flex items-center z-50 mx-auto shadow-lg">
            <div className='bg-transparent shadow-xl pt-4 w-full max-w-xl'>
                <div className="space-y-4 px-2">
                    <div role="alert" className="alert">
                        <FaWallet />
                        <span>Your Balance</span>
                        <div>
                            <button className="btn btn-sm btn-gray-600 text-2xl font-normal">{balance}</button>
                        </div>
                    </div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Keplr Wallet Address</span>
                        </div>
                        <div className="join">
                            <input
                                className="input input-bordered join-item w-full placeholder:text-gray-500"
                                value={account?.address || ''}
                                readOnly
                                placeholder={account?.address ? '' : 'Connect your Keplr Wallet'}
                            />
                            <button
                                className={`btn join-item rounded-lg font-normal ${copySuccess ? 'tooltip tooltip-open tooltip-success' : ''}`}
                                data-tip={copySuccess ? 'Copied' : ''}
                                onClick={handleCopy}
                            >
                                <BsCopy />
                            </button>
                        </div>
                    </label>

                    <div className="flex w-full bg-base-300 rounded-lg py-5">
                        <div className="card bg-transparent grid h-full flex-grow place-items-center space-y-2">
                            <p className="text-sm font-normal text-gray-400 w-full limit-text text-center text-wrap">Staked Amount</p>
                            <p className="text-2xl font-semibold text-gray-400 w-full limit-text">{stakedAmount || 0}</p>
                        </div>
                        <div className="divider divider-horizontal"></div>
                        <div className="card bg-transparent grid h-full flex-grow place-items-center space-y-2">
                            <p className="text-sm font-normal text-gray-400 w-full limit-text text-center text-wrap">Reward Staking</p>
                            <p className="text-2xl font-semibold text-gray-400 w-full limit-text">{reward || 0}
                                <div className='font-thin text-gray-500 text-sm'>OSMO</div>
                            </p>
                        </div>
                    </div>

                    <div className="py-4 px-2">
                        <div className="flex items-center justify-between text-start">
                            <p className="text-sm font-normal text-gray-400 w-full limit-text">Staked Validator</p>
                            <div className='space-y-1 text-right w-full'>
                                <p className="text-gray-200 text-md">{selectedValidator ? selectedValidator.moniker : 'None'}</p>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="flex items-center justify-between text-start">
                            <p className="text-sm font-normal text-gray-400 w-full limit-text">Network</p>
                            <div className='space-y-1 text-right w-full'>
                                <p className="text-gray-200 text-md">{selectedValidator ? selectedValidator.network : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="flex items-center justify-between text-start">
                            <p className="text-sm font-normal text-gray-400 w-full limit-text">APR</p>
                            <div className='space-y-1 text-right w-full'>
                                <p className="text-gray-200 text-md">{selectedValidator ? selectedValidator.apr : 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pb-0 px-2">
                        <button
                            onClick={disconnectWallet}
                            className="btn border-0 text-lg font-semibold bg-gradient-to-tr from-slate-400 via-gray-500 to-zinc-600 hover:bg-transparent text-gray-950 w-full"
                        >
                            Disconnect <MdOutlineArrowOutward size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardAccountDetails;
