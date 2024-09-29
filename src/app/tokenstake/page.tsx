'use client';
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Button } from '../../components/ui/moving-border';
import { DeliverTxResponse, SigningStargateClient, StdFee } from '@cosmjs/stargate';
import { sign } from '../../utils/ethermint';
import validatorsData from '../../data/validator.json';
import axios from 'axios';
import { Fee } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { IoCloseCircle } from "react-icons/io5";
import { FaInfoCircle } from 'react-icons/fa';
import CardAccountDetails from '@/components/inner-page/CardAccountDetails';
import Modal from '@/components/Modal';

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
  const [copySuccess] = useState<string | null>(null);
  const [stakedAmount, setStakedAmount] = useState<string | null>(null);
  const [stakedValidator, setStakedValidator] = useState<Validator | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);


  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (client && account) {
        const denom = selectedValidator?.denom;
        try {
          const accountBalance = await client.getBalance(account.address, denom || '');
          console.log(accountBalance)
          setBalance(accountBalance.amount);
        } catch (error) {
          setError(`Failed to fetch balance: ${error}`);
        }
      }
    };

    const fetchStakingInfo = async () => {
      if (account) {
        try {
          const response = await axios.get(`https://lcd.testnet.osmosis.zone/cosmos/staking/v1beta1/delegations/${account.address}`);
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
      setError(`Failed to fetch rewards: ${error}`);
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
      setError(`Failed to connect wallet: ${err}`);
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
      setError(`Failed to connect to the selected network: ${err}`);
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
          fee as StdFee,
          ''
        );
        if (tx.code !== 0) {
          setError(`Transaction failed: ${tx.rawLog}`);
          setTxHash(null);
        } else {
          setTxHash(tx.transactionHash || 'Transaction hash not available');
          console.log(tx.transactionHash);
          setShowPopup(false);
        }

      } catch (err) {
        setError(`Failed to stake tokens: ${err}`);
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

        const fee: Fee = {
          amount: [{ denom, amount: '3000' }],
          gasLimit: BigInt(0),
          payer: '',
          granter: ''
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
          { ...fee, gas: '300000' },
          ''
        );

        const broadcastResult = await newClient.broadcastTx(txBytes);

        if (broadcastResult.code !== 0) {
          setError(`Transaction failed: ${broadcastResult.rawLog}`);
          setTxHash(null);
        } else {
          setTxHash(broadcastResult.transactionHash || 'Transaction hash not available');
          setShowPopup(true);
        }

      } catch (err) {
        setError(`Failed to connect to the selected network or sign the transaction: ${err}`);
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
      setError(`Failed to unstake: ${err}`);
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
        setError(`Transaction failed: ${tx.rawLog || tx.rawLog}`);
        setTxHash(null);
      } else {
        setTxHash(tx.transactionHash || 'Transaction hash not available');
        console.log(txHash)
        setShowPopup(true);
      }
    } catch (err) {
      setError(`Failed to claim rewards: ${err}`);
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
                          onClick={() => handleSelectValidator(validator)}>
                          <td className="p-4 text-left text-gray-200">{validator.name}</td>
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

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={popupRef} className="bg-[#141414] p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">Manage Staked</h2>
              {selectedValidator && (
                <div className="space-y-4">
                  <p className="text-gray-300">Selected Validator: {selectedValidator.moniker}</p>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-gray-300">Stake Amount</label>
                      <input type="text" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="mt-1 p-2 border border-gray-500 rounded w-full bg-gray-700 text-white" />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-gray-300">Unstake Amount</label>
                      <input type="text" value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} className="mt-1 p-2 border border-gray-500 rounded w-full bg-gray-700 text-white" />
                    </div>
                  </div>
                  <div>
                    <Button onClick={handleStake} className="bg-green-600 text-white">Stake</Button>
                    <Button onClick={handleUnstake} className="bg-red-600 text-white">Unstake</Button>
                    <Button onClick={handleClaimRewards} className="bg-yellow-600 text-white">Claim Rewards</Button>
                  </div>
                  {txHash && (
                    <p className="text-green-400 mt-4">
                      Transaction: <a href={`https://www.mintscan.io/osmosis-testnet/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">success</a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
          disconnectWallet={() => disconnectWallet}
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

