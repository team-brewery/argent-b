export class AccountType {
  name: string
  creator: string
  version: string
  description: string
  icon: string
  // contract: Contract
  // proxyContract: Contract

  constructor(
    name: string,
    creator: string,
    version: string,
    description: string
  ) {
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
