export class AccountType {
  key: string
  name: string
  creator: string
  version: string
  description: string[]
  icon: string
  price: string
  // contract: Contract
  // proxyContract: Contract

  constructor(
    key: string,
    name: string,
    creator: string,
    version: string,
    description: string[],
    price: string,
  ) {
    this.key = key
    this.name = name
    this.creator = creator
    this.version = version
    this.description = description
    this.icon = ""
    this.price = price
  }

  setIcon(icon: string) {
    this.icon = icon
  }
}
