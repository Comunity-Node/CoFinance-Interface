import { ethers } from 'ethers';
// const Wrapped_Address = "0x28cc5edd54b1e4565317c3e0cfab551926a4cd2a"; 
const Wrapped_Address = "0x5300000000000000000000000000000000000004"; 
const Wrapped_ABI = [{"constant":true, "inputs":[], "name":"name", "outputs":[{"name":"", "type":"string"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"guy", "type":"address"}, {"name":"wad", "type":"uint256"}], "name":"approve", "outputs":[{"name":"", "type":"bool"}], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"totalSupply", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"src", "type":"address"}, {"name":"dst", "type":"address"}, {"name":"wad", "type":"uint256"}], "name":"transferFrom", "outputs":[{"name":"", "type":"bool"}], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"wad", "type":"uint256"}], "name":"withdraw", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"decimals", "outputs":[{"name":"", "type":"uint8"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"", "type":"address"}], "name":"balanceOf", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"symbol", "outputs":[{"name":"", "type":"string"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"dst", "type":"address"}, {"name":"wad", "type":"uint256"}], "name":"transfer", "outputs":[{"name":"", "type":"bool"}], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[], "name":"deposit", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":true, "inputs":[{"name":"", "type":"address"}, {"name":"", "type":"address"}], "name":"allowance", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"payable":true, "stateMutability":"payable", "type":"fallback"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"src", "type":"address"}, {"indexed":true, "name":"guy", "type":"address"}, {"indexed":false, "name":"wad", "type":"uint256"}], "name":"Approval", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"src", "type":"address"}, {"indexed":true, "name":"dst", "type":"address"}, {"indexed":false, "name":"wad", "type":"uint256"}], "name":"Transfer", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"dst", "type":"address"}, {"indexed":false, "name":"wad", "type":"uint256"}], "name":"Deposit", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"src", "type":"address"}, {"indexed":false, "name":"wad", "type":"uint256"}], "name":"Withdrawal", "type":"event"}];
export const WrapNative = async (provider: ethers.BrowserProvider, tokenAmount: string) => {
  const signer = await provider.getSigner();
  const wethContract = new ethers.Contract(Wrapped_Address, Wrapped_ABI, signer);
  const amount = ethers.parseUnits(tokenAmount, 18); 
    const tx = await wethContract.deposit({ value: amount });
    
  await tx.wait();
  console.log("succes");
};

export const approveAllowance = async (provider: ethers.BrowserProvider, poolAddress: string, tokenAmount: string) => {
  const signer = await provider.getSigner();
  const wethContract = new ethers.Contract(Wrapped_Address, Wrapped_ABI, signer);
  const amount = ethers.parseUnits(tokenAmount, 18); 
  const tx = await wethContract.approve(poolAddress, amount);
  console.log(tx.hash);
  await tx.wait();
};
  