'use client';
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Button } from '../../components/ui/moving-border';
import { DeliverTxResponse, SigningStargateClient, StdFee,  } from '@cosmjs/stargate';
import { signEvmWithKeplr } from '../../utils/ethermint';
import { GasPrice, StdFee } from '@cosmjs/stargate';
import validatorsData from '../../data/validator.json';
import axios from 'axios';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { IoCloseCircle } from "react-icons/io5";
import { FaInfoCircle } from 'react-icons/fa';
import CardAccountDetails from '@/components/inner-page/CardAccountDetails';
import Modal from '@/components/Modal';
import CardManagedStaked from '@/components/inner-page/CardManagedStaked';

interface Validator {
  [x: string]: ReactNode;
  operator_address: string;
  moniker: string;
  tokens?: string;
  network?: string;
  chainid?: string;
  denom?: string;
  rpcUrl?: string;
}

const DEFAULT_CHAIN_ID = 'crossfi-evm-testnet-1';
const DEFAULT_RPC_URL = 'https://crossfi-testnet-rpc.polkachu.com';
const getFee = (amount: string, denom: string): StdFee => {
  const gasAmount = '300000'; // Default gas limit, adjust based on transaction complexity if needed
  const gasPrice = GAS_PRICE[denom] || GAS_PRICE.mpx; // Default to 'mpx' if denom not found

  const feeAmount = gasPrice.mul(BigInt(amount)); // Calculate the fee based on amount and gasPrice
  const fee = {
    amount: [{ denom, amount: feeAmount.toString() }],
    gas: gasAmount,
  };

  return fee;
};



