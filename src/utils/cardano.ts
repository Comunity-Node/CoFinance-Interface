// utils/cardano.ts
export const connectNamiWallet = async (): Promise<string | null> => {
  try {
    const nami = window.cardano?.nami;
    if (!nami) {
      console.error("Nami Wallet not found.");
      return null;
    }

    const isEnabled = await cardano.isEnabled();
    if (!isEnabled) {
      await cardano.enable();
    }

    const balance = await cardano.getBalance();
    console.log(balance)

    const addresses = await cardano.getUsedAddresses();
    console.log(addresses)
    if (addresses.length > 0) {
      const address = addresses[0]; // Get the first address
      if (typeof address === 'string') {
        return address;
      } else {
        console.error("Nami Wallet address is not a string:", address);
        return null;
      }
    } else {
      console.error("No addresses found in Nami Wallet.");
      return null;
    }
  } catch (error) {
    console.error("Failed to connect Nami Wallet:", error);
    return null;
  }
};
