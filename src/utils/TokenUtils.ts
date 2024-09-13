import { ethers } from 'ethers';

interface TokenInfo {
  value: string;
  label: string;
  image: string;
}

export const getTokenInfo = async (provider: ethers.Provider, address: string): Promise<TokenInfo> => {
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

    // Ensure that none of the values are null or undefined
    const tokenName = name || 'N/A';
    const tokenSymbol = symbol || 'N/A';
    const tokenImage = `/tokens/${tokenSymbol}.png`;

    return {
      value: address,
      label: `${tokenName} (${tokenSymbol})`,
      image: tokenSymbol !== 'N/A' ? tokenImage : '/tokens/CoFi.png'
    };
  } catch (error) {
    console.error('Error fetching token info:', error);

    return {
      value: address,
      label: 'N/A',
      image: '/tokens/CoFi.png' 
    };
  }
};
