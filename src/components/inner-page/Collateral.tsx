import React, { useState } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-dark/dark.css'; // Import the dark theme

const MySwal = withReactContent(Swal);

interface CollateralProps {
    tokenOptions?: ImageSelect[];
    handleDepositCollateral: (amount: number) => Promise<{ amount: number }>;
}

const Collateral: React.FC<CollateralProps> = ({ tokenOptions = [], handleDepositCollateral }) => {
    const [selectedDepositToken, setSelectedDepositToken] = useState<ImageSelect | null>(null);
    const [isDepositing, setIsDepositing] = useState<boolean>(false);
    const [collateralAmount, setCollateralAmount] = useState<number>(0);

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        label: token.name,
        image: token.image,
    }));

    const onDepositCollateral = async () => {
        if (!selectedDepositToken || collateralAmount <= 0) {
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

        setIsDepositing(true);
        try {
            const result = await handleDepositCollateral(collateralAmount);
            setCollateralAmount(result.amount);
            await MySwal.fire({
                title: 'Deposit Successfully!',
                html: `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <img src="${selectedDepositToken.image}" alt="${selectedDepositToken.label}" style="border-radius: 50%; width: 5%; height: 5%; margin-right: 10px;">
                    <span><strong>${selectedDepositToken.label}</strong> with amount <strong>$${collateralAmount}</strong></span>
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
                text: 'There was a problem with the deposit.',
                icon: 'error',
                customClass: {
                    popup: 'my-custom-popup',
                    confirmButton: 'my-custom-confirm-button',
                    cancelButton: 'my-custom-cancel-button',
                },
                confirmButtonText: 'Close',
            });
        } finally {
            setIsDepositing(false);
        }
    };

    return (
        <div className='space-y-4 py-4 h-full'>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={setSelectedDepositToken}
                    handleValue={selectedDepositToken}
                    className="border-none hover:border-0"
                    placeholder="Select token"
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
                    disabled={isDepositing}
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
            {/* Modal code can be removed if not needed */}
        </div>
    );
};

export default Collateral;
