'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/moving-border';
import { SigningStargateClient, OfflineSigner, StdFee } from '@cosmjs/stargate';
import { sign } from '../../utils/ethermint';
import validatorsData from '../../data/validator.json'; 
import axios from 'axios';

interface Validator {
  operator_address: string;
  moniker: string;
  tokens?: string;
  network?: string;
  chainid?: string;
  denom?: string;
  rpcUrl?: string; 
}

const DEFAULT_CHAIN_ID = 'osmo-test-5';
const DEFAULT_RPC_URL = 'https://rpc.testnet.osmosis.zone';

function TokenStake() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(true); 
  const [client, setClient] = useState<SigningStargateClient | null>(null);
  const [account, setAccount] = useState<any>(null);
  const [validators, setValidators] = useState<Validator[]>(validatorsData.tokens); 
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = useState<string>(''); 
  const [showPopup, setShowPopup] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [chainid, use] = useState<string | null>(null);


  const [stakedAmount, setStakedAmount] = useState<string | null>(null);
  const [stakedValidator, setStakedValidator] = useState<Validator | null>(null);

  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (client && account) {
        const denom = selectedValidator?.denom;
        try {
          const accountBalance = await client.getBalance(account.address, denom );
          console.log(accountBalance)
          setBalance(accountBalance.amount);
        } catch (err) {
          setError(`Failed to fetch balance: ${err.message}`);
        }
      }
    };

    const fetchStakingInfo = async () => {
      if (account) {
        try {
          //const response = await axios.get(`https://lcd.testnet.osmosis.zone/cosmos/staking/v1beta1/delegations/${account.address}`);
          const data = response.data;
          
          if (data.delegation_responses && data.delegation_responses.length > 0) {
            const delegation = data.delegation_responses[0].delegation;
            const validatorAddress = delegation.validator_address;
            const amount = data.delegation_responses[0].balance.amount;
            const validator = validators.find(v => v.operator_address === validatorAddress);
            
            setStakedValidator(validator || null);
            setStakedAmount(amount ? amount : '0');
          } else {
            setStakedAmount('0');
            setStakedValidator(null);
          }
        } catch (err) {
          setError(`Failed to fetch staking info: ${err.message}`);
        }
      }
    };

    fetchBalance();
    fetchStakingInfo();
    fetchRewards();
  }, [client, account]);

  const fetchRewards = async (account: any) => {
    if (!account) return;
  
    try {
      const response = await axios.get(`https://lcd.testnet.osmosis.zone/cosmos/distribution/v1beta1/delegators/${account.address}/rewards`);
      const data = response.data;
        if (data.rewards && data.rewards.length > 0) {
        let totalReward = 0;
          for (const reward of data.rewards) {
          totalReward += reward.reward.reduce((acc: number, curr: any) => acc + parseFloat(curr.amount), 0);
        }
          const validatorAddress = data.rewards[0].validator_address;
        const validator = validators.find(v => v.operator_address === validatorAddress);
  
        setStakedValidator(validator || null);
        setReward(totalReward.toString());
      } else {
        setReward('0');
        setStakedValidator(null);
      }
    } catch (error) {
      setError(`Failed to fetch rewards: ${error.message}`);
    }
  };
  const [reward, setReward] = useState<string | null>(null);

  
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  const connectWallet = async (validatorId: string) => {
    const selectedValidator = validators.find(v => v.operator_address === validatorId);
    const chainId = selectedValidator?.chainid || DEFAULT_CHAIN_ID;
  
    if (!window.getOfflineSigner || !window.getOfflineSigner(chainId)) {
      setError("Keplr Wallet is not installed or not available for the selected network");
      return;
    }
  
    try {
      const offlineSigner = window.getOfflineSigner(chainId);
      const client = await SigningStargateClient.connectWithSigner(
        selectedValidator?.rpcUrl || DEFAULT_RPC_URL,
        offlineSigner
      );
      setClient(client);
  
      const accounts = await offlineSigner.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setWalletConnected(true);
        setShowConnectButton(false);
      } else {
        setError("No accounts found");
      }
    } catch (err) {
      setError(`Failed to connect wallet: ${err.message}`);
    }
  };
  

  const disconnectWallet = () => {
    setClient(null);
    setAccount(null);
    setWalletConnected(false);
    setShowConnectButton(true); 
  };

  const truncateHash = (hash: string, length: number = 10) => {
  };

  const handleSelectValidator = async (validator: Validator) => {
    const chainId = validator.chainid || DEFAULT_CHAIN_ID;
    const denom = validator.denom || 'uosmo';
    const rpcUrl = validator.rpcUrl || DEFAULT_RPC_URL;

    setSelectedValidator(validator);
    setStakeAmount('');
    setUnstakeAmount('');

    if (!window.getOfflineSigner || !window.getOfflineSigner(chainId)) {
        setError("Keplr Wallet is not available for the selected network");
        return;
    }

    try {
        const offlineSigner = window.getOfflineSigner(chainId);
        const newClient = await SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner);
        setClient(newClient);

        const accounts = await offlineSigner.getAccounts();
        if (accounts.length > 0) {
            setAccount(accounts[0]);
            setShowPopup(true);
        } else {
            setError("No accounts found after reconnecting to the selected network");
        }
    } catch (err) {
        setError(`Failed to connect to the selected network: ${err.message}`);
    }
  };

  const handleStake = async () => {
    if (!client || !account || !selectedValidator) return;
  
    const validator = selectedValidator.operator_address;
    const chainId = selectedValidator.chainid || DEFAULT_CHAIN_ID;
    const denom = selectedValidator.denom || 'uosmo';
    const rpcUrl = selectedValidator.rpcUrl || DEFAULT_RPC_URL;
    const validChainIds = ['swisstronik_1291-1'];
  
    if (!validChainIds.includes(chainId)) {
      try {
        const amountToStake = parseFloat(stakeAmount);
        if (isNaN(amountToStake) || amountToStake <= 0) {
          setError("Invalid stake amount");
          return;
        }
  
        const fee = { amount: [{ denom: selectedValidator.denom, amount: '3000' }], gas: '300000' };
        const stakingAmount = [{ denom: selectedValidator.denom, amount: amountToStake.toString() }];
  
        const tx = await client.signAndBroadcast(
          account.address,
          [
            {
              typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
              value: {
                delegatorAddress: account.address,
                validatorAddress: validator,
                amount: stakingAmount[0],
              },
            },
          ],
          fee,
          ''
        );
  
        if (tx.code !== 0) {
          setError(`Transaction failed: ${tx.log || tx.rawLog}`);
          setTxHash(null);
        } else {
          setTxHash(tx.transactionHash || 'Transaction hash not available');
          console.log(tx.transactionHash)
          setShowPopup(false);
        }
  
      } catch (err) {
        setError(`Failed to stake tokens: ${err.message}`);
        setTxHash(null);
      }
      return;
    }
  
    if (chainId === 'swisstronik_1291-1') {
      
      try {
        const offlineSigner = window.getOfflineSigner(chainId);
        //console.log(offlineSigner)
        const newClient = await SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner);
        console.log(newClient)
        setClient(newClient);
    
        const amount = {
          denom,
          amount: (parseFloat(stakeAmount) * 1000000).toString(),
        };
    
        const fee = {
          amount: [{ denom: selectedValidator.denom, amount: '3000' }],
          gas: '300000',
        };
    
        const messages = [
          {
            typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
            value: {
              delegatorAddress: account.address,
              validatorAddress: validator,
              amount: {
                denom: selectedValidator.denom,
                amount: amount.amount,
              },
            },
          },
        ];
        const txBytes = await sign(
          newClient.registry,
          newClient,
          offlineSigner,
          chainId,
          account.address,
          messages,
          fee,
          ''
        );
    
        const broadcastResult = await newClient.broadcastTx(txBytes);
    
        if (broadcastResult.code !== 0) {
          setError(`Transaction failed: ${broadcastResult.log || broadcastResult.rawLog}`);
          setTxHash(null);
        } else {
          setTxHash(broadcastResult.transactionHash || 'Transaction hash not available');
          setShowPopup(true);
        }
    
      } catch (err) {
        setError(`Failed to connect to the selected network or sign the transaction: ${err.message}`);
      }
    }
  };    
  
  const handleUnstake = async () => {
    if (!client || !account || !selectedValidator) return;
  
    const validator = selectedValidator.operator_address;
    const chainId = selectedValidator.chainid || DEFAULT_CHAIN_ID;
    const denom = selectedValidator.denom || 'uosmo';
    const amount = {
      denom,
      amount: (parseFloat(unstakeAmount) * 1000000).toString(),
    };
  
    try {
      const fee: StdFee = {
        amount: [{ denom, amount: '3000' }],
        gas: '300000',
      };
  
      const messages = [
        {
          typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
          value: {
            delegatorAddress: account.address,
            validatorAddress: validator,
            amount: amount,
          },
        },
      ];
  
      const tx = await client.signAndBroadcast(
        account.address,
        messages,
        fee,
        ''
      );
  
      assertIsBroadcastTxSuccess(tx);
      
      setTxHash(tx.transactionHash || 'Transaction hash not available');
      setShowPopup(true);
    } catch (err) {
      setError(`Failed to unstake: ${err.message}`);
    }
  };

  const handleClaimRewards = async () => {
    if (!client || !account || !selectedValidator) return;
  
    const validatorAddress = selectedValidator.operator_address;
    const denom = selectedValidator.denom || 'uosmo';
  
    try {
      const fee: StdFee = {
        amount: [{ denom, amount: '3000' }],
        gas: '300000',
      };
  
      const messages = [
        {
          typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
          value: {
            delegatorAddress: account.address,
            validatorAddress: validatorAddress,
          },
        },
      ];
  
      const tx = await client.signAndBroadcast(
        account.address,
        messages,
        fee,
        ''
      );
  
      if (tx.code !== 0) {
        setError(`Transaction failed: ${tx.log || tx.rawLog}`);
        setTxHash(null);
      } else {
        setTxHash(tx.transactionHash || 'Transaction hash not available');
        console.log(txHash)
        setShowPopup(true);
      }
    } catch (err) {
      setError(`Failed to claim rewards: ${err.message}`);
    }
  };


  

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-24">
      {/* Wallet Connection */}
      <div className="fixed top-10 right-4 z-50">
        {showConnectButton && (
          <Button
            onClick={connectWallet}
          >
            Connect Keplr Wallet
          </Button>
        )}
        {walletConnected && (
          <Button
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </Button>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Account Card */}
      {walletConnected && account && (
        <div className="flex justify-center mb-12">
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-600 p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-4">Account Details</h2>
            <div className="space-y-4">
              <p className="text-gray-300">Address: {account.address}</p>
              <p className="text-gray-300">Balance: {balance}</p>
              <p className="text-gray-300">Staked Amount: {stakedAmount} osmo</p>
              <p className="text-gray-300">Reward Staking: {reward} osmo</p>
              <p className="text-gray-300">Staked Validator: {stakedValidator ? stakedValidator.moniker : 'None'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Validator List */}
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Validators</h2>
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-600 p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
          <ul className="space-y-4">
            {validators.map((validator) => (
              <li key={validator.operator_address} className="flex justify-between items-center p-4 border border-gray-600 rounded-lg">
                <span className="text-white">{validator.moniker}</span>
                <span className="text-white"> network: {validator.name}</span>
                <span className="text-white"> Estimated APR: {validator.APR}</span>
                <span className="text-white"> Fee: {validator.fee}</span>
                <Button
                  onClick={() => handleSelectValidator(validator)}
                >
                  Manage
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div
      ref={popupRef}
      className="bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-600 p-6 rounded-lg shadow-lg max-w-md mx-4 w-full backdrop-blur-sm"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Manage Staked</h2>
      {selectedValidator && (
        <div className="space-y-4">
          <p className="text-gray-300">Selected Validator: {selectedValidator.moniker}</p>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-300">Stake Amount</label>
              <input
                type="text"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="mt-1 p-2 border border-gray-500 rounded w-full bg-gray-700 text-white"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-300">Unstake Amount</label>
              <input
                type="text"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="mt-1 p-2 border border-gray-500 rounded w-full bg-gray-700 text-white"
              />
            </div>
          </div>
          <div>
            <Button onClick={handleStake} className="bg-green-600 text-white">Stake</Button>
            <Button onClick={handleUnstake} className="bg-red-600 text-white">Unstake</Button>
            <Button onClick={handleClaimRewards} className="bg-yellow-600 text-white">Claim Rewards</Button>
          </div>
          {txHash && (
            <p className="text-green-400 mt-4">
                Transaction: 
                <a href={`https://www.mintscan.io/osmosis-testnet/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline"
            >
                  success
                </a>
            </p>
        )}
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}

export default TokenStake;
