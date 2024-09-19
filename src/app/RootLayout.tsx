'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ConnectButton from '../components/ConnectButton';
import { Rubik } from 'next/font/google';

// Load Rubik font from Google Fonts
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

// Create a context for the account state
const AccountContext = createContext<{
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
} | undefined>(undefined);

// Custom hook to access the account context
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

// The ClientWrapper component handles the layout and account state
const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isTokenStakePage, setIsTokenStakePage] = useState<boolean>(false);
  const pathname = usePathname();

  // Effect to check if the current path is '/tokenstake'
  useEffect(() => {
    setIsTokenStakePage(pathname === '/tokenstake');
  }, [pathname]);

  return (
    <div className={rubik.className}>
      <AccountContext.Provider value={{ account, setAccount }}>
        {/* Display the ConnectButton only when not on the '/tokenstake' page */}
        {!isTokenStakePage && (
          <div className="fixed right-4 z-50">
            <ConnectButton account={account} setAccount={setAccount} />
          </div>
        )}
        {/* Main content area */}
        <main className="flex-grow">{children}</main>
      </AccountContext.Provider>
    </div>
  );
};

export default ClientWrapper;
