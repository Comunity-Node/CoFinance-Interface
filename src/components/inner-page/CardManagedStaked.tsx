import Link from 'next/link';
import React, { useState } from 'react';
import { BsCopy } from 'react-icons/bs';
import { FaNetworkWired } from 'react-icons/fa';
import { GiTrophyCup, GiTakeMyMoney, GiPayMoney } from "react-icons/gi";

interface CardManagedStakedProps {
    stakedAmount: string;
    unstakedAmount: string;
    txHash: string;
    selectedValidator: any;
    changeStakedAmount: (value: string) => void;
    changeUnstakedAmount: (value: string) => void;
    handleStake: () => void;
    handleUnstake: () => void;
    handleClaimRewards: () => void;
}

const CardManagedStaked: React.FC<CardManagedStakedProps> = ({ 
    stakedAmount, 
    unstakedAmount, 
    changeStakedAmount, 
    changeUnstakedAmount, 
    txHash, 
    selectedValidator, 
    handleStake, 
    handleUnstake, 
    handleClaimRewards 
}) => {
    // New states for loading, success/error feedback
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionStatus, setActionStatus] = useState<string | null>(null); 
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    const handleAction = async (actionType: 'stake' | 'unstake' | 'claim') => {
        setIsProcessing(true);
        setActionStatus(null);
        setErrorMessage(null);
    
        try {
            if (actionType === 'stake') {
                await handleStake(); 
            } else if (actionType === 'unstake') {
                await handleUnstake();
            } else if (actionType === 'claim') {
                await handleClaimRewards();
            }
            setActionStatus('success');
        } catch (error) {
          //  setActionStatus('error'); 
            //setErrorMessage(error?.message || 'An error occurred. Please try again.'); 
        } finally {
            setIsProcessing(false);
        }
    };
    const isAmountValid = (amount: string) => parseFloat(amount) > 0 && !isNaN(parseFloat(amount));

    return (
        <div className="text-center w-full justify-center flex items-center z-50 mx-auto shadow-lg">
            <div className='bg-transparent shadow-xl pt-4 w-full max-w-xl'>
                <div className="space-y-4 px-2">
                    <div role="alert" className="alert">
                        <FaNetworkWired />
                        <span>Your Selected Validator</span>
                        <div>
                            <button className="btn btn-sm btn-gray-600 text-2xl font-normal">{selectedValidator ? selectedValidator.moniker : 'Undefined'}</button>
                        </div>
                    </div>

                    {/* Staked Amount */}
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Staked Amount</span>
                        </div>
                        <input
                            type='tel'
                            className="input input-bordered w-full placeholder:text-gray-500"
                            value={stakedAmount}
                            onChange={(e) => changeStakedAmount(e.target.value)} // Fix here
                            placeholder={'Your Staked Amount'}
                            disabled={isProcessing}
                        />
                    </label>

                    {/* Unstaked Amount */}
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Unstaked Amount</span>
                        </div>
                        <input
                            type='tel'
                            className="input input-bordered w-full placeholder:text-gray-500"
                            value={unstakedAmount}
                            onChange={(e) => changeUnstakedAmount(e.target.value)} // Fix here
                            placeholder={'Your Unstaked Amount'}
                            disabled={isProcessing}
                        />
                    </label>

                    <div className="flex items-center justify-between py-5">
                        <div className="pb-0 px-2 w-full">
                            <button
                                onClick={() => handleAction('stake')}
                                className="btn border-0 text-lg font-semibold bg-[#bdc3c7] hover:bg-transparent hover:text-[#bdc3c7] text-gray-950 w-full"
                                disabled={isProcessing || !isAmountValid(stakedAmount)}
                            >
                                {isProcessing ? 'Processing...' : 'Stake'} <GiTakeMyMoney size={18} />
                            </button>
                        </div>
                        <div className="pb-0 px-2 w-full">
                            <button
                                onClick={() => handleAction('unstake')}
                                className="btn border border-[#bdc3c7] text-lg font-semibold bg-transparent text-[#bdc3c7] hover:border-0 hover:text-gray-950 hover:bg-[#bdc3c7] w-full"
                                disabled={isProcessing || !isAmountValid(unstakedAmount)}
                            >
                                {isProcessing ? 'Processing...' : 'Unstake'} <GiPayMoney size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Claim Rewards */}
                    <div className="pb-0 px-2">
                        <button
                            onClick={() => handleAction('claim')}
                            className="btn border-0 text-lg font-semibold bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 hover:bg-transparent text-gray-950 w-full"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Claim Rewards'} <GiTrophyCup size={18} />
                        </button>
                    </div>

                    {/* Action Status */}
                    {actionStatus && (
                        <div className={`py-2 ${actionStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {actionStatus === 'success' ? 'Action successful!' : errorMessage || 'Action failed. Please try again.'}
                        </div>
                    )}

                    {/* Transaction Hash */}
                    {txHash && (
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Tx Hash</span>
                            </div>
                            <div className="join">
                                <input
                                    className="input input-bordered join-item w-full placeholder:text-gray-500"
                                    value={txHash || ''}
                                    readOnly
                                />
                                <Link
                                    target='_blank'
                                    href={`https://www.mintscan.io/osmosis-testnet/tx/${txHash}`}>
                                    <button
                                        className={`btn join-item rounded-lg font-normal tooltip tooltip-success`}
                                        data-tip={'Visit'}
                                    >
                                        <BsCopy />
                                    </button>
                                </Link>
                            </div>
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardManagedStaked;
