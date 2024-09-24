import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ethers } from 'ethers';
import { getTokenBalance, approveToken } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory'; 
import { depositCollateral } from '../../utils/CoFinance';
import '@sweetalert2/theme-dark/dark.css';

const MySwal = withReactContent(Swal);

interface CollateralProps {
    tokenOptions?: ImageSelect[];
    borrowedTokenOptions?: ImageSelect[];
    handleDepositCollateral: (amount: number, poolAddress: string) => Promise<{ amount: number }>;
}

const Collateral: React.FC<CollateralProps> = ({
    tokenOptions = [],
    borrowedTokenOptions = [],
    handleDepositCollateral,
}) => {
    const [selectedDepositToken, setSelectedDepositToken] = useState<ImageSelect | null>(null);
    const [selectedBorrowedToken, setSelectedBorrowedToken] = useState<ImageSelect | null>(null);
    const [collateralAmount, setCollateralAmount] = useState<number>(0);
    const [userBalance, setUserBalance] = useState<string>('0');
    const [account, setAccount] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [poolAddress, setPoolAddress] = useState<string>(''); // Initialize as an empty string
    const providerRef = useRef<ethers.BrowserProvider | null>(null);

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

    useEffect(() => {
        const loadAccount = async () => {
            setLoading(true);
            try {
                if (!window.ethereum) return;
                if (!providerRef.current) {
                    providerRef.current = new ethers.BrowserProvider(window.ethereum);
                }
                const signer = await providerRef.current.getSigner();
                const accountAddress = await signer.getAddress();
                setAccount(accountAddress);
                fetchBalance(accountAddress);
            } catch (error) {
                console.error('Error loading account:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAccount();
    }, []);

    const fetchBalance = async (account: string) => {
        if (!providerRef.current || !selectedDepositToken) return;

        const balance = await getTokenBalance(providerRef.current, selectedDepositToken.value, account);
        setUserBalance(balance);
    };

    useEffect(() => {
        if (account) {
            fetchBalance(account);
        }
    }, [selectedDepositToken, account]);

    useEffect(() => {
        const fetchPool = async () => {
            if (!providerRef.current || !selectedDepositToken || !selectedBorrowedToken) return;

            const fetchedPoolAddress = await getPoolByPairs(providerRef.current, selectedDepositToken.value, selectedBorrowedToken.value);
            setPoolAddress(fetchedPoolAddress || ''); // Set pool address or empty string if null
        };

        fetchPool();
    }, [selectedDepositToken, selectedBorrowedToken]);

    const onDepositCollateral = async () => {
        if (!selectedDepositToken || collateralAmount <= 0 || !selectedBorrowedToken || !poolAddress) {
            await MySwal.fire({
                title: 'Error!',
                text: 'Please select a deposit token, enter a valid amount, select a token to borrow, and choose a pool.',
                icon: 'error',
                confirmButtonText: 'Close',
            });
            return;
        }
    
        try {
            await approveToken(providerRef.current, selectedDepositToken.value, poolAddress, collateralAmount.toString());
            const result = await depositCollateral(providerRef.current, poolAddress, selectedDepositToken.value, collateralAmount.toString());
    
            await MySwal.fire({
                title: 'Deposit Successfully!',
                html: `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <img src="${selectedDepositToken.image}" alt="${selectedDepositToken.label}" style="border-radius: 50%; width: 5%; height: 5%; margin-right: 10px;">
                    <span><strong>${selectedDepositToken.label}</strong> with amount <strong>${collateralAmount}</strong></span>
                </div>
                `,
                icon: 'success',
                confirmButtonText: 'Close',
            });
    
            fetchBalance(account); 
        } catch (error) {
            console.error('Error during deposit:', error);
            await MySwal.fire({
                title: 'Error!',
                text: 'There was a problem with the deposit or approval.',
                icon: 'error',
                confirmButtonText: 'Close',
            });
        }
    };
    
    
    if (loading) {
        return <div className="loading">Loading...</div>; // Loading state
    }

    return (
        <div className='space-y-4 py-4 h-full'>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={setSelectedDepositToken}
                    handleValue={selectedDepositToken}
                    className="border-none hover:border-0"
                    placeholder="Select deposit token"
                />
                <input
                    type="number"
                    value={collateralAmount || ''}
                    onChange={(e) => setCollateralAmount(parseFloat(e.target.value))}
                    placeholder="0"
                    className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                />
                <div className="text-white">
                    Balance: {userBalance}
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

            {poolAddress && (
                <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                    <span className="text-white">Pool Address: {poolAddress}</span>
                </div>
            )}

            <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
                <button
                    className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
                    onClick={onDepositCollateral}
                >
                    Deposit <MdOutlineArrowOutward />
                </button>
            </div>
            <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })} className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full">
                Connect Wallet
            </button>
        </div>
    );
};

export default Collateral;
