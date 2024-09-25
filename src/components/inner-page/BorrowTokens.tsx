import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import { SelectList } from '@/types/SelectList';
import Swal from 'sweetalert2';
import { durations } from '@/utils/durations';
import withReactContent from 'sweetalert2-react-content';
import { ethers } from 'ethers';
import { getCollateral, getTokenAddresses, borrowTokens } from '../../utils/CoFinance';
import { getTokenBalance } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory';
import '@sweetalert2/theme-dark/dark.css';
import { useAccount } from '@/app/RootLayout';

const MySwal = withReactContent(Swal);

interface BorowsTokenProps {
    tokenOptions?: ImageSelect[];
    durationOptions?: SelectList[];
    handleBorrowAmounts: (amount: number) => Promise<{ amount: number }>;
    accounts: string;
    provider: ethers.BrowserProvider;
}

const BorrowTokens: React.FC<BorowsTokenProps> = ({ tokenOptions = [], durationOptions = [], handleBorrowAmounts, accounts, provider }) => {
    const [selectedBorrowToken, setSelectedBorrowToken] = useState<ImageSelect | null>(null);
    const [selectedCollateralToken, setSelectedCollateralToken] = useState<ImageSelect | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<SelectList | null>(null);
    const [selectedPool, setSelectedPool] = useState<string | null>(null);
    const { account, setAccount } = useAccount();
    const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
    const [borrowAmount, setBorrowAmount] = useState<number>(0);
    const [userCollateralBalances, setUserCollateralBalances] = useState<{ [key: string]: string } | null>(null);
    const [userBorrowTokenBalance, setUserBorrowTokenBalance] = useState<string>('0');
    const [loading, setLoading] = useState<boolean>(false);
    const providerRef = useRef<ethers.BrowserProvider | null>(null);
    const [borrowTokenAddress, setBorrowTokenAddress] = useState<string | null>(null);
    const [collateralTokenAddress, setCollateralTokenAddress] = useState<string | null>(null);

    // Default token and duration options
    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        label: token.name,
        image: token.image,
    }));

    const durationList = durationOptions.length > 0 ? durationOptions : durations.map(item => ({
        value: String(item.value),
        label: item.label,
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
            } catch (error) {
                console.error('Error loading account:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAccount();
    }, []);

    // Fetch pool address and collateral data
    const fetchPoolAddress = async () => {
        if (!providerRef.current || !selectedBorrowToken || !selectedCollateralToken) return;
        const poolAddress = await getPoolByPairs(providerRef.current, selectedBorrowToken.value, selectedCollateralToken.value);
        setSelectedPool(poolAddress || null);

        if (poolAddress) {
            const balances = await getCollateral(providerRef.current, account || '', poolAddress);
            const collateralA = balances.collateralA || '0';
            setUserCollateralBalances({ [selectedCollateralToken.label]: collateralA });
            try {
                const addresses = await getTokenAddresses(providerRef.current, selectedBorrowToken.value);
                setBorrowTokenAddress(addresses.borrowTokenAddress || null);
                setCollateralTokenAddress(addresses.tokenA ? addresses.tokenA : null);
            } catch (error) {
                console.error('Error fetching collateral balances:', error);
            }
        }
    };

    useEffect(() => {
        fetchPoolAddress();
    }, [selectedBorrowToken, selectedCollateralToken]);

    // Fetch borrow token balance for the account
    const fetchBorrowTokenBalance = async (account: string) => {
        if (!providerRef.current || !selectedBorrowToken) return;
        const balance = await getTokenBalance(providerRef.current, selectedBorrowToken.value, account);
        setUserBorrowTokenBalance(balance);
    };

    useEffect(() => {
        if (account) {
            fetchBorrowTokenBalance(account);
        }
    }, [selectedBorrowToken, account]);

    // Handle token selection (borrow and collateral)
    const handleTokenSelection = (setToken: React.Dispatch<React.SetStateAction<ImageSelect | null>>, selectedToken: ImageSelect | null) => {
        setToken(selectedToken);
        if (setToken === setSelectedCollateralToken) {
            fetchPoolAddress();
        }
    };

    // Borrow tokens function
    const onBorrowTokens = async () => {
        if (!selectedBorrowToken || !selectedCollateralToken || !selectedDuration || borrowAmount <= 0 || !selectedPool) {
            await MySwal.fire({
                title: 'Error!',
                text: 'Please select a borrow token, collateral token, and enter a valid amount.',
                icon: 'error',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                },
                confirmButtonText: 'Close',
            });
            return;
        }

        setIsBorrowing(true);
        try {
            await borrowTokens(
                providerRef.current!,
                selectedPool,
                borrowAmount.toString(),
                selectedBorrowToken.value,
                parseInt(selectedDuration.value)
            );

            await MySwal.fire({
                title: 'Borrow Successfully!',
                html: `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <img src="${selectedBorrowToken.image}" alt="${selectedBorrowToken.label}" style="border-radius: 50%; width: 20%; height: 20%; margin-right: 10px;">
                    <span style="text-align: start"><strong>${selectedBorrowToken.label}</strong> with amount <strong>$${borrowAmount}</strong> & Duration ends <strong>${selectedDuration.label}</strong></span>
                </div>
                `,
                icon: 'success',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                },
                confirmButtonText: 'Close',
            });
            fetchBorrowTokenBalance(account || '');
        } catch (error) {
            console.error('Error during borrowing:', error);
            await MySwal.fire({
                title: 'Error!',
                text: 'There was a problem with the borrow: ' + (error),
                icon: 'error',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                },
                confirmButtonText: 'Close',
            });
        } finally {
            setIsBorrowing(false);
        }
    };

    return (
        <div className='space-y-4 py-4 h-full'>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    placeholder='Choose Tokens to Borrow'
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={(token) => handleTokenSelection(setSelectedBorrowToken, token)}
                    handleValue={selectedBorrowToken}
                    className="border-none hover:border-0"
                />
                <div className="space-y-2 w-full">
                    <input
                        type="tel"
                        value={borrowAmount || ''}
                        onChange={(e) => setBorrowAmount(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                    />
                    <input type="range" min={0} max={100} value={borrowAmount || ''}
                        onChange={(e) => setBorrowAmount(parseFloat(e.target.value) || 0)}
                        className="range range-xs" />
                </div>
            </div>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    placeholder='Choose Collateral Token'
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={(token) => handleTokenSelection(setSelectedCollateralToken, token)}
                    handleValue={selectedCollateralToken}
                    className="border-none hover:border-0"
                />
                <CustomSelectSearch
                    placeholder='Select Duration'
                    tokenOptions={durationList}
                    handleOnChange={(duration) => setSelectedDuration(duration)}
                    handleValue={selectedDuration}
                    className="border-none hover:border-0"
                />
            </div>
            <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
                <button onClick={onBorrowTokens} className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full" disabled={isBorrowing || loading}>
                    {isBorrowing ? 'Processing...' : (
                        <span className='flex items-center justify-between'>
                            Borrow Now
                            <MdOutlineArrowOutward size={18} />
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default BorrowTokens;
