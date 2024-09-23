import React, { useState } from 'react';
import { Button } from '../ui/moving-border';

interface WithdrawLiquidityModalProps {
  open: boolean;
  onClose: () => void;
  liquidityToken: { 
    address: string; 
  } | null; 
  tokenA: { image: string } | null; 
  tokenB: { image: string } | null; 
}

const WithdrawLiquidityModal: React.FC<WithdrawLiquidityModalProps> = ({
  open,
  onClose,
  liquidityToken,
  tokenA,
  tokenB,
}) => {
  const [amount, setAmount] = useState<number>(0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-[#141414] p-6 rounded-xl max-w-lg w-full h-auto overflow-auto">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">Withdraw Liquidity</h2>
        <form>
          <div className="mb-4">
            <p className="text-gray-500 text-md uppercase">Your Liquidity Balance:</p>
            <p className="text-white text-lg mb-2">
              {liquidityToken ? `${liquidityTokenAddress} ${liquidityToken.label}` : 'N/A'}
            </p>

            {liquidityToken && (
              <div className="flex items-center mb-4">
                <img src={liquidityToken.image} alt={liquidityToken.label} className="w-8 h-8 mr-2" />
                <span className="text-white text-lg">{liquidityToken.label}</span>
              </div>
            )}

            {liquidityToken && (
              <p className="text-gray-500 text-md uppercase">Liquidity Token Address:</p>
            )}
            <p className="text-white text-lg mb-2">
              {liquidityToken ? liquidityTokenAddress : 'N/A'}
            </p>

            <div className="flex items-center mb-4">
              {tokenA && (
                <img src={tokenA.image} alt="Token A" className="w-8 h-8 mr-2" />
              )}
              {tokenB && (
                <img src={tokenB.image} alt="Token B" className="w-8 h-8 mr-2" />
              )}
            </div>

            <input 
              type="number" 
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder={`Amount to withdraw`}
              className="border border-gray-600 bg-transparent text-white p-2 rounded-xl w-full mt-2 focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div className="flex justify-between mt-6">
            <Button 
              type="button" 
              onClick={onClose} 
              className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700"
            >
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawLiquidityModal;
