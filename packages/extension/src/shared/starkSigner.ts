import { BigNumber } from "@ethersproject/bignumber"
import { hexZeroPad } from "@ethersproject/bytes"
import Eth from "@ledgerhq/hw-app-eth"
import Transport from "@ledgerhq/hw-transport"
import TransportWebHID from "@ledgerhq/hw-transport-webhid"
import { KeyPair, ec } from "starknet"

export enum StarkSignerType {
  KeyPair,
  Ledger,
}

export interface Signature {
  r: BigNumber
  s: BigNumber
}

export interface StarkSigner {
  type: StarkSignerType
  starkPub: string
  connect: () => Promise<string>
  sign: (messageHash: string) => Promise<Signature>
}

export class KeyPairSigner implements StarkSigner {
  type = StarkSignerType.KeyPair
  starkKeyPair: KeyPair
  starkPub: string

  constructor(seed: String) {
    this.starkKeyPair = ec.getKeyPair(seed)
    this.starkPub = ec.getStarkKey(this.starkKeyPair)
  }

  async connect(): Promise<string> {
    return this.starkPub
  }

  sign(messageHash: string): Promise<Signature> {
    return Promise.resolve(ec.sign(this.starkKeyPair, messageHash))
  }
}

export class LedgerSigner implements StarkSigner {
  type = StarkSignerType.Ledger
  derivationPath = "/2645'/579218131'/1148870696'/0'/0'/0"
  starkPub: string = ""
  static transport: Transport

  static async getEthApp(): Promise<Eth> {
    console.log("isSupported", await TransportWebHID.isSupported())
    if (!this.transport) {
      console.log("create TransportWebHID")
      this.transport = await TransportWebHID.create()
    }
    return new Eth(this.transport)
  }

  async connect(): Promise<string> {
    const eth = await LedgerSigner.getEthApp()

    const response = await eth.starkGetPublicKey(this.derivationPath)
    this.starkPub = `0x${response.slice(1, 1 + 32).toString("hex")}`

    return this.starkPub
  }

  async sign(messageHash: string): Promise<Signature> {
    const eth = await LedgerSigner.getEthApp()

    const signature = (await eth.starkUnsafeSign(
      this.derivationPath,
      hexZeroPad(messageHash, 32),
    )) as { r: string; s: string }

    return {
      r: BigNumber.from(`0x${signature.r}`),
      s: BigNumber.from(`0x${signature.s}`),
    }
  }

  static async askPermissionIfNeeded(): Promise<void> {
    const transport = await TransportWebHID.create()
    await transport.close()
  }
}
