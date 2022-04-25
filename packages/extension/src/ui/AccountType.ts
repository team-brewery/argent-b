export class AccountType {
  id: number
  name: string
  // contract: Contract
  // proxyContract: Contract

  constructor(
    id: number,
    name: string,
  ) {
    this.id = id
    this.name = name
    // this.contract = new Contract(
    //   ArgentCompiledContractJson.abi,
    //   address,
    //   this.provider,
    // )
    // this.proxyContract = new Contract(
    //   ProxyCompiledContractJson.abi,
    //   address,
    //   this.provider,
    // )
  }
}
