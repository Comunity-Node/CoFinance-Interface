import { ethers } from 'ethers';

const COFINANCE_FACTORY_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenA",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenB",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "rewardToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "priceFeed",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "liquidityTokenName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "liquidityTokenSymbol",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isPoolIncentivized",
				"type": "bool"
			}
		],
		"name": "createPool",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "CreationFeeUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FeesWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "poolAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenA",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenB",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "liquidityTokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "rewardToken",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "priceFeed",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "stakingContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isPoolIncentivized",
				"type": "bool"
			}
		],
		"name": "PoolCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "poolAddress",
				"type": "address"
			}
		],
		"name": "PoolIncentivized",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "updateCreationFee",
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
			}
		],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "allPools",
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
		"name": "creationFee",
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
		"name": "getAllPools",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getIncentivizedPools",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenA",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenB",
				"type": "address"
			}
		],
		"name": "getPoolByPair",
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
				"name": "token",
				"type": "address"
			}
		],
		"name": "getPoolByToken",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
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
		"name": "incentivizedPools",
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
		"name": "incentivizedPoolsList",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "pools",
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
		"name": "thisAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// const COFINANCE_FACTORY_ADDRESS = '0xee2bf3Aa042C3915190EB9bf50B9EF5ae89565A9'; 
const COFINANCE_FACTORY_ADDRESS = '0x2A322216AC69Ecb5341D02E826f4708089B83d9b'; 

export const createPool = async (
  provider: ethers.BrowserProvider,
  tokenA: string,
  tokenB: string,
  rewardToken: string,
  priceFeed: string,
  poolName: string,
  isIncentivized: boolean
) => {
  try {
    const signer = await provider.getSigner();
    const coFinanceFactory = new ethers.Contract(COFINANCE_FACTORY_ADDRESS, COFINANCE_FACTORY_ABI, signer);
    const tx = await coFinanceFactory.createPool(
      tokenA,
      tokenB,
      rewardToken,
      priceFeed,
      poolName,
      "CoFi-LP",
      isIncentivized,
      { value: ethers.parseUnits('10', 'wei') }
    );
    await tx.wait();
    return tx.address;
  } catch (error) {
    console.error('Error adding pool:', error);
    throw error;
  }
};

export const getAllPools = async (provider: ethers.BrowserProvider) => {
    try {
      const coFinanceFactory = new ethers.Contract(COFINANCE_FACTORY_ADDRESS, COFINANCE_FACTORY_ABI, provider);
      const pools = await coFinanceFactory.getAllPools();
      return pools;
    } catch (error) {
      console.error('Error fetching all pools:', error);
      throw error;
    }
  };

  export const getIncentivizedPools = async (provider: ethers.BrowserProvider) => {
    try {
      const coFinanceFactory = new ethers.Contract(COFINANCE_FACTORY_ADDRESS, COFINANCE_FACTORY_ABI, provider);
      const pools = await coFinanceFactory.getIncentivizedPools();
      return pools;
    } catch (error) {
      console.error('Error fetching all pools:', error);
      throw error;
    }
  };
  

  export const getPoolByPairs = async (provider, tokenA, tokenB) => {
    const contract = new ethers.Contract(COFINANCE_FACTORY_ADDRESS, COFINANCE_FACTORY_ABI, provider);
    const [sortedTokenA, sortedTokenB] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
    const poolAddress = await contract.pools(sortedTokenA, sortedTokenB);
    return poolAddress;
};