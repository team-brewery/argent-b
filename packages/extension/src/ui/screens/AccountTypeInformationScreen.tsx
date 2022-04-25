import { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Abi, CompiledContract, json } from "starknet"
import styled from "styled-components"

import MultisigSource from "../../abi/Multisig.json"
import DefaultSource from "../../abi/Default.json"
import { AccountType } from "../AccountType"
import { Container } from "../components/Account/AccountContainer"
import { AccountHeader } from "../components/Account/AccountHeader"
import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { IconButton } from "../components/IconButton"
import { BackButton } from "../components/BackButton"
import { NetworkSwitcher } from "../components/NetworkSwitcher"
import { H1, P } from "../components/Typography"
import { useContractFactory } from "../hooks/useDeploy"
import { routes } from "../routes"
import { useSelectedAccount } from "../states/account"
import { selectAccountType, useAccountType } from "../states/accountType"
import { useAppState } from "../states/app"
import { useBackupRequired } from "../states/backupDownload"
import { makeClickable } from "../utils/a11y"

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

  const [compiledMultisig, setCompiledMultisig] = useState<CompiledContract>()
  const { deploy: deployMultisig } = useContractFactory({
    compiledContract: compiledMultisig,
    abi: (MultisigSource as any).abi as Abi,
  })
  const getCompiledMultisig = async () => {
    const raw = await fetch(
      "https://raw.githubusercontent.com/team-brewery/argent-b/feature/account-selection/packages/extension/src/abi/Multisig.json",
    )
    console.log("raw", raw)
    const compiled = json.parse(await raw.text())
    console.log("found compiled", compiled)
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

  const accountType = useAccountType(selectAccountType)

  useEffect(() => {
    if (!accountType) {
      navigate(routes.accountTypeSelection())
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

  const deployWalletAccount = async () => {
    //useAppState.setState({ isLoading: true })

    console.log(accountType.name)

    switch (accountType.key) {
      case "default": {
        const calldataDefault = ["1", "2", "3"]
        console.log("starting deploy")
        const defaultDeployment = await deployDefault({
          constructorCalldata: calldataDefault,
        })
        if (defaultDeployment) {
          console.log("deployed to", defaultDeployment.address)
        }
        break
      }
      case "multisig": {
        const calldataMultisig = ["1", "2", "3"]
        console.log("starting deploy")
        const multisigDeployment = await deployMultisig({
          constructorCalldata: calldataMultisig,
        })
        if (multisigDeployment) {
          console.log("deployed to", multisigDeployment.address)
        }
        break
      }
      default: {
        break
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
        <Paragraph>{accountType.name}</Paragraph>
        <Button onClick={() => deployWalletAccount()}>
          Deploy Wallet Account
        </Button>
      </AccountList>
    </AccountListWrapper>
  )
}
