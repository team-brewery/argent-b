import { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Abi, CompiledContract, Contract, json } from "starknet"
import styled from "styled-components"

import AllowDenySource from "../../abi/AllowDeny.json"
import DefaultSource from "../../abi/Default.json"
import MultisigSource from "../../abi/Multisig.json"
import { WalletAccountSigner } from "../../shared/wallet.model"
import { Account } from "../Account"
import { AccountType } from "../AccountType"
import { Container } from "../components/Account/AccountContainer"
import { AccountHeader } from "../components/Account/AccountHeader"
import { BackButton } from "../components/BackButton"
import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { IconButton } from "../components/IconButton"
import { NetworkSwitcher } from "../components/NetworkSwitcher"
import { H1, H2, P } from "../components/Typography"
import { useContractFactory } from "../hooks/useDeploy"
import { routes } from "../routes"
import { useAccount, useSelectedAccount } from "../states/account"
import { selectAccountType, useAccountType } from "../states/accountType"
import { useAppState } from "../states/app"
import { useBackupRequired } from "../states/backupDownload"
import { makeClickable } from "../utils/a11y"
import { getNetwork } from "../utils/messaging"

const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px 32px;
`

const AccountListWrapper = styled(Container)`
  display: flex;
  flex-direction: column;

  ${H1} {
    text-align: center;
  }

  > ${AccountList} {
    width: 100%;
  }
`

const IconButtonCenter = styled(IconButton)`
  margin: auto;
`

const Paragraph = styled(P)`
  text-align: center;
