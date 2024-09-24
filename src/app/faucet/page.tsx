'use client'; // Ensure this file is treated as a client-side component

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TokenERC20ABI from '@/data/abis/ERC20.json';
import { useAccount } from '../RootLayout';
import contractAddressesJson from '@/data/tokens.json';
import { ContractAddresses } from '@/types/ContractAddress';
import { BsCopy } from "react-icons/bs";
import { encryptDataField } from "@swisstronik/utils";
import { MdOutlineArrowOutward } from 'react-icons/md';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-dark/dark.css'; // Import the dark theme

const MySwal = withReactContent(Swal);

const Faucet: React.FC = () => {
  const { account } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contractAddresses, setContractAddresses] = useState<ContractAddresses | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    setContractAddresses(contractAddressesJson);
  }, []);

  const promptMetaMaskSign = async (message: string): Promise<string> => {
    if (!window.ethereum) {
      // throw new Error('MetaMask is not installed');
      MySwal.fire({
        icon: 'error',
        title: 'Wallet Connect',
        text: 'MetaMask is not installed',
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
        confirmButtonText: 'Close',
      });
    }

    // Initialize provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Request MetaMask to sign the message
    const signature = await signer.signMessage(message);

    return signature;
  };

  const handleRequestFaucet = async () => {
    if (!account) {
      MySwal.fire({
        icon: 'error',
        title: 'Wallet Connect',
        text: 'Please connect your wallet first',
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
        confirmButtonText: 'Close',
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const message = `Please sign this message to request faucet. Account: ${account}`;

    try {
      await promptMetaMaskSign(message);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const chainId = await provider.getNetwork().then(network => network.chainId);
      const swisstronikChainId = 1291; // Example Swisstronik chain ID, update if necessary

      let addresses: string[] | undefined;

      const newLocal = chainId === BigInt(swisstronikChainId);
      if (newLocal) {
        // Use specific addresses for Swisstronik
        addresses = [
          '0xbe821Cd53a7e6E957F22cC866f6D2Bd42Ab1f18c',
          '0xff5f8727fC6943623fE5395e0781aC264bc16a41'
        ];
      } else if (contractAddresses) {
        const chainIdString = chainId.toString();
        addresses = contractAddresses[chainIdString];
      }

      if (!addresses || addresses.length === 0) {
        // throw new Error('No contract addresses for the current chain ID');
        MySwal.fire({
          icon: 'error',
          title: 'Failed to Request Faucet!',
          text: 'No contract addresses for the current chain ID',
          customClass: {
            popup: 'my-custom-popup',
            confirmButton: 'my-custom-confirm-button',
            cancelButton: 'my-custom-cancel-button',
          },
          confirmButtonText: 'Close',
        });
      }

      // Initialize signer
      const signer = await provider.getSigner();

      // Track transaction hashes
      const txHashes: string[] = [];

      for (const address of addresses) {
        const contract = new ethers.Contract(address, TokenERC20ABI, signer);
        const functionName = "mint100tokens";

        // Encode function data
        const data = contract.interface.encodeFunctionData(functionName);
        const rpcLink = "https://json-rpc.testnet.swisstronik.com";
        const [encryptedData] = await encryptDataField(rpcLink, data);
        const tx: ethers.providers.TransactionRequest = {
          to: address,
          data: encryptedData,
          value: "0", // No value
        };
        console.log(tx);
        const gasEstimate = await provider.estimateGas(tx);
        console.log(gasEstimate);
        tx.gasLimit = gasEstimate;
        const txResponse = await signer.sendTransaction(tx);
        await txResponse.wait();
        txHashes.push(txResponse.hash);
      }

      // setSuccess(`Transactions successful! Tx Hashes: ${txHashes.join(', ')}`);
      MySwal.fire({
        icon: 'success',
        title: 'Transactions Successfully!',
        text: `Tx Hashes: ${txHashes.join(', ')}`,
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
        confirmButtonText: 'Close',
      });
    } catch (error) {
      // setError(`Failed to request faucet: ${(error as Error).message}`);
      MySwal.fire({
        icon: 'error',
        title: 'Failed to Request Faucet!',
        text: `${(error as Error).message}`,
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
        confirmButtonText: 'Close',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };


  return (
    <div className="min-h-screen bg-faucet bg-no-repeat bg-contain">
      <div className="pt-40 space-y-3 flex justify-center">
        <div className="bg-[#141414] rounded-xl p-4 space-y-6 w-full max-w-2xl">
          <div className="leading-none">
            <h1 className="text-3xl font-semibold text-white my-3 text-start">Get The Tokens</h1>
            <p className='tex-sm font-normal text-gray-400'>Lorem ipsum sit dolor amet.</p>
          </div>
          <div className="flex justify-center mb-12">
            <div className="bg-[#292929] rounded-lg shadow-lg w-full max-w-2xl">
              <div className="relative w-full px-4 py-2">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Wallet Address</span>
                    <span className={`label-text-alt text-${account ? 'green-400' : 'red-500'}`}>{account ? 'Connected' : 'Not Connected'}</span>
                  </div>
                  <div className="join">
                    <input className="input input-bordered join-item w-full placeholder:text-gray-500" value={account || ''} readOnly placeholder={account ? '' : 'Enter Your Wallet Address'} />
                    <button className={`btn join-item rounded-lg font-normal ${copySuccess ? 'tooltip tooltip-open tooltip-success' : ''}`} data-tip={copySuccess ? 'Copied' : ''} onClick={handleCopy}>
                      <BsCopy />
                    </button>
                  </div>
                </label>
                <div className="w-full text-end rounded-lg p-1 my-4 bg-[#bdc3c7]">
                  <button
                    onClick={handleRequestFaucet}
                    className={`btn btn-sm border-0 font-thin text-md bg-transparent hover:bg-transparent text-gray-950 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Request Faucet'} <MdOutlineArrowOutward />
                  </button>
                </div>
              </div>
              {/* {error && <p className="text-red-500 text-center">{error}</p>} */}
              {/* {success && <p className="text-green-500 text-center">{success}</p>} */}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Faucet;
