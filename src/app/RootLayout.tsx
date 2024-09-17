'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ConnectButton from '../components/ConnectButton';

// Create a context for the account state
const AccountContext = createContext<{ account: string | null; setAccount: React.Dispatch<React.SetStateAction<string | null>> } | undefined>(undefined);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isTokenStakePage, setIsTokenStakePage] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsTokenStakePage(pathname === '/tokenstake');
  }, [pathname]);

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {!isTokenStakePage && (
        <div className="fixed right-4 z-50">
          <ConnectButton account={account} setAccount={setAccount} />
        </div>
      )}
      <main className="flex-grow">
        {children}
      </main>
    </AccountContext.Provider>
  );
};

export default ClientWrapper;
