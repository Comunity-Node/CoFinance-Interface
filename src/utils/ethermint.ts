import { SigningStargateClient } from '@cosmjs/stargate';
import { fromBase64 } from '@cosmjs/encoding';
import { makeAuthInfoBytes, makeSignDoc } from '@cosmjs/proto-signing';
import { Int53 } from '@cosmjs/math';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { OfflineSigner } from '@cosmjs/proto-signing';

interface Fee {
  amount: { denom: string; amount: string }[];
  gas: string;
}

interface SignerAccount {
  address: string;
  pubkey: Uint8Array;
}

type Message = {
  typeUrl: string;
  value: any;
};

export async function sign(
  api: any,
  client: SigningStargateClient,
  signer: OfflineSigner,
  chainId: string,
  signerAddress: string,
  messages: Message[],
  fee: Fee,
  memo: string
): Promise<Uint8Array> {
  try {
    const { accountNumber, sequence } = await api.getAccountInfo(signerAddress);

    const accountFromSigner = (await signer.getAccounts()).find(
      (account) => account.address === signerAddress
    );
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }
    const pubkeyBytes = accountFromSigner.pubkey;

    const pubk = Any.fromPartial({
      typeUrl: '/cosmos.crypto.secp256k1.PubKey',
      value: PubKey.encode({ key: pubkeyBytes }).finish(),
    });

    const txBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: messages,
        memo: memo,
      },
    };
    const txBodyBytes = client.registry.encode(txBodyEncodeObject);
    const gasLimit = Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubk, sequence }], fee.amount, gasLimit);
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    const { signature, signed } = await signer.signDirect(signerAddress, signDoc);

    return TxRaw.encode({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    }).finish();
  } catch (error) {
    throw new Error(`Sign function error: ${error.message}`);
  }
}
