import { SigningStargateClient } from '@cosmjs/stargate'
import { fromBase64, toBase64 } from '@cosmjs/encoding'
import { makeAuthInfoBytes, makeSignDoc } from '@cosmjs/proto-signing'
import { Any } from 'cosmjs-types/google/protobuf/any'
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys'
import { AuthInfo, Fee, Tx, TxBody, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { OfflineDirectSigner } from '@cosmjs/proto-signing/build/signer'
import { StdFee } from '@cosmjs/amino'
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing'
import { SimulateRequest } from 'cosmjs-types/cosmos/tx/v1beta1/service'
import { EncodeObject } from '@cosmjs/proto-signing/build/registry'
import { Chain } from '@chain-registry/types'
import { GasPrice } from '@cosmjs/stargate'


export const defaultChainId = 'crossfi-evm-testnet-1'

// Gas prices for different tokens
export const GAS_PRICE = {
  mpx: GasPrice.fromString('10000000000000mpx'),
  xfi: GasPrice.fromString('100000000000xfi'),
}


interface ISignProps {
  client: SigningStargateClient
  signer: OfflineDirectSigner
  chain: Chain
  signerAddress: string
  messages: EncodeObject[]
  fee: StdFee
  memo: string
}

interface ISimulateProps {
  client: SigningStargateClient
  signer: OfflineDirectSigner
  chain: Chain
  signerAddress: string
  messages: EncodeObject[]
  memo: string
}

interface IAccount {
  account: {
    '@type': '/cosmos.auth.v1beta1.BaseAccount'
    address: string
    pub_key: {
      '@type': string
      key: string
    }
    account_number: string
    sequence: string
  }
}

interface IEthAccount {
  account: {
    '@type': '/ethermint.types.v1.EthAccount'
    base_account: {
      address: string
      pub_key: {
        '@type': string
        key: string
      }
      account_number: string
      sequence: string
    }
    code_hash: string
  }
}

export async function signEvmWithKeplr({
  client, // SigningStargateClient
  signer, // keplr OfflineSigner
  chain,
  signerAddress,
  messages,
  memo,
}: ISignProps) {
  // Query account info, because cosmjs doesn't support Evmos account
  const accountRes = await fetch(
    `https://crossfi-testnet-api.polkachu.com/cosmos/auth/v1beta1/accounts/${signerAddress}`
  )

  if (!accountRes.ok) {
    throw new Error(
      'Failed to retrieve account from signer: ' + (accountRes.statusText || accountRes.status)
    )
  }
  const accountResJson: IAccount | IEthAccount = await accountRes.json()

  const sequence = Number(
    'base_account' in accountResJson.account
      ? accountResJson.account.base_account.sequence
      : accountResJson.account.sequence
  )
  const accountNumber = Number(
    'base_account' in accountResJson.account
      ? accountResJson.account.base_account.account_number
      : accountResJson.account.account_number
  )

  const accountFromSigner = (await signer.getAccounts()).find(
    (account) => account.address === signerAddress
  )
  if (!accountFromSigner) {
    throw new Error('Failed to retrieve account from signer')
  }
  const pubkeyBytes = accountFromSigner.pubkey

  // Custom typeUrl for EVMOS
  const pubk = Any.fromPartial({
    typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
    value: PubKey.encode({
      key: pubkeyBytes,
    }).finish(),
  })

  const txBodyEncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.TxBody',
    value: {
      messages,
      memo,
    },
  }

  const txBodyBytes = client.registry.encode(txBodyEncodeObject)

  // No gas information needed here
  const authInfoBytes = makeAuthInfoBytes(
    [{ pubkey: pubk, sequence }],
    [], // Empty fee amount because we are not setting gas
    0, // No gas limit needed
    undefined,
    undefined
  )

  const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, defaultChainId, accountNumber)

  const { signature, signed } = await signer.signDirect(signerAddress, signDoc)

  // Return the signed transaction bytes for broadcasting
  return TxRaw.encode({
    bodyBytes: signed.bodyBytes,
    authInfoBytes: signed.authInfoBytes,
    signatures: [fromBase64(signature.signature)],
  }).finish()
}



export async function simulateEvmWithKeplr({
  client, // SigningStargateClient
  signer, // keplr OfflineSigner
  chain,
  signerAddress,
  messages,
  memo,
}: ISimulateProps): Promise<string> {
  // Query account info, because cosmjs doesn't support Evmos account
  const accountRes = await fetch(
    `https://crossfi-testnet-api.polkachu.com/cosmos/auth/v1beta1/accounts/${signerAddress}`
  )

  if (!accountRes.ok) {
    throw new Error(
      'Failed to retrieve account from signer: ' + (accountRes.statusText || accountRes.status)
    )
  }
  const accountResJson: IAccount | IEthAccount = await accountRes.json()

  const sequence = Number(
    'base_account' in accountResJson.account
      ? accountResJson.account.base_account.sequence
      : accountResJson.account.sequence
  )

  const accountFromSigner = (await signer.getAccounts()).find(
    (account) => account.address === signerAddress
  )
  if (!accountFromSigner) {
    throw new Error('Failed to retrieve account from signer')
  }
  const pubkeyBytes = accountFromSigner.pubkey

  // Custom typeUrl for EVMOS
  const pubk = Any.fromPartial({
    typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
    value: PubKey.encode({
      key: pubkeyBytes,
    }).finish(),
  })

  const txBodyEncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.TxBody',
    value: {
      messages: messages,
      memo: memo,
    },
  }

  const anyMsgs = messages.map((m) => client.registry.encodeAsAny(m))

  const tx = Tx.fromPartial({
    authInfo: AuthInfo.fromPartial({
      fee: Fee.fromPartial({}),
      signerInfos: [
        {
          publicKey: pubk,
          sequence,
          modeInfo: { single: { mode: SignMode.SIGN_MODE_UNSPECIFIED } },
        },
      ],
    }),
    body: TxBody.fromPartial({
      messages: Array.from(anyMsgs),
      memo: memo,
    }),
    signatures: [new Uint8Array()],
  })
  const request = SimulateRequest.fromPartial({
    txBytes: Tx.encode(tx).finish(),
  })

  const res = await fetch(
    `https://crossfi-testnet-api.polkachu.com/cosmos/tx/v1beta1/simulate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tx_bytes: toBase64(request.txBytes) }),
    }
  )

  if (!res.ok) {
    console.error('Failed to simulate transaction:', res.statusText)
    throw new Error('Failed to simulate transaction: ' + (res.statusText || res.status))
  }

  const data: {
    gas_info: {
      gas_used: string
      gas_wanted: string
    }
  } = await res.json()

  return data.gas_info.gas_used
}
