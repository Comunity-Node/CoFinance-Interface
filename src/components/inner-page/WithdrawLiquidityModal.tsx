import React, { useState, useEffect, useRef } from 'react';
import { ImageSelect } from '@/types/ImageSelect';
import { ethers } from 'ethers';
import { getTokenBalance, approveToken } from '../../utils/TokenUtils';
import { getPoolByPairs } from '../../utils/Factory'; 
import { withdrawLiquidity, getLiquidityToken } from '../../utils/CoFinance'; 

interface WithdrawLiquidityModalProps {
  open: boolean;
  onClose: () => void;
  tokenA: ImageSelect | null;
  tokenB: ImageSelect | null;
}

const WithdrawLiquidityModal: React.FC<WithdrawLiquidityModalProps> = ({ open, onClose, tokenA, tokenB }) => {
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<string>('0');
  const [poolAddressFromAPI, setPoolAddressFromAPI] = useState<string | null>(null);
  const [liquidityToken, setLiquidityToken] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [loadingApproval, setLoadingApproval] = useState<boolean>(false);
  const providerRef = useRef<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    const loadAccountAndPools = async () => {
      setLoading(true);
      try {
        if (!window.ethereum) return;
        if (!providerRef.current) {
          providerRef.current = new ethers.BrowserProvider(window.ethereum);
        }
        const signer = await providerRef.current.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        console.log("Connected Account:", accountAddress);
        const poolAddress = await getPoolByPairs(providerRef.current, tokenA.value, tokenB.value);
        setPoolAddressFromAPI(poolAddress);
        if (poolAddress) {
          const liquidityTokenAddress = await getLiquidityToken(providerRef.current, poolAddress);
          setLiquidityToken(liquidityTokenAddress);
        }
      } catch (error) {
        console.error('Error loading account and pools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountAndPools();
  }, [tokenA, tokenB]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!providerRef.current || !account || !liquidityToken) return;
      const balance = await getTokenBalance(providerRef.current, liquidityToken, account);
      setBalance(balance);
    };

    fetchBalances();
  }, [liquidityToken, account]);

  const handleConfirm = async () => {
    if (!account || !liquidityToken || !providerRef.current) return;

    setLoadingApproval(true);
    try {
      // Approve the liquidity withdrawal
      await approveToken(providerRef.current, liquidityToken, poolAddressFromAPI, amount.toString());
      alert(`Successfully approved withdrawal of ${amount} tokens.`);

      // Sign the transaction
      const signer = await providerRef.current.getSigner();
      const message = `I confirm the withdrawal of ${amount} tokens from the liquidity pool.`;
      const signature = await signer.signMessage(message);
      console.log("User signature:", signature); // Optionally log the signature

      // Withdraw liquidity after approval
      await withdrawLiquidity(providerRef.current, poolAddressFromAPI, amount.toString());
      console.log("Liquidity withdrawn successfully:", amount);
      alert(`Successfully withdrew liquidity: ${amount} from the pool`);
      onClose(); 
    } catch (error) {
      console.error('Error during approval or withdrawal:', error);
    } finally {
      setLoadingApproval(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-[#141414] p-6 rounded-xl max-w-lg w-full h-auto overflow-auto">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">Withdraw Liquidity</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
          <div className="mb-4">
            <p className="text-gray-500 text-md uppercase">Liquidity Token:</p>
            <p className="text-gray-300">Available Liquidity: {balance}</p>
            <input 
              type="number" 
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder={`Amount to withdraw`}
              className="border border-gray-600 bg-transparent text-white p-2 rounded-xl w-full mt-2 focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div className="flex justify-between mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 ${loadingApproval ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loadingApproval}
            >
              {loadingApproval ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawLiquidityModal;
