import React, { useEffect, useState } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import durationsData from '@/data/durations.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import { SelectList } from '@/types/SelectList';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ethers } from 'ethers';
import { getUserCollateralBalances } from '../../utils/CoFinance'; 
import { getPoolByPairs } from '../../utils/Factory';
import '@sweetalert2/theme-dark/dark.css';

const MySwal = withReactContent(Swal);

interface CollateralProps {
    tokenOptions?: ImageSelect[];
    durationOptions?: SelectList[];
    handleBorrowAmounts: (amount: number) => Promise<{ amount: number }>;
    account: string;
    provider: ethers.BrowserProvider;
}

const BorrowTokens: React.FC<CollateralProps> = ({ tokenOptions = [], durationOptions = [], handleBorrowAmounts, account, provider }) => {
    const [selectedBorrowToken, setSelectedBorrowToken] = useState<ImageSelect | null>(null);
    const [selectedCollateralToken, setSelectedCollateralToken] = useState<ImageSelect | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<SelectList | null>(null);
    const [selectedPool, setSelectedPool] = useState<string | null>(null);
    const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
    const [borrowAmount, setBorrowAmount] = useState<number>(0);
    const [collateralOptions, setCollateralOptions] = useState<ImageSelect[]>([]);
    const [poolOptions, setPoolOptions] = useState<{ value: string; label: string }[]>([]);

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        label: token.name,
        image: token.image,
    }));

    const durationList = durationOptions.length > 0 ? durationOptions : durationsData.durations.map(item => ({
        value: String(item.value),
        label: item.label,
    }));

    useEffect(() => {
        const fetchCollateralBalances = async () => {
            if (!account || !provider) return;
            try {
                const balances = await getUserCollateralBalances(provider, account);
                const options: ImageSelect[] = [];
                const pools: { value: string; label: string }[] = [];

                for (const pool in balances) {
                    const { collateralA, collateralB } = balances[pool];
                    if (collateralA || collateralB) {
                        pools.push({ value: pool, label: `Pool ${pool}` });
                        if (collateralA) {
                            options.push({ value: pool, label: `Collateral A (${collateralA})`, image: tokens.tokens.find(token => token.address === pool)?.image });
                        }
                        if (collateralB) {
                            options.push({ value: pool, label: `Collateral B (${collateralB})`, image: tokens.tokens.find(token => token.address === pool)?.image });
                        }
                    }
                }

                setPoolOptions(pools);
                setCollateralOptions(options);
            } catch (error) {
                console.error('Error fetching collateral balances:', error);
            }
        };

        fetchCollateralBalances();
    }, [account, provider]);

    const handlePoolChange = async (selectedOption: { value: string; label: string } | null) => {
        setSelectedPool(selectedOption?.value || null);
        setSelectedCollateralToken(null);

        if (selectedOption) {
            const poolAddress = await getPoolByPairs(provider, selectedBorrowToken?.value, selectedOption.value);
            if (poolAddress) {
                setSelectedPool(poolAddress);
            }
        } else {
            setCollateralOptions([]);
        }
    };

    // Effect to fetch the first pool when both tokens are selected
    useEffect(() => {
        const fetchInitialPool = async () => {
            if (selectedBorrowToken && selectedCollateralToken) {
                const poolAddress = await getPoolByPairs(provider, selectedBorrowToken.value, selectedCollateralToken.value);
                setSelectedPool(poolAddress || null);
            }
        };

        fetchInitialPool();
    }, [selectedBorrowToken, selectedCollateralToken, provider]);

    const onBorrowTokens = async () => {
        if (!selectedBorrowToken || !selectedCollateralToken || !selectedDuration || borrowAmount <= 0) {
            await MySwal.fire({
                title: 'Error!',
                text: 'Please select a borrow token, collateral token, and enter a valid amount.',
                icon: 'error',
                confirmButtonText: 'Close',
            });
            return;
        }

        setIsBorrowing(true);
        try {
            const result = await handleBorrowAmounts(borrowAmount);
            setBorrowAmount(result.amount);
            await MySwal.fire({
                title: 'Borrow Successfully!',
                html: `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <img src="${selectedBorrowToken.image}" alt="${selectedBorrowToken.label}" style="border-radius: 50%; width: 20%; height: 20%; margin-right: 10px;">
                    <span style="text-align: start"><strong>${selectedBorrowToken.label}</strong> with amount <strong>$${borrowAmount}</strong> & Duration ends <strong>${selectedDuration.label}</strong></span>
                </div>
            `,
                icon: 'success',
                confirmButtonText: 'Close',
            });
        } catch (error) {
            await MySwal.fire({
                title: 'Error!',
                text: 'There was a problem with the borrow.',
                icon: 'error',
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
                    handleOnChange={setSelectedBorrowToken}
                    handleValue={selectedBorrowToken}
                    className="border-none hover:border-0 w-full px-0 py-2"
                />
                <input
                    type="tel"
                    value={borrowAmount || ''}
                    onChange={(e) => setBorrowAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                />
            </div>
            <div className="w-full p-2">
                <CustomSelectSearch
                    placeholder='Choose Durations'
                    tokenOptions={durationList}
                    handleOnChange={setSelectedDuration}
                    handleValue={selectedDuration}
                    className="border-none hover:border-0 w-full px-0 py-2"
                />
            </div>
            <div className="w-full p-2">
                <CustomSelectSearch
                    placeholder='Choose Pool'
                    tokenOptions={poolOptions} 
                    handleOnChange={handlePoolChange}
                    handleValue={selectedPool ? { value: selectedPool, label: `Pool ${selectedPool}` } : null}
                    className="border-none hover:border-0 w-full px-0 py-2"
                />
            </div>
            <div className="w-full p-2">
                <CustomSelectSearch
                    placeholder='Choose Collateral Token'
                    tokenOptions={collateralOptions}
                    handleOnChange={setSelectedCollateralToken}
                    handleValue={selectedCollateralToken}
                    className="border-none hover:border-0 w-full px-0 py-2"
                />
            </div>
            <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
                <button
                    className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
                    onClick={onBorrowTokens}
                    disabled={isBorrowing}
                >
                    {isBorrowing ? 'Borrowing...' : 'Borrow'} <MdOutlineArrowOutward />
                </button>
            </div>
        </div>
    );
};

export default BorrowTokens;
