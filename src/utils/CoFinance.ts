import { ethers } from 'ethers';
import { getAllPools} from './Factory'

const COFINANCE_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenA",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenB",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_rewardToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_priceFeed",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_liquidityToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_stakingContract",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "_isPoolIncentivized",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "_factory",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			}
		],
		"name": "AddressEmptyCode",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "AddressInsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			}
		],
		"name": "borrowTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "depositCollateral",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FailedInnerCall",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "depositor",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CollateralDeposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "collateralAmount",
				"type": "uint256"
			}
		],
		"name": "CollateralLiquidated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "withdrawer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CollateralWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "claimer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "InterestFeeClaimed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			}
		],
		"name": "liquidateLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenBAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "liquidityTokensMinted",
				"type": "uint256"
			}
		],
		"name": "LiquidityProvided",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LiquidityTokensSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LoanRepaid",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenAAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenBAmount",
				"type": "uint256"
			}
		],
		"name": "provideLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "repayLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "claimer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "SwapFeeClaimed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			}
		],
		"name": "swapTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			}
		],
		"name": "TokensBorrowed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "swapper",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenBAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "feeAmount",
				"type": "uint256"
			}
		],
		"name": "TokensSwapped",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newShare",
				"type": "uint256"
			}
		],
		"name": "updateOwnerShare",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "updateSwapFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawCollateral",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "liquidityTokenAmount",
				"type": "uint256"
			}
		],
		"name": "withdrawLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "exiter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenBAmount",
				"type": "uint256"
			}
		],
		"name": "WithdrawLiquidity",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "borrowed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "borrowedToken",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "collateralA",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "collateralB",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "factory",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBorrowedAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCollateralAmounts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getReserves",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "reserveA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reserveB",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "INTEREST_RATE_30_DAYS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "INTEREST_RATE_90_DAYS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isLiquidityProvider",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isPoolIncentivized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "liquidityProviders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "liquidityToken",
		"outputs": [
			{
				"internalType": "contract ILiquidityToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "loanDuration",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "loanStartTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ownerSharePercent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			}
		],
		"name": "previewSwap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "outputAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "feeAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "priceFeed",
		"outputs": [
			{
				"internalType": "contract IPriceFeed",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SECONDS_IN_30_DAYS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SECONDS_IN_90_DAYS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stakingContract",
		"outputs": [
			{
				"internalType": "contract Staking",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapFeePercent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenA",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenB",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalCollateralA",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalCollateralB",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalLiquidity",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSwapFeesA",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSwapFeesB",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userAccumulatedFeesA",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userAccumulatedFeesB",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userInterestFees",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userLiquidityBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export const getTotalLiquidity = async (provider: ethers.BrowserProvider, poolAddress: string): Promise<{ totalA: string, totalB: string }> => {
    try {
        const contract = new ethers.Contract(poolAddress, COFINANCE_ABI, provider);
        const [totalA, totalB]: [ethers.BigNumber, ethers.BigNumber] = await contract.getReserves();
        return {
            totalA: ethers.formatUnits(totalA),
            totalB: ethers.formatUnits(totalB)
        };
    } catch (error) {
        console.error('Error getting total liquidity:', error);
        throw error;
    }
};
  
  export const depositIncentive = async (provider: ethers.BrowserProvider, amount: string): Promise<void> => {
    try {
      const coFinanceAddress = await getAllPools(provider);
      const signer: Signer = provider.getSigner();
      const contractWithSigner = new ethers.Contract(coFinanceAddress, COFINANCE_ABI, signer);
      const tx = await contractWithSigner.depositIncentive(ethers.parseUnits(amount));
      await tx.wait();
      console.log('Incentive deposited:', amount);
    } catch (error) {
      console.error('Error depositing incentive:', error);
      throw error;
    }
  };
  
  export const swapTokens = async (
    provider: ethers.BrowserProvider,
    poolAddress: string,
    tokenAddress: string,
    tokenAmount: string
	): Promise<void> => {
    try {
        const signer = await provider.getSigner();
        const contractWithSigner = new ethers.Contract(poolAddress, COFINANCE_ABI, signer);
        console.log(poolAddress);

        const amount = ethers.parseUnits(tokenAmount, 18); 
        const tx = await contractWithSigner.swapTokens(tokenAddress, amount); 
        await tx.wait();
        console.log('Swap provided:', tokenAddress, amount);
    } catch (error) {
        console.error('Error providing Swap:', error);
        throw error; 
    }
};


  export const previewSwap = async (
	provider: ethers.BrowserProvider,
	poolAddress: string, 
	tokenAddress: string,
	tokenAmount: string
  ): Promise<{ outputAmount: string, feeAmount: string }> => {
	try {
	  const contract = new ethers.Contract(poolAddress, COFINANCE_ABI, provider);
	  const [outputAmount, feeAmount] = await contract.previewSwap(tokenAddress, ethers.parseUnits(tokenAmount));
	  return {
		outputAmount: ethers.formatUnits(outputAmount),
		feeAmount: ethers.formatUnits(feeAmount),
	  };
	} catch (error) {
	  console.error('Error previewing swap:', error);
	  throw error;
	}
  };
  
  export const depositCollateral = async (provider: ethers.BrowserProvider, poolAddress: string, tokenAddress: string, tokenAmount: string): Promise<void> => {
    try {
        const signer = await provider.getSigner(); 
        const contractWithSigner = new ethers.Contract(poolAddress, COFINANCE_ABI, signer);
        const amountInUnits = ethers.parseUnits(tokenAmount, 18);
        const tx = await contractWithSigner.depositCollateral(tokenAddress, amountInUnits);
        await tx.wait();
        console.log('Collateral deposited:', tokenAddress, tokenAmount);
    } catch (error) {
        console.error('Error depositing collateral:', error);
        throw error; 
    }
	};

  
  export const withdrawCollateral = async (provider: ethers.BrowserProvider, amount: string): Promise<void> => {
    try {
      const coFinanceAddress = await getAllPools(provider);
      const signer: Signer = provider.getSigner();
      const contractWithSigner = new ethers.Contract(coFinanceAddress, COFINANCE_ABI, signer);
      const tx = await contractWithSigner.withdrawCollateral(ethers.parseUnits(amount));
      await tx.wait();
      console.log('Collateral withdrawn:', amount);
    } catch (error) {
      console.error('Error withdrawing collateral:', error);
      throw error;
    }
  };
  
  export const borrowTokens = async (provider: ethers.BrowserProvider, poolAddress: string, amount: string, tokenAddress: string, duration: number): Promise<void> => {
    try {
        const signer = await provider.getSigner();
        const contractWithSigner = new ethers.Contract(poolAddress, COFINANCE_ABI, signer);
        const formattedAmount = ethers.parseUnits(amount, 18);
        const tx = await contractWithSigner.borrowTokens(
            formattedAmount,
            tokenAddress,
            duration
        );
        await tx.wait();
        console.log('Tokens borrowed:', amount, tokenAddress, duration);
    } catch (error) {
        console.error('Error borrowing tokens:', error);
        throw error;
    }
};

  
  export const provideLiquidity = async (
	provider: ethers.BrowserProvider,
	poolAddress: string,
	tokenAAmount: string,
	tokenBAmount: string
  ): Promise<void> => {
	try {
	  const signer = await provider.getSigner();
	  const contractWithSigner = new ethers.Contract(poolAddress, COFINANCE_ABI, signer);
  	  const parsedTokenAAmount = ethers.parseUnits(tokenAAmount, 18); 
	  const parsedTokenBAmount = ethers.parseUnits(tokenBAmount, 18); 
  	  const tx = await contractWithSigner.provideLiquidity(parsedTokenAAmount, parsedTokenBAmount);
	  await tx.wait();
	  console.log('Liquidity provided:', tokenAAmount, tokenBAmount);
	} catch (error) {
	  console.error('Error providing liquidity:', error);
	  throw error; 
	}
  };
  
  export const withdrawLiquidity = async (
	provider: ethers.BrowserProvider,
	poolAddress: string,
	liquidityTokenAmount: string
  ): Promise<void> => {
	try {
	  const signer = await provider.getSigner();
	  const contractWithSigner = new ethers.Contract(poolAddress, COFINANCE_ABI, signer);
	  const parsedLiquidityTokenAmount = ethers.parseUnits(liquidityTokenAmount, 18); 
	  const tx = await contractWithSigner.withdrawLiquidity(parsedLiquidityTokenAmount);
	  await tx.wait();
	  console.log('Liquidity withdrawn:', liquidityTokenAmount);
	} catch (error) {
	  console.error('Error withdrawing liquidity:', error);
	  throw error;
	}
  };
  
  export const repayLoan = async (provider: ethers.BrowserProvider, amount: string): Promise<void> => {
    try {
      const coFinanceAddress = await getAllPools(provider);
      const signer: Signer = provider.getSigner();
      const contractWithSigner = new ethers.Contract(coFinanceAddress, COFINANCE_ABI, signer);
      const tx = await contractWithSigner.repayLoan(ethers.parseUnits(amount));
      await tx.wait();
      console.log('Loan repaid:', amount);
    } catch (error) {
      console.error('Error repaying loan:', error);
      throw error;
    }
  };
  
  export const withdrawSwapFee = async (provider: ethers.BrowserProvider): Promise<void> => {
    try {
      const coFinanceAddress = await getAllPools(provider);
      const signer: Signer = provider.getSigner();
      const contractWithSigner = new ethers.Contract(coFinanceAddress, COFINANCE_ABI, signer);
      const tx = await contractWithSigner.withdrawSwapFee();
      await tx.wait();
      console.log('Swap fee withdrawn');
    } catch (error) {
      console.error('Error withdrawing swap fee:', error);
      throw error;
    }
  };
  
  export const withdrawInterestFee = async (provider: ethers.BrowserProvider): Promise<void> => {
    try {
      const coFinanceAddress = await getAllPools(provider);
      const signer: Signer = provider.getSigner();
      const contractWithSigner = new ethers.Contract(coFinanceAddress, COFINANCE_ABI, signer);
      const tx = await contractWithSigner.withdrawInterestFee();
      await tx.wait();
      console.log('Interest fee withdrawn');
    } catch (error) {
      console.error('Error withdrawing interest fee:', error);
      throw error;
    }
  };

  export const getTokenAddresses = async (provider: ethers.BrowserProvider, poolAddress: string): Promise<{
      collateralTokenAddress: SetStateAction<string | null>;
      borrowTokenAddress: SetStateAction<string | null>; tokenA: string, tokenB: string 
}> => {
    try {
        const contract = new ethers.Contract(poolAddress, COFINANCE_ABI, provider);
        const tokenA = await contract.tokenA();
        const tokenB = await contract.tokenB();
        return { tokenA, tokenB };
    } catch (error) {
        console.error('Error getting token addresses:', error);
        throw error;
    }
  };

  export const getUserCollateralBalances = async (provider: ethers.BrowserProvider, account: string): Promise<{ [poolAddress: string]: { collateralA: string, collateralB: string } }> => {
    try {
        const pools = await getAllPools(provider);
        const collateralBalances: { [poolAddress: string]: { collateralA: string, collateralB: string } } = {};

        for (const poolAddress of pools) {
            const contract = new ethers.Contract(poolAddress, COFINANCE_ABI, provider);
            const collateralABalance = await contract.collateralA(account); 
            const collateralBBalance = await contract.collateralB(account);
            
            collateralBalances[poolAddress] = {
                collateralA: ethers.formatUnits(collateralABalance, 18),
                collateralB: ethers.formatUnits(collateralBBalance, 18),
            }; 
        }

        return collateralBalances;
    } catch (error) {
        console.error('Error fetching user collateral balances:', error);
        throw error;
    }
  };

  export const getCollateral = async (provider: ethers.BrowserProvider, account: string, poolAddress: string): Promise<{ collateralA: string, collateralB: string }> => {
	try {
		const contract = new ethers.Contract(poolAddress, COFINANCE_ABI, provider);
		const collateralABalance = await contract.collateralA(account); 
		const collateralBBalance = await contract.collateralB(account);
		
		return {
			collateralA: ethers.formatUnits(collateralABalance, 18),
			collateralB: ethers.formatUnits(collateralBBalance, 18),
		}; 
	} catch (error) {
		console.error('Error fetching user collateral balances:', error);
		throw error;
	}
  };	

  export const getLiquidityToken = async (provider: ethers.BrowserProvider, poolAddress: string): Promise<{ liquidityToken: string }> => {
    try {
        const contract = new ethers.Contract(poolAddress, COFINANCE_ABI, provider);
        const liquidityToken = await contract.liquidityToken();
        return  liquidityToken ;
    } catch (error) {
        console.error('Error getting token addresses:', error);
        throw error;
    }
  };

  export const getStakingContract = async (provider: ethers.BrowserProvider, poolAddress: string): Promise<{ stakingContract: string }> => {
    try {
        const contract = new ethers.Contract(poolAddress, COFINANCE_ABI, provider);
        const stakingContract = await contract.stakingContract();
        return  stakingContract ;
    } catch (error) {
        console.error('Error getting token addresses:', error);
        throw error;
    }
  };