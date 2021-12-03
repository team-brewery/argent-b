import { StarkSignerType } from "./starkSigner"

export interface BackupWallet {
  address: string
  network: string
  type: StarkSignerType
}
