import { ethers } from 'ethers';
interface TokenInfo {
  value: string;
  label: string;
  image: string;
}

export const getTokenInfo = async (provider: ethers.Provider, address: string): Promise<TokenInfo | null> => {
  try {
    const tokenContract = new ethers.Contract(address, [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)"
    ], provider);

    const [name, symbol, decimals] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals()
    ]);

    return {
      value: address,
      label: `${name} (${symbol})`,
      image: `/tokens/${symbol}.png`
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
};
