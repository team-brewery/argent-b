export class AccountType {
  key: string
  name: string
  creator: string
  version: string
  description: string
  icon: string
  // contract: Contract
  // proxyContract: Contract

  constructor(
    key: string,
    name: string,
    creator: string,
    version: string,
    description: string
  ) {
    this.key = key
    this.name = name
    this.creator = creator
    this.version = version
    this.description = description
    this.icon = ""
  }

  setIcon(icon: string) {
    this.icon = icon
  }
}
