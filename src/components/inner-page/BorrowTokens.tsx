import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import { SelectList } from '@/types/SelectList';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ethers } from 'ethers';
import { getCollateral, getTokenAddresses, borrowTokens } from '../../utils/CoFinance';
import { getTokenBalance } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory';
import '@sweetalert2/theme-dark/dark.css';
import { FaMoneyBill, FaMoneyCheck } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const SECONDS_IN_30_DAYS = 30 * 24 * 60 * 60;
const SECONDS_IN_90_DAYS = 90 * 24 * 60 * 60;

interface CollateralProps {
    tokenOptions?: ImageSelect[];
    handleBorrowAmounts: (amount: number) => Promise<{ amount: number }>;
}

const BorrowTokens: React.FC<CollateralProps> = ({
    tokenOptions = [],
    handleBorrowAmounts,
}) => {
    const [selectedBorrowToken, setSelectedBorrowToken] = useState<ImageSelect | null>(null);
    const [selectedCollateralToken, setSelectedCollateralToken] = useState<ImageSelect | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<SelectList | null>(null);
    const [selectedPool, setSelectedPool] = useState<string | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
    const [borrowAmount, setBorrowAmount] = useState<number>(0);
    const [userCollateralBalances, setUserCollateralBalances] = useState<{ [key: string]: string } | null>(null);
    const [userBorrowTokenBalance, setUserBorrowTokenBalance] = useState<string>('0');
    const [loading, setLoading] = useState<boolean>(false);
    const providerRef = useRef<ethers.BrowserProvider | null>(null);
    const [borrowTokenAddress, setBorrowTokenAddress] = useState<string | null>(null);
    const [collateralTokenAddress, setCollateralTokenAddress] = useState<string | null>(null);

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        label: token.name,
        image: token.image,
    }));

    const durationList = [
        { value: String(SECONDS_IN_30_DAYS), label: '30 Days' },
        { value: String(SECONDS_IN_90_DAYS), label: '90 Days' },
    ];

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

    const fetchPoolAddress = async () => {
        if (!providerRef.current || !selectedBorrowToken || !selectedCollateralToken) return;
        const poolAddress = await getPoolByPairs(providerRef.current, selectedBorrowToken.value, selectedCollateralToken.value);
        setSelectedPool(poolAddress || null);

        if (poolAddress) {
            try {
                const addresses = await getTokenAddresses(providerRef.current, poolAddress);
                console.log("Addresses : " + JSON.stringify(addresses));
                setBorrowTokenAddress(selectedBorrowToken.value);
                setCollateralTokenAddress(selectedCollateralToken.value);
                console.log("Collateral Selected : " + collateralTokenAddress);
                const balances = await getCollateral(providerRef.current, account, poolAddress);
                console.log(balances);
                const collateralA = balances.collateralA || '0';
                const collateralB = balances.collateralB || '0';
                console.log('Collateral A:', collateralA);
                console.log('Collateral B:', collateralB);
                if (collateralTokenAddress?.toLowerCase() === addresses.tokenA.toLowerCase()) {
                    setUserCollateralBalances({ [selectedCollateralToken.label]: collateralA });
                } else {
                    setUserCollateralBalances({ [selectedCollateralToken.label]: collateralB });
                }
            } catch (error) {
                console.error('Error fetching collateral balances:', error);
            }
        }

    };

    useEffect(() => {
        fetchPoolAddress();
    }, [selectedBorrowToken, selectedCollateralToken]);

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

    const handleTokenSelection = (setToken: React.Dispatch<React.SetStateAction<ImageSelect | null>>, selectedToken: ImageSelect | null) => {
        setToken(selectedToken);
        if (setToken === setSelectedCollateralToken) {
            fetchPoolAddress();
        }
    };

    const onBorrowTokens = async () => {
        if (!selectedBorrowToken || !selectedCollateralToken || !selectedDuration || borrowAmount <= 0 || !selectedPool) {
            await MySwal.fire({
                title: 'Error!',
                text: 'Please select a borrow token, collateral token, and enter a valid amount.',
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

        setIsBorrowing(true);
        try {
            console.log("Borrowing tokens with the following parameters:");
            console.log("Pool Address:", selectedPool);
            console.log("Borrow Amount:", borrowAmount);
            console.log("Borrow Token Address:", selectedBorrowToken.value);
            console.log("Duration (in seconds):", selectedDuration.value);

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
                    cancelButton: 'my-custom-cancel-button',
                },
                confirmButtonText: 'Close',
            });
            fetchBorrowTokenBalance(account);
        } catch (error) {
            console.error('Error during borrowing:', error);
            await MySwal.fire({
                title: 'Error!',
                text: 'There was a problem with the borrow: ' + (error.message || error),
                icon: 'error',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                    cancelButton: 'my-custom-cancel-button',
                },
                confirmButtonText: 'Close',
            });
        } finally {
            setIsBorrowing(false);
        }
    };

    return (
        <div className='space-y-4 py-4 h-96'>
            {selectedPool && userCollateralBalances && selectedCollateralToken && (
            <div role="alert" className="alert shadow-lg">
                <FaMoneyCheck />
                <div>
                    <h3 className="font-bold">Available Colateral</h3>
                    <div className="text-xs">{selectedCollateralToken?.label}</div>
                </div>
                <button className="btn btn-sm">{selectedCollateralToken ? userCollateralBalances?.[selectedCollateralToken.label] || 0 : 0}</button>
            </div>
            )}
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
                    <input type="range" min={0} max={selectedCollateralToken ? userCollateralBalances?.[selectedCollateralToken.label] || 0 : 0} value={borrowAmount || ''}
                        onChange={(e) => setBorrowAmount(parseFloat(e.target.value) || 0)}
                        className="custom-slider" />
                </div>
            </div>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    placeholder='Choose Collateral Token'
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={(token) => handleTokenSelection(setSelectedCollateralToken, token)}
                    handleValue={selectedCollateralToken}
                    className="border-none hover:border-0 w-full px-0 py-2"
                />
                <CustomSelectSearch
                    placeholder='Choose Durations'
                    tokenOptions={durationList}
                    handleOnChange={setSelectedDuration}
                    handleValue={selectedDuration}
                    className="border-none hover:border-0"
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