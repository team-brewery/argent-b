export class AccountType {
  name: string
  // contract: Contract
  // proxyContract: Contract

  constructor(
    name: string,
  ) {
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