function TokenStake() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(true);
  const [client, setClient] = useState<SigningStargateClient | null>(null);
  const [account, setAccount] = useState<any>(null);
  const [validators, setValidators] = useState<Validator[]>(validatorsData.tokens);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [chainid, use] = useState<string | null>(null);
  const [copySuccess] = useState<string | null>(null);
  const [stakedAmount, setStakedAmount] = useState<string>('');
  const [unstakedAmount, setUnstakedAmount] = useState<string>('');
  const [stakedValidator, setStakedValidator] = useState<Validator | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleStaked, setModalVisibleStaked] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  const changeStakedAmount = (value: string) => {
    setStakedAmount(value);
  };

  const changeUnstakedAmount = (value: string) => {
    setUnstakedAmount(value);
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openModalStaked = (validator: Validator) => {
    setModalVisibleStaked(true);
    setModalTitle(validator.moniker || 'Unnamed Validator');
    setSelectedValidator(validator);  // Store the full validator data if needed for further processing

  }

  const closeModalStaked = () => {
    setModalVisibleStaked(false);
  }

  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (client && account) {
        const denom = "mpx";
        try {
          const accountBalance = await client.getBalance(account.address, denom || '');
          console.log(accountBalance)
          setBalance(accountBalance.amount/1000000000000000000);
        } catch (error) {
          setError(`Failed to fetch balance: ${error}`);
        }
      }
    };

    const fetchStakingInfo = async () => {
      if (account) {
        try {
          const response = await axios.get(`https://crossfi-testnet-api.itrocket.net/cosmos/staking/v1beta1/delegations/${account.address}`);
          const data = response.data;
          console.log(data);

          if (data.delegation_responses && data.delegation_responses.length > 0) {
            const delegation = data.delegation_responses[0].delegation;
            const validatorAddress = delegation.validator_address;
            const amountInBaseUnits = data.delegation_responses[0].balance.amount;
            console.log(amountInBaseUnits);
            const amount = (parseFloat(amountInBaseUnits)/1000000000000000000).toString();
            const validator = validators.find(v => v.operator_address === validatorAddress);

            setStakedValidator(validator || null);
            setStakedAmount(amount ? amount : '');
          } else {
            setStakedAmount('');
            setStakedValidator(null);
          }
        } catch (err) {
          setError(`Failed to fetch staking info: ${err}`);
        }
      }
    };

    fetchBalance();
    fetchStakingInfo();
    fetchRewards(account);
  }, [client, account]);

  
  const fetchRewards = async (account: any) => {
    if (!account) return;
  
    try {
      const response = await axios.get(`https://crossfi-testnet-api.itrocket.net/cosmos/distribution/v1beta1/delegators/${account.address}/rewards`);
      const data = response.data;
  
      if (data.rewards && data.rewards.length > 0) {
        let totalReward = 0;
  
        // Correctly sum all reward amounts
        for (const reward of data.rewards) {
          totalReward += reward.reward.reduce((acc: number, curr: any) => acc + parseFloat(curr.amount), 0);
          console.log("Total reward so far:", totalReward);
        }
  
        // Divide by 10^18 to scale the value correctly
        totalReward = totalReward / 1000000000000000000;
  
        // Log to check the final reward
        console.log("Total reward after dividing by 10^18:", totalReward);
  
        const validatorAddress = data.rewards[0].validator_address;
        const validator = validators.find(v => v.operator_address === validatorAddress);
  
        // Set the state with the correct value
        setStakedValidator(validator || null);
        setReward(totalReward.toFixed(18));  // Ensure it's formatted with 18 decimal places
      } else {
        setReward('0');
        setStakedValidator(null);
      }
    } catch (error) {
      setError(`Failed to fetch rewards: ${error}`);
    }
  };
  
  const [reward, setReward] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
        setModalTitle(null);
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
      const newClient = await SigningStargateClient.connectWithSigner(
        selectedValidator?.rpcUrl || DEFAULT_RPC_URL,
        offlineSigner
      );
      setClient(newClient);  // Save client instance
  
      const accounts = await offlineSigner.getAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);
        setWalletConnected(true);
        setShowConnectButton(false);
        setAccount({
          ...account,
          address: account.address,
        });
      } else {
        setError("No accounts found");
      }
    } catch (err) {
      setError(`Failed to connect wallet: ${err.message || err}`);
    }
  };
  

  
  
  const disconnectWallet = () => {
    setClient(null);
    setAccount(null);
    setWalletConnected(false);
    setShowConnectButton(true);
    setBalance(null);
    setStakedAmount('');
    setUnstakedAmount('');
    setReward(null);
    setStakedValidator(null);
    setSelectedValidator(null);
  };
  const handleStake = async () => {
    if (!client || !account || !selectedValidator) return;
  
    const validator = selectedValidator.operator_address;
    const denom = selectedValidator.denom || 'mpx';
  
    try {
      const amountToStake = parseFloat(stakedAmount * 1000000000000000000) ;
      if (isNaN(amountToStake) || amountToStake <= 0) {
        setError("Invalid stake amount");
        return;
      }
  
      const fee: StdFee = { amount: [{ denom: 'xfi', amount: '30000000' }], gas: '300000' };
      const stakingAmount = [{ denom: 'mpx', amount: amountToStake.toString() }];
  
      // Get the offlineSigner using the chainId
      const offlineSigner = window.getOfflineSigner(DEFAULT_CHAIN_ID);
  
      // Use signEvmWithKeplr to sign the transaction
      const txRaw = await signEvmWithKeplr({
        client,  // Keep client for broadcasting
        signer: offlineSigner,  // Use offlineSigner for signing
        signerAddress: account.address,
        messages: [
          {
            typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
            value: {
              delegatorAddress: account.address,
              validatorAddress: validator,
              amount: stakingAmount[0],
            },
          },
        ],
        fee: fee as StdFee,
        memo: '',
      });
  
      // Broadcast the transaction (using your client or RPC)
      const broadcastRes = await client.broadcastTx(txRaw);
      if (broadcastRes.code !== undefined && broadcastRes.code !== 0) {
        setError(`Transaction failed: ${broadcastRes.log || 'Unknown error'}`);
        setTxHash(null);
      } else {
        setTxHash(broadcastRes.transactionHash || 'Transaction hash not available');
        setShowPopup(true);
      }
    } catch (err) {
      setError(`Failed to stake tokens: ${err}`);
    }
  };
  
  