`

export const AccountTypeInformationScreen: FC = () => {
  const navigate = useNavigate()

  return <AccountTypeInformationContentScreen />
}

export const AccountTypeInformationContentScreen: FC = () => {
  const navigate = useNavigate()

  const { isBackupRequired } = useBackupRequired()

  const { accounts, selectedAccount, addAccount } = useAccount()
  const { switcherNetworkId } = useAppState()

  const [usedParams, setUsedParams] = useState<string[]>([])
  const [usedParamNames, setUsedParamNamess] = useState<string[]>([])
  const [compiledMultisig, setCompiledMultisig] = useState<CompiledContract>()
  const { deploy: deployMultisig } = useContractFactory({
    compiledContract: compiledMultisig,
    abi: (MultisigSource as any).abi as Abi,
  })
  const getCompiledMultisig = async () => {
    const raw = await fetch(
      "https://raw.githubusercontent.com/team-brewery/argent-b/feature/account-selection/packages/extension/src/abi/Multisig.json",
    )
    const compiled = json.parse(await raw.text())
    return compiled
  }

  const [compiledDefault, setCompiledDefault] = useState<CompiledContract>()
  const { deploy: deployDefault } = useContractFactory({
    compiledContract: compiledDefault,
    abi: (DefaultSource as any).abi as Abi,
  })
  const getCompiledDefault = async () => {
    const raw = await fetch(
      "https://raw.githubusercontent.com/team-brewery/argent-b/feature/account-selection/packages/extension/src/abi/Default.json",
    )
    const compiled = json.parse(await raw.text())
    return compiled
  }

  const [compiledAllowDeny, setCompiledAllowDeny] = useState<CompiledContract>()
  const { deploy: deployAllowDeny } = useContractFactory({
    compiledContract: compiledAllowDeny,
    abi: (AllowDenySource as any).abi as Abi,
  })
  const getCompiledAllowDeny = async () => {
    const raw = await fetch(
      "https://raw.githubusercontent.com/team-brewery/argent-b/feature/account-selection/packages/extension/src/abi/AllowDeny.json",
    )
    const compiled = json.parse(await raw.text())
    return compiled
  }

  const accountType = useAccountType(selectAccountType)
  //console.log("accountType", accountType)

  useEffect(() => {
    if (!accountType) {
      navigate(routes.accountTypeSelection())
    } else {
      switch (accountType.key) {
        case "default": {
          setUsedParams(["123"])
          setUsedParamNamess(["Public key"])
          break
        }
        case "multisig": {
          setUsedParams(["1", "123", "1"])
          setUsedParamNamess(["Amount of owners", "Owners", "Threshold"])
          break
        }
        case "allow_deny_list": {
          setUsedParams(["123"])
          setUsedParamNamess(["Public key"])
          break
        }
        case "fee_insurant": {
          setUsedParams(["123"])
          setUsedParamNamess(["Public key"])
          break
        }
        case "custom_crypto": {
          setUsedParams(["123"])
          setUsedParamNamess(["Public key"])
          break
        }
        case "new": {
          setUsedParams([""])
          setUsedParamNamess(["Parameters"])
          break
        }
      }
    }
    if (!compiledAllowDeny) {
      getCompiledAllowDeny().then(setCompiledAllowDeny)
    }
    if (!compiledMultisig) {
      getCompiledMultisig().then(setCompiledMultisig)
    }
    if (!compiledDefault) {
      getCompiledDefault().then(setCompiledDefault)
    }
  }, [])

  if (!accountType) {
    return <></>
  }

  const modifyParam = async (index: number, value: string) => {
    const copy = [...usedParams]
    copy[index] = value
    setUsedParams(copy)
  }

  const createAccount = async (contract: Contract) => {
    const network = await getNetwork(switcherNetworkId)
    if (network) {
      const dummySigner: WalletAccountSigner = {
        type: "",
        derivationPath: "",
      }

      const acc = new Account(
        contract.address,
        network,
        dummySigner, //result.account.signer,
        contract.txHash,
      )
      addAccount(acc)
    }
  }

  const deployWalletAccount = async () => {
    useAppState.setState({ isLoading: true })

    console.log(accountType.name)
    if (usedParams) {
      let currDeployment: Contract | undefined = undefined
      switch (accountType.key) {
        case "default": {
          console.log("starting deploy")
          currDeployment = await deployDefault({
            constructorCalldata: usedParams,
          })
          if (currDeployment) {
            console.log("deployed to", currDeployment.address)
            createAccount(currDeployment)
            useAppState.setState({ isLoading: false })
            navigate(routes.accounts())
          }

          break
        }
        case "multisig": {
          console.log("starting deploy")
          currDeployment = await deployMultisig({
            constructorCalldata: usedParams,
          })

          if (currDeployment) {
            console.log("deployed to", currDeployment.address, currDeployment)
            createAccount(currDeployment)
            useAppState.setState({ isLoading: false })
            navigate(routes.accounts())
          }
          break
        }
        case "allow_deny_list": {
          console.log("starting deploy")
          currDeployment = await deployAllowDeny({
            constructorCalldata: usedParams,
          })

          if (currDeployment) {
            console.log("deployed to", currDeployment.address)
            createAccount(currDeployment)
            useAppState.setState({ isLoading: false })
            navigate(routes.accounts())
          }
          break
        }
        default: {
          break
        }
      }
    }

    // deploy accountType

    // try {
    //   const newAccount = await deployAccount(switcherNetworkId)
    //   addAccount(newAccount)
    //   connectAccount(newAccount)
    //   navigate(await recover())
    // } catch (error: any) {
    //   useAppState.setState({ error: `${error}` })
    //   navigate(routes.error())
    // } finally {
    //   useAppState.setState({ isLoading: false })
    // }
  }

  return (
    <AccountListWrapper header>
      <AccountHeader>
        <Header>
          <IconButton
            size={36}
            {...makeClickable(() => navigate(routes.settings()), 99)}
          >
            <BackButton />
          </IconButton>
          <NetworkSwitcher />
        </Header>
      </AccountHeader>
      <H1>Account Type Selection</H1>
      <AccountList>
        <Paragraph>
          <b>{accountType.name}</b>
          <br />
          {accountType.description}
        </Paragraph>
        <Paragraph>
          <>
            {usedParams &&
              usedParams.map((p, i) => (
                <span key={i}>
                  <span>{usedParamNames[i]}:&nbsp;</span>
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => {
                      modifyParam(i, e.target.value)
                    }}
                  ></input>
                  <br />
                </span>
              ))}
            {accountType.key == "new" && (
              <>
                <div style={{ marginTop: "10p" }}>
                  <span>Source code:</span>
                  <textarea rows={5}></textarea>
                </div>
                <div style={{ marginTop: "10p" }}>
                  <span>ABI:</span>
                  <textarea rows={5}></textarea>
                </div>
              </>
            )}
          </>
        </Paragraph>
        <Button onClick={() => deployWalletAccount()}>
          Deploy Wallet Account
        </Button>
      </AccountList>
    </AccountListWrapper>
  )
}
