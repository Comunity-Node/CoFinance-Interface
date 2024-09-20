import React, { useState } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { TokenOption } from '@/types/TokenOption';
import Modal from '@/components/Modal';

interface CollateralProps {
    tokenOptions?: TokenOption[];
    handleDepositCollateral: (amount: number) => Promise<{ amount: number }>;
}

const Collateral: React.FC<CollateralProps> = ({ tokenOptions = [], handleDepositCollateral }) => {
    const [selectedDepositToken, setSelectedDepositToken] = useState<TokenOption | null>(null);
    const [isDepositing, setIsDepositing] = useState<boolean>(false);
    const [collateralAmount, setCollateralAmount] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for Modal

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        name: token.name,
        image: token.image,
    }));

    const onDepositCollateral = async () => {
        // Ensure the token is selected and the amount is greater than 0
        if (!selectedDepositToken || collateralAmount <= 0) {
            alert("Please select a token and enter a valid amount.");
            return;
        }

        setIsDepositing(true);
        try {
            const result = await handleDepositCollateral(collateralAmount);
            setCollateralAmount(result.amount);
            alert(`Deposit is Successfully with amount ${collateralAmount}`);
            return;
        } finally {
            setIsDepositing(false);
        }
    };

    const handleOnChange = (selectedOption: TokenOption | null) => {
        setSelectedDepositToken(selectedOption);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close modal when user clicks close
    };

    return (
        <div className='space-y-4 py-4 h-full'>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={handleOnChange}
                    handleValue={selectedDepositToken}
                    className="border-none hover:border-0"
                />
                <input
                    type="number"
                    value={collateralAmount || ''}
                    onChange={(e) => setCollateralAmount(parseFloat(e.target.value))}
                    placeholder="0"
                    className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                />
            </div>
            <div className="w-full text-end rounded-lg p-1 bg-[#bdc3c7]">
                <button
                    className="btn border-0 font-thin text-lg bg-transparent hover:bg-transparent text-gray-950 w-full"
                    onClick={onDepositCollateral}
                    disabled={isDepositing} // Disable button while depositing
                >
                    {isDepositing ? (
                        <div className="flex items-center justify-center w-full">
                            <span className="loading loading-bars loading-sm"></span>
                        </div>
                    ) : (
                        <>
                            Deposit <MdOutlineArrowOutward />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Collateral;
