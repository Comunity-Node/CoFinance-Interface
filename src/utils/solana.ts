import { PublicKey } from '@solana/web3.js';

interface SolanaProvider extends Window {
    solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: PublicKey }>;
        disconnect?: () => Promise<void>;
        request?: (args: any) => Promise<any>;
    };
}

// Connect to the Phantom wallet
export const connectSolanaWallet = async (): Promise<string | null> => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            return response.publicKey.toString() || null;
        } catch (error) {
            console.error('User rejected the request or failed to connect:', error);
            throw new Error('Failed to connect to Solana wallet');
        }
    } else {
        console.error('Phantom wallet is not installed');
        throw new Error('Phantom wallet is not installed');
    }
};

// Disconnect from the Phantom wallet
export const disconnectSolanaWallet = async (): Promise<void> => {
    if (window.solana && window.solana.isPhantom && window.solana.disconnect) {
        try {
            await window.solana.disconnect();
        } catch (error) {
            console.error('Failed to disconnect from Solana wallet:', error);
            throw new Error('Failed to disconnect from Solana wallet');
        }
    } else {
        console.error('Phantom wallet is not installed or does not support disconnect');
        throw new Error('Phantom wallet is not installed or does not support disconnect');
    }
};

// Solana does not natively support switching networks like Ethereum
// For demonstration, here’s a placeholder function
export const switchSolanaNetwork = async (networkUrl: string): Promise<void> => {
    // This function is illustrative; Solana network switching requires reconfiguration outside of this API.
    // Use the correct Solana network URL for connection
    if (window.solana && window.solana.request) {
        try {
            // Example request, update with actual implementation if available
            await window.solana.request({
                method: 'setRpcUrl',
                params: [networkUrl],
            });
        } catch (error) {
            console.error('Error switching Solana networks:', error);
            throw new Error('Failed to switch Solana networks');
        }
    } else {
        console.error('Solana provider is not available');
        throw new Error('Solana provider is not available');
    }
};
