import React, { useState } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { TokenOption } from '@/types/TokenOption'; // Ensure this path is correct

interface CollateralProps {
    tokenOptions?: TokenOption[];
    handleDepositCollateral: (token: string, amount: number) => Promise<{ deposited: number; amount: number }>;
}

const BorrowTokens: React.FC<CollateralProps> = ({ tokenOptions = [], handleDepositCollateral }) => {
    const [selectedDepositToken, setSelectedDepositToken] = useState<TokenOption | null>(null);
    const [depositCollateral, setDepositCollateral] = useState<number>(0);
    const [isDepositing, setIsDepositing] = useState<boolean>(false);
    const [depositedCollateral, setDepositedCollateral] = useState<number>(0);
    const [collateralAmount, setCollateralAmount] = useState<number>(0);

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        name: token.name,
        image: token.image,
    }));

    const onDepositCollateral = async () => {
        if (!selectedDepositToken) return;

        setIsDepositing(true);
        try {
            const result = await handleDepositCollateral(selectedDepositToken.value, depositCollateral);
            setDepositedCollateral(result.deposited);
            setCollateralAmount(result.amount);
        } finally {
            setIsDepositing(false);
        }
    };

    const handleOnChange = (selectedOption: TokenOption | null) => {
        setSelectedDepositToken(selectedOption);
    };

    return (
        <div className='space-y-4 py-4 h-full'>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={handleOnChange}
                    handleValue={selectedDepositToken} // Pass the full TokenOption object
                    className="border-none hover:border-0"
                />
                <input
                    type="number"
                    value={depositCollateral || ''}
                    onChange={(e) => setDepositCollateral(parseFloat(e.target.value))}
                    placeholder="0"
                    className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                />
            </div>
            <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
                <button
                    className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
                    onClick={onDepositCollateral}
                    disabled={isDepositing || !selectedDepositToken || depositCollateral <= 0}
                >
                    {isDepositing ? 'Depositing...' : 'Deposit'} <MdOutlineArrowOutward />
                </button>
            </div>
            {/* {isDepositing && <SummaryBorrows depositedCollateral={depositedCollateral} collateralAmount={collateralAmount} />} */}
        </div>
    );
};

const SummaryBorrows: React.FC<{ depositedCollateral: number; collateralAmount: number }> = ({ depositedCollateral, collateralAmount }) => (
    <>
        <div className="flex items-center justify-center w-full">
            <span className="loading loading-bars loading-sm"></span>
        </div>
        <div className="rounded-xl border border-gray-300 px-3 py-5 my-5 space-y-3">
            <h3 className="text-xl text-gray-600 font-semibold">Collateral</h3>
            <div className="divider"></div>
            <div className="flex items-center justify-between">
                <p className="font-medium text-gray-500">Amount</p>
                <p className="font-bold text-black">{collateralAmount || '0'}</p>
            </div>
            <div className="flex items-center justify-between">
                <p className="font-medium text-gray-500">Deposit</p>
                <p className="font-bold text-black">{depositedCollateral.toFixed(2)}</p>
            </div>
        </div>
    </>
);

export default BorrowTokens;