// Handle Unstake (with signEvmWithKeplr)
const handleUnstake = async () => {
  if (!client || !account || !selectedValidator) return;

  const validator = selectedValidator.operator_address;
  const denom = selectedValidator.denom || 'mpx';
  
  try {
    const amountToUnstake = parseFloat(unstakedAmount);
    if (isNaN(amountToUnstake) || amountToUnstake <= 0) {
      setError("Invalid unstake amount");
      return;
    }

    const fee: StdFee = { amount: [{ denom, amount: '3000' }], gas: '300000' };
    const unstakingAmount = [{ denom, amount: amountToUnstake.toString() }];
    
    // Get the offlineSigner using the chainId
    const offlineSigner = window.getOfflineSigner(DEFAULT_CHAIN_ID);
    
    // Use signEvmWithKeplr to sign the transaction
    const txRaw = await signEvmWithKeplr({
      client,
      signer: offlineSigner,
      signerAddress: account.address,
      messages: [
        {
          typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
          value: {
            delegatorAddress: account.address,
            validatorAddress: validator,
            amount: unstakingAmount[0],
          },
        },
      ],
      fee: fee as StdFee,
      memo: '',
    });

    // Broadcast the transaction
    const broadcastRes = await client.broadcastTx(txRaw);
    if (broadcastRes.code !== undefined && broadcastRes.code !== 0) {
      setError(`Transaction failed: ${broadcastRes.log || 'Unknown error'}`);
      setTxHash(null);
    } else {
      setTxHash(broadcastRes.transactionHash || 'Transaction hash not available');
      setShowPopup(true);
    }
  } catch (err) {
    setError(`Failed to unstake tokens: ${err}`);
  }
};


