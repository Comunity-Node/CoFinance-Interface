// swisstronikUtils.js
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const { ethers } = require("ethers");

// Function to send a shielded transaction
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpcLink = process.env.RPC_URL || 'https://json-rpc.testnet.swisstronik.com';
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: await signer.getAddress(),
    to: destination,
    data: encryptedData,
    value,
  });
};
const decodeCall = (abi, methodName, bytes) => {
  const input = (abi.find((x) => x.name === methodName) || { outputs: [] }).outputs;
  return ethers.utils.defaultAbiCoder.decode(input, bytes);
};

module.exports = {
  sendShieldedTransaction,
  decodeCall,
};
