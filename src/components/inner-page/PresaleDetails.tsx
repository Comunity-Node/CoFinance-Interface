'use client';

import { ImageSelect } from '@/types/ImageSelect';
import React, { useState } from 'react';
import tokens from '@/data/token.json';
import Link from 'next/link';
import { FaLink } from 'react-icons/fa';
import { MdOutlineArrowOutward } from 'react-icons/md';
import CustomSelectSearch from '../CustomSelectSearch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-dark/dark.css'; // Import the dark theme

const MySwal = withReactContent(Swal);


interface PresaleDetailProps {
    tokenOptions?: ImageSelect[];
    pool: {
        token: string;
        convert: string;
        image: string;
        description: string;
        website: string;
        softCap: number;
        hardCap: number;
        accumulatedCap: number;
    };
    handleAmountPaticipate: (amount: number) => Promise<{ amount: number }>;
}

const PresaleDetails: React.FC<PresaleDetailProps> = ({ tokenOptions = [], pool, handleAmountPaticipate }) => {
    // ...rest of your code remains unchanged...
    const [selectToken, setSelectedToken] = useState<ImageSelect | null>(null);
    const [isParticipate, setIsParticipate] = useState<boolean>(false);
    const [participateAmount, setParticipateAmount] = useState<number>(0);

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        label: token.name,
        image: token.image,
    }));

    const onParticipate = async () => {
        if (!selectToken || participateAmount <= 0) {
            await MySwal.fire({
                title: 'Error!',
                text: 'Please select a token and enter a valid amount.',
                icon: 'error',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                    cancelButton: 'my-custom-cancel-button',
                },
                confirmButtonText: 'Close',
            });
            return;
        }

        setIsParticipate(true);
        try {
            const result = await handleAmountPaticipate(participateAmount);
            setParticipateAmount(result.amount);
            await MySwal.fire({
                title: "You're participant now!",
                html: `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <img src="${selectToken.image}" alt="${selectToken.label}" style="border-radius: 50%; width: 5%; height: 5%; margin-right: 10px;">
                    <span><strong>${selectToken.label}</strong> with amount <strong>$${participateAmount}</strong></span>
                </div>
            `,
                icon: 'success',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                    cancelButton: 'my-custom-cancel-button',
                },
                confirmButtonText: 'Close',
            });
        } catch (error) {
            await MySwal.fire({
                title: 'Error!',
                text: 'There was a problem with the join participate.',
                icon: 'error',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                    cancelButton: 'my-custom-cancel-button',
                },
                confirmButtonText: 'Close',
            });
        } finally {
            setIsParticipate(false);
        }
    };


    return (
        <div className='py-4 px-2 h-full'>
            <p className='uppercase text-xl font-normal text-gray-300'>Overview</p>
            <div className="divider"></div>
            <div className="space-y-4">
                <div role="alert" className="alert shadow-lg bg-transparent">
                    <img src={pool.image} className='w-10 h-10 rounded-full' alt="" />
                    <div>
                        <span className="font-bold">{pool.token} <span className='text-gray-500 font-thin ms-1'>{pool.convert}</span></span>
                        <div className="text-sm text-gray-500 font-normal">{pool.description}</div>
                    </div>
                    <Link href={pool.website} target='_blank' className='bg-gray-700 p-2 rounded-md text-[#c2c2c2] tooltip' data-tip="Visit Website" >
                        <FaLink />
                    </Link>
                </div>
                <div className="flex w-full bg-base-300 rounded-lg py-5">
                    <div className="card bg-transparent grid h-full flex-grow place-items-center text-center space-y-2">
                        <p className="text-sm font-normal text-gray-400 w-full limit-text">SoftCap</p>
                        <p className="text-2xl font-semibold text-gray-400 w-full limit-text">{pool.softCap.toFixed(2)} <span className='font-thin text-gray-500'>%</span></p>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="card bg-transparent grid h-full flex-grow place-items-center text-center space-y-2">
                        <p className="text-sm font-normal text-gray-400 w-full limit-text">HardCap</p>
                        <p className="text-2xl font-semibold text-gray-400 w-full limit-text">{pool.hardCap.toFixed(2)} <span className='font-thin text-gray-500'>%</span></p>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-normal text-gray-400 w-full limit-text">Reached</p>
                    <div className='space-y-1 text-right'>
                        <p className="text-gray-200 text-md">{((pool.accumulatedCap / pool.hardCap) * 100).toFixed(2)}%</p>
                        <progress className="progress progress-success w-full" value={(pool.accumulatedCap / pool.hardCap) * 100} max="100"></progress>
                    </div>
                </div>
                <div className="space-y-3">
                    <p className='text-lg font-normal text-gray-200'>Join Participate</p>
                    <CustomSelectSearch
                        tokenOptions={defaultTokenOptions}
                        handleOnChange={setSelectedToken}
                        handleValue={selectToken}
                        className="border border-gray-700 hover:border-0"
                        placeholder="Select token"
                    />
                    <input
                        type="tel"
                        value={participateAmount || ''}
                        onChange={(e) => setParticipateAmount(parseFloat(e.target.value))}
                        placeholder="Amount"
                        className="text-right w-full rounded-xl p-3 text-lg border-gray-700 border bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                    />
                    <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
                        <button
                            className="btn btn-sm border-0 font-thin text-sm bg-transparent hover:bg-transparent text-gray-950 w-full"
                            onClick={onParticipate}
                            disabled={isParticipate}
                        >
                            {isParticipate ? (
                                <div className="flex items-center justify-center w-full">
                                    <span className="loading loading-bars loading-sm"></span>
                                </div>
                            ) : (
                                <>
                                    Join Now <MdOutlineArrowOutward />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PresaleDetails;
