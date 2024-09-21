import React, { useState } from 'react';
import { MdOutlineArrowOutward } from 'react-icons/md';
import tokens from '@/data/token.json';
import durationsData from '@/data/durations.json';
import CustomSelectSearch from '@/components/CustomSelectSearch';
import { ImageSelect } from '@/types/ImageSelect';
import { SelectList } from '@/types/SelectList';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-dark/dark.css'; // Import the dark theme

const MySwal = withReactContent(Swal);

interface CollateralProps {
    tokenOptions?: ImageSelect[];
    durationOptions?: SelectList[];
    handleBorrowAmounts: (amount: number) => Promise<{ amount: number }>;
}

const BorrowTokens: React.FC<CollateralProps> = ({ tokenOptions = [], durationOptions = [], handleBorrowAmounts }) => {
    const [selectedBorrowToken, setSelectedBorrowToken] = useState<ImageSelect | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<SelectList | null>(null);
    const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
    const [borrowAmount, setBorrowAmount] = useState<number>(0);

    const defaultTokenOptions = tokenOptions.length > 0 ? tokenOptions : tokens.tokens.map(token => ({
        value: token.address,
        label: token.name,
        image: token.image,
    }));

    const durationList = durationOptions.length > 0 ? durationOptions : durationsData.durations.map(item => ({
        value: String(item.value),  // Convert number to string
        label: item.label,
    }));

    const onBorrowTokens = async () => {
        if (!selectedBorrowToken || !selectedDuration || borrowAmount <= 0) {
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

        setIsBorrowing(true);
        try {
            const result = await handleBorrowAmounts(borrowAmount);
            setBorrowAmount(result.amount);
            await MySwal.fire({
                title: 'Deposit Successfully!',
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
            setIsBorrowing(false);
        }
    };

    const handleOnChangeToken = (selectedOption: ImageSelect | SelectList | null) => {
        // Depending on the list type, handle the token selection
        if (selectedOption && 'image' in selectedOption) {
            setSelectedBorrowToken(selectedOption as ImageSelect);
        } else {
            setSelectedBorrowToken(null); // Reset if no image is found
        }
    };

    const handleOnChangeDuration = (selectedOption: SelectList | null) => {
        setSelectedDuration(selectedOption);
    };

    return (
        <div className='space-y-4 py-4 h-full'>
            <div className="flex items-center justify-between w-full space-x-2 bg-transparent rounded-2xl rounded-tr-2xl px-4 py-2">
                <CustomSelectSearch
                    placeholder='Choose Tokens'
                    tokenOptions={defaultTokenOptions}
                    handleOnChange={handleOnChangeToken}
                    handleValue={selectedBorrowToken} // Pass the full TokenOption object
                    className="border-none hover:border-0  w-full px-0 py-2"
                />
                <input
                    type="number"
                    value={borrowAmount || ''}
                    onChange={(e) => setBorrowAmount(parseFloat(e.target.value) || 0)} // Ensure valid number
                    placeholder="0"
                    className="text-right w-full rounded-xl p-5 text-3xl bg-transparent focus:border-0 text-white placeholder:text-gray-600"
                />
            </div>
            <div className="w-full p-2">
                <CustomSelectSearch
                    placeholder='Choose Durations'
                    tokenOptions={durationList}
                    handleOnChange={handleOnChangeDuration}
                    handleValue={selectedDuration} // Pass the full TokenOption object
                    className="border-none hover:border-0  w-full px-0 py-2"
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
