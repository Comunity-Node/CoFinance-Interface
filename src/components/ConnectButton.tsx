'use client';

import React, { useState, useEffect } from 'react';
import { Button, ButtonGlass } from '../components/ui/moving-border';
import ChainSwitchButton from './SwitchChain'; // Update path as necessary
import { connectMetaMask } from '../utils/wallet'; // Update path as necessary
import { FaWallet } from 'react-icons/fa';
import WalletOption from './WalletOption';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@sweetalert2/theme-dark/dark.css';
import WalletDetails from './WalletDetails';
const MySwal = withReactContent(Swal);


interface ConnectButtonProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ account, setAccount }) => {
  const [connected, setConnected] = React.useState<boolean>(!!account);
  const [visible, setVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const openModal = () => {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    modal?.showModal();
  };

  React.useEffect(() => {
    setConnected(!!account);
  }, [account]);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > lastScrollTop) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const closeModal = () => {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    if (modal && typeof modal.close === 'function') {
      modal.close();
    } else {
      console.error('Modal element not found or close() method is not available.');
    }
  };

  const handleConnectMetaMask = async () => {
    setLoading(true);
    try {
      // Wait for 3 seconds before proceeding with the MetaMask connection
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // After 3 seconds, try connecting to MetaMask
      const address = await connectMetaMask();

      if (address) {
        console.log('Connected to MetaMask with address:', address);
        setAccount(address);
        setConnected(true);
        closeModal();

        await MySwal.fire({
          icon: 'success',
          title: 'Connected',
          text: 'Your wallet is connected!',
          customClass: {
            popup: 'my-custom-popup',
            confirmButton: 'my-custom-confirm-button',
            cancelButton: 'my-custom-cancel-button',
          },
        });

        return;
      } else {
        console.error('Failed to connect MetaMask.');
        closeModal();

        await MySwal.fire({
          icon: 'error',
          title: 'Connection Failed!',
          text: 'Your wallet is not connected!',
          customClass: {
            popup: 'my-custom-popup',
            confirmButton: 'my-custom-confirm-button',
            cancelButton: 'my-custom-cancel-button',
          },
        });

        return;
      }
    } catch (err) {
      console.error('Failed to connect MetaMask:', err);
      closeModal();

      await MySwal.fire({
        icon: 'warning',
        title: 'Connection Failed!',
        text: `An error occurred: ${err}`,
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
      });

      return;
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    setLoading(true);
    try {
      // Wait for 3 seconds before proceeding with the MetaMask connection
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setAccount(null);
      setConnected(false);
      closeModal();

      await MySwal.fire({
        icon: 'success',
        title: 'Disconnect',
        text: 'Diconnected your wallet!',
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
      });

      return;
    } catch (error) {
      closeModal();

      await MySwal.fire({
        icon: 'warning',
        title: 'Connection Failed!',
        text: `An error occurred: ${error}`,
        customClass: {
          popup: 'my-custom-popup',
          confirmButton: 'my-custom-confirm-button',
          cancelButton: 'my-custom-cancel-button',
        },
      });
    } finally {
      setLoading(false)
    }
  };

  const walletOptions = [
    {
      name: "Metamask",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png",
      onClick: handleConnectMetaMask,
      disabled: false,
      soon: false,
      loading: loading,
    },
    {
      name: "Keplr",
      img: "https://store-images.s-microsoft.com/image/apps.33644.b30b59e9-066d-4218-b91a-e9a076c2efde.90c13d55-8d3a-4b0f-95b5-9883c3c38008.c3300503-05e8-4957-ade2-1653e88f0584",
      onClick: () => alert("WalletConnect clicked!"),
      disabled: true,
      soon: true,
      loading: false,
    },
    {
      name: "Trust Wallet",
      img: "https://vectorseek.com/wp-content/uploads/2024/07/Trust-Wallet-Shield-Logo-Vector-Logo-Vector.svg-.png",
      onClick: () => alert("Coming Soon clicked!"),
      disabled: true,
      soon: true,
      loading: false,
    },
  ];

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-5 z-50 transition-transform">
        <div className="flex items-center space-x-4 py-2">
          <ChainSwitchButton />

          <ButtonGlass onClick={openModal}>
            <FaWallet className="mr-2" /> {connected ? `${account?.substring(0, 6)}...${account?.substring(account.length - 4)}` : 'Connect Wallet'}
          </ButtonGlass>
        </div>
      </div>

      {/* Modal Dialog Connect Wallet */}
      <dialog id="my_modal_2" className="modal z-10">
        <div className="bg-[#141414] modal-box space-y-2">
          <h3 className="font-semibold text-2xl">{connected ? "Your" : "Connect"} Wallet</h3>
          <div className="w-full bg-transparent rounded-lg pt-5">
            {connected ?
              (
                <WalletDetails
                  connected={connected}
                  account={account || ''}
                  handleCopy={handleCopy}
                  copySuccess={copySuccess ? "Copied" : ""}
                  handleDisconnectWallet={handleDisconnectWallet}
                  loading={loading}
                />
              )
              :
              (
                <ul className={`menu menu-lg ${connected ? 'bg-transparent border-gray-700 border-2 rounded-xl' : 'bg-[#141414]'} rounded-box w-full`}>
                  {walletOptions.map((wallet, index) => (
                    <WalletOption
                      key={index}
                      img={wallet.img}
                      name={wallet.name}
                      onClick={wallet.onClick}
                      disabled={wallet.disabled}
                      soon={wallet.soon}
                      loading={wallet.loading}
                    />
                  ))}
                </ul>
              )}
            <footer className="footer bg-transparent text-neutral-content items-center px-4 pt-4 justify-center">
              <aside className="grid-flow-col items-center">
                <p>Powered By </p>
                <img src="/logo-new.png" className='w-20' alt="" />
              </aside>
            </footer>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ConnectButton;
