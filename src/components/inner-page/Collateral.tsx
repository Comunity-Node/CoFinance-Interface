import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ethers } from 'ethers';
import { getTokenBalance, approveToken } from '@/utils/TokenUtils';
import { getPoolByPairs } from '@/utils/Factory';
import { depositCollateral } from '@/utils/CoFinance';
import '@sweetalert2/theme-dark/dark.css';
import { CiWallet } from 'react-icons/ci';
import { FaPassport } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

interface CollateralProps {
    tokenOptions?: ImageSelect[];
    borrowedTokenOptions?: ImageSelect[];
    handleDepositCollateral: (amount: number, poolAddress: string) => Promise<{ amount: number }>;
    account: string;
    provider: ethers.BrowserProvider;
}

const Collateral: React.FC<CollateralProps> = ({ tokenOptions = [], borrowedTokenOptions = [], handleDepositCollateral, account, provider }) => {
    const [selectedDepositToken, setSelectedDepositToken] = useState<ImageSelect | null>(null);
    const [selectedBorrowedToken, setSelectedBorrowedToken] = useState<ImageSelect | null>(null);
    const [collateralAmount, setCollateralAmount] = useState<number>(0);
    const [userBalance, setUserBalance] = useState<string>('0');
    const [loading, setLoading] = useState<boolean>(false);
    const [poolAddress, setPoolAddress] = useState<string>('');
    // const providerRef = useRef<ethers.BrowserProvider | null>(provider || null);

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        label: token.name,
        image: token.image,
    }));

    const defaultBorrowedTokenOptions = borrowedTokenOptions.length > 0 ? borrowedTokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        label: token.name,
        image: token.image,
    }));

    const loadAccount = async () => {
        setLoading(true);
        try {
            if (!window.ethereum) {
                await MySwal.fire({
                    title: 'Wallet not found!',
                    text: 'Please install MetaMask or another Ethereum wallet.',
                    icon: 'warning',
                    customClass: {
                        popup: 'my-custom-popup',
                        confirmButton: 'my-custom-confirm-button',
                        cancelButton: 'my-custom-cancel-button',
                    },
                    confirmButtonText: 'Close',
                });
                return;
            }

            if (!provider) {
                provider = new ethers.BrowserProvider(window.ethereum);
            }

            const signer = await provider.getSigner();
            const accountAddress = await signer.getAddress();
            fetchBalance(accountAddress);
        } catch (error) {
            console.error('Error loading account:', error);
            await MySwal.fire({
                title: 'Error loading account!',
                text: 'Could not load your account information.',
                icon: 'error',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                    cancelButton: 'my-custom-cancel-button',
                },
                confirmButtonText: 'Close',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchBalance = async (account: string) => {
        if (!provider || !selectedDepositToken) return;

        const balance = await getTokenBalance(provider, selectedDepositToken.value, account);
        setUserBalance(balance);
    };

    useEffect(() => {
        if (account) {
            fetchBalance(account);
        }
    }, [selectedDepositToken, account]);

    useEffect(() => {
        const fetchPool = async () => {
            if (!provider || !selectedDepositToken || !selectedBorrowedToken) return;

            const fetchedPoolAddress = await getPoolByPairs(provider, selectedDepositToken.value, selectedBorrowedToken.value);
            setPoolAddress(fetchedPoolAddress || '');
        };

        fetchPool();
    }, [selectedDepositToken, selectedBorrowedToken]);

    const onDepositCollateral = async () => {
        if (!selectedDepositToken || collateralAmount <= 0 || !selectedBorrowedToken || !poolAddress) {
            await MySwal.fire({
                title: 'Error!',
                text: 'Please select a deposit token, enter a valid amount, select a token to borrow, and choose a pool.',
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

        try {
            await approveToken(provider, selectedDepositToken.value, poolAddress, collateralAmount.toString());
            await depositCollateral(provider, poolAddress, selectedDepositToken.value, collateralAmount.toString());

            await MySwal.fire({
                title: 'Deposit Successfully!',
                html: `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <img src="${selectedDepositToken.image}" alt="${selectedDepositToken.label}" style="border-radius: 50%; width: 5%; height: 5%; margin-right: 10px;">
                    <span><strong>${selectedDepositToken.label}</strong> with amount <strong>${collateralAmount}</strong></span>
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

            fetchBalance(account);
        } catch (error) {
            console.error('Error during deposit:', error);
            await MySwal.fire({
                title: 'Error!',
                text: 'There was a problem with the deposit or approval.',
                icon: 'error',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                    cancelButton: 'my-custom-cancel-button',
                },
                confirmButtonText: 'Close',
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value >= 0) {
            setCollateralAmount(value);
        } else {
            setCollateralAmount(0);
        }
    };


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className='space-y-4 py-4 h-96 overflow-y-hidden'>
            <div role="alert" className="alert shadow-lg">
                <FaPassport />
                <div>
                    <h3 className="font-bold">Pool Address :</h3>
                    <div className="text-lg">{poolAddress ? poolAddress : '-'}</div>
                </div>
                <button className="btn btn-sm"><CiWallet /><strong>{userBalance}</strong></button>
            </div>
            
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={setSelectedDepositToken}
                    handleValue={selectedDepositToken}
                    className="border-none hover:border-0"
                    placeholder="Select deposit token"
                />
                <div className="space-y-2 w-full">
                    <input
                        type="tel"
                        value={collateralAmount || ''}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                    />
                    <input type="range" min={0} max={parseFloat(userBalance) == 0 ? 100 : userBalance} value={collateralAmount || ''}
                        onChange={handleInputChange} className="custom-slider" />
                </div>
            </div>

            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    tokenOptions={defaultBorrowedTokenOptions}
                    handleOnChange={setSelectedBorrowedToken}
                    handleValue={selectedBorrowedToken}
                    className="border-none hover:border-0"
                    placeholder="Select token to borrow"
                />
            </div>

            <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
                <button
                    className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
                    onClick={onDepositCollateral}
                >
                    Deposit <MdOutlineArrowOutward />
                </button>
            </div>

        </div >
    );
};

export default Collateral;