// Handle Claim Rewards (with signEvmWithKeplr)
const handleClaimRewards = async () => {
  if (!client || !account || !stakedValidator) return;

  const validator = stakedValidator.operator_address;
  
  try {
    const fee: StdFee = { amount: [{ denom: 'mpx', amount: '3000' }], gas: '300000' };
    
    // Messages for claiming rewards
    const messages = [
      {
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: {
          delegatorAddress: account.address,
          validatorAddress: validator,
        },
      },
    ];

    // Get the offlineSigner using the chainId
    const offlineSigner = window.getOfflineSigner(DEFAULT_CHAIN_ID);

    // Use signEvmWithKeplr to sign the transaction
    const txRaw = await signEvmWithKeplr({
      client,
      signer: offlineSigner,
      signerAddress: account.address,
      messages,
      fee: fee as StdFee,
      memo: '',
    });

    // Broadcast the transaction
    const broadcastRes = await client.broadcastTx(txRaw);
    if (broadcastRes.code !== undefined && broadcastRes.code !== 0) {
      setError(`Transaction failed: ${broadcastRes.log || 'Unknown error'}`);
      setTxHash(null);
    } else {
      setTxHash(broadcastRes.transactionHash || 'Transaction hash not available');
      setShowPopup(true);
    }
  } catch (err) {
    setError(`Failed to claim rewards: ${err}`);
  }
};


  const truncateHash = (hash: string, length: number = 10) => {
  };

  const handleSelectValidator = async (validator: Validator) => {
    const chainId = validator.chainid || DEFAULT_CHAIN_ID;
    const denom = validator.denom || 'mpx';
    const rpcUrl = validator.rpcUrl || DEFAULT_RPC_URL;
    const valaddress = validator.operator_address;
  
    // Set selectedValidator to the entire validator object
    setSelectedValidator(validator);
  
    setStakedAmount('');  // Reset staking amount
    setUnstakedAmount('');  // Reset unstaking amount
  
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
        // Set account and show popup for user interaction
        setAccount(accounts[0]);
        setShowPopup(true);  // Show the modal after a successful connection
      } else {
        setError("No accounts found after reconnecting to the selected network");
      }
    } catch (err) {
      setError(`Failed to connect to the selected network: ${err}`);
    }
  };
  
  

  
  
  
  

  return (

    <div className="min-h-screen animation-bounce bg-stake bg-no-repeat bg-contain image-full text-center max-w-screen">
      <div className="pt-40 px-96 space-y-3">
        {error && <div role="alert" className="alert alert-error text-white">
          <IoCloseCircle />
          <span>{error}</span>
        </div>
        }
        <div className="flex items-center justify-between rounded-xl w-full px-10 bg-custom bg-cover py-5">
          <div className="text-start p-4">
            <img
              src="https://keplrwallet.app/assets/intro-logo.png"
              className='w-full h-24 rounded-lg'
              alt="" />
          </div>
          <div className="text-end space-y-2" data-aos="fade-left">
            {showConnectButton && (
              <><p className='text-gray-400 text-md'>Please, connect your Keplr Wallet</p><div className="w-full text-end rounded-lg p-1 bg-gradient-to-tr from-cyan-400 via-cyan-400 to-blue-700">
                <button onClick={() => connectWallet(validators.map((validator) => validator.chainid).join(','))} className="btn border-0 text-lg font-semibold bg-transparent hover:bg-transparent text-gray-950 w-full">
                  Connect <MdOutlineArrowOutward size={18} />
                </button>
              </div></>
            )}
            {walletConnected && account && (
              <><p className='text-gray-400 text-md'>Your Account Details</p><div className="w-full text-end rounded-lg p-1 bg-gradient-to-tr from-slate-400 via-gray-500 to-zinc-600">
                <button onClick={openModal} className="btn border-0 text-lg font-semibold bg-transparent hover:bg-transparent text-gray-950 w-full">
                  View Details
                </button>
              </div></>
            )}

          </div>
        </div>

        <div className="flex flex-col items-center pb-20 space-y-3">
          <div role="alert" className="alert bg-[#141414]">
            <FaInfoCircle />
            <div>
              <h3 className="font-bold">Attention!</h3>
              <div className="text-xs">Click row for manage staking tokens</div>
            </div>
            <p className="text-white text-lg font-semibold">Staking Tokens</p>
          </div>
          <div className="bg-[#141414] p-2 rounded-lg shadow-lg w-full max-w-6xl">
            <div className="bg-transparent p-1 rounded-lg min-w-full">
              {validators.length === 0 ? (
                <p className="text-white text-center">No validators available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead>
                      <tr>
                        <th className="p-4 border-b border-gray-800 text-left font-normal text-gray-400">Validators</th>
                        <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">APR</th>
                        <th className="p-4 border-b border-gray-800 text-right font-normal text-gray-400">Denom</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validators.map((validator, index) => (
                        <tr
                          key={validator.operator_address}
                          className="hover:bg-[#070b0f] hover:text-[#141414] hover:rounded-lg transition cursor-pointer duration-300 ease-in-out"
                          // onClick={() => handleSelectValidator(validator)}
                          onClick={() => openModalStaked(validator)}
                        >
                          <td className="p-4 text-left text-gray-200">{validator.moniker}</td>
                          <td className="p-4 text-right text-gray-200">{validator.APR}</td>
                          <td className="p-4 text-right text-gray-200">{validator.denom}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* {showPopup && ( */}
      {/* Modal */}
      <Modal
  isVisible={isModalVisibleStaked}
  onClose={closeModalStaked}
  title={<span>{modalTitle}</span>}
>
  <CardManagedStaked
    selectedValidator={selectedValidator}  
    stakedAmount={stakedAmount ? stakedAmount : ''}
    unstakedAmount={unstakedAmount ? unstakedAmount : ''}
    handleClaimRewards= {handleClaimRewards}
    handleStake={handleStake}  
    handleUnstake={handleUnstake}
    changeStakedAmount={setStakedAmount}
    changeUnstakedAmount={setUnstakedAmount}
    txHash={txHash || ''}
  />
</Modal>

      {/* )} */}

      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        onClose={closeModal}
        title={<span>Your Account Details</span>}
      >
       <CardAccountDetails
  account={{
    address: account?.address || null
  }}
  stakedAmount={stakedAmount ? stakedAmount : '0'}
  reward={reward || '0'}
  selectedValidator={selectedValidator}
  disconnectWallet={disconnectWallet}  // Pass directly without the arrow function
  balance={balance || '0'}
/>
      </Modal>
    </div>
  );
}

export default TokenStake;

function assertIsBroadcastTxSuccess(tx: DeliverTxResponse) {
  throw new Error('Function not implemented.');
}

