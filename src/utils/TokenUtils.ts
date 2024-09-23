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

export const getTokenBalance = async (provider: ethers.Provider, tokenAddress: string, account: string): Promise<string> => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, [
      "function balanceOf(address) view returns (uint256)"
    ], provider);

    const balance = await tokenContract.balanceOf(account);
    return ethers.formatUnits(balance, 18); 
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0'; // Return '0' on error
  }
};
