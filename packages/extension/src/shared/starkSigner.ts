import Eth from "@ledgerhq/hw-app-eth"
import TransportWebHID from "@ledgerhq/hw-transport-webhid"
import { KeyPair, ec } from "starknet"

export enum StarkSignerType {
  KeyPair,
  Ledger,
}

export interface Signature {
  r: string
  s: string
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

  async getEthApp(): Promise<Eth> {
    console.log("isSupported", await TransportWebHID.isSupported())

    const transport = await TransportWebHID.create()
    return new Eth(transport)
  }

  async connect(): Promise<string> {
    const eth = await this.getEthApp()

    const response = await eth.starkGetPublicKey(this.derivationPath)
    this.starkPub = `0x${response.slice(1, 1 + 32).toString("hex")}`

    return this.starkPub
  }

  async sign(messageHash: string): Promise<Signature> {
    const eth = await this.getEthApp()

    const signature = (await eth.starkUnsafeSign(
      this.derivationPath,
      messageHash,
    )) as Signature

    return signature
  }

  static async askPermissionIfNeeded(): Promise<void> {
    const transport = await TransportWebHID.create()
    await transport.close()
  }
}
