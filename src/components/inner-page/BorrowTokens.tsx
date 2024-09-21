import React, { useState } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { TokenOption } from '@/types/TokenOption';

interface BorrowTokensProps {
    tokenOptions?: TokenOption[];
    handleBorrowTokens: (token: string, amount: number) => Promise<{ borrowed: number; amount: number }>;
}

const BorrowTokens: React.FC<BorrowTokensProps> = ({ tokenOptions = [], handleBorrowTokens }) => {
    const [selectedBorrowToken, setSelectedBorrowToken] = useState<TokenOption | null>(null);
    const [borrowAmount, setBorrowAmount] = useState<number>(0);
    const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
    const [borrowedAmount, setBorrowedAmount] = useState<number>(0);
    const [totalBorrowed, setTotalBorrowed] = useState<number>(0);

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        name: token.name,
        image: token.image,
    }));

    const onBorrowTokens = async () => {
        if (!selectedBorrowToken || borrowAmount <= 0) return;

        setIsBorrowing(true);
        try {
            const result = await handleBorrowTokens(selectedBorrowToken.value, borrowAmount);
            setBorrowedAmount(result.borrowed);
            setTotalBorrowed(result.amount);
        } finally {
            setIsBorrowing(false);
        }
    };

    const handleOnChange = (selectedOption: TokenOption | null) => {
        setSelectedBorrowToken(selectedOption);
    };

    return (
        <div className='space-y-4 py-4 h-full'>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={handleOnChange}
                    handleValue={selectedBorrowToken}
                    className="border-none hover:border-0"
                />
                <input
                    type="number"
                    value={borrowAmount || ''}
                    onChange={(e) => setBorrowAmount(parseFloat(e.target.value))}
                    placeholder="0"
                    className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                />
            </div>
            <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
                <button
                    className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
                    onClick={onBorrowTokens}
                    disabled={isBorrowing || !selectedBorrowToken || borrowAmount <= 0}
                >
                    {isBorrowing ? 'Borrowing...' : 'Borrow'} <MdOutlineArrowOutward />
                </button>
            </div>
            {/* Add a summary of borrowed tokens if necessary */}
            {borrowedAmount > 0 && <SummaryBorrows borrowedAmount={borrowedAmount} totalBorrowed={totalBorrowed} />}
        </div>
    );
};

const SummaryBorrows: React.FC<{ borrowedAmount: number; totalBorrowed: number }> = ({ borrowedAmount, totalBorrowed }) => (
    <div className="rounded-xl border border-gray-300 px-3 py-5 my-5 space-y-3">
        <h3 className="text-xl text-gray-600 font-semibold">Borrowed Tokens</h3>
        <div className="divider"></div>
        <div className="flex items-center justify-between">
            <p className="font-medium text-gray-500">Amount Borrowed</p>
            <p className="font-bold text-black">{borrowedAmount.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between">
            <p className="font-medium text-gray-500">Total Borrowed</p>
            <p className="font-bold text-black">{totalBorrowed.toFixed(2)}</p>
        </div>
    </div>
);

export default BorrowTokens;
