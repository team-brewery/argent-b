import SettingsIcon from "@mui/icons-material/Settings"
import { FC, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { Container } from "../components/Account/AccountContainer"
import { AccountHeader } from "../components/Account/AccountHeader"
import { Header } from "../components/Header"
import { IconButton } from "../components/IconButton"
import { NetworkSwitcher } from "../components/NetworkSwitcher"
import { H1, H2, P } from "../components/Typography"
import { routes } from "../routes"
import { useAccountType, selectAccountType } from "../states/accountType"
import { useAppState } from "../states/app"
import { useBackupRequired } from "../states/backupDownload"
import { makeClickable } from "../utils/a11y"
import { AccountType } from "../AccountType"
import { Button } from "../components/Button"
import { BackButton } from "../components/BackButton"

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
  const accountType = useAccountType(selectAccountType)

  useEffect(() => {
    if (!accountType) {
      navigate(routes.accountTypeSelection())
    }
  }, [])

  if (!accountType) {
    return <>aaa</>
  }

  return <AccountTypeInformationContentScreen accountType={accountType} />
}

interface AccountTypeInformationScreenContentProps {
  accountType: AccountType
}

export const AccountTypeInformationContentScreen: FC<AccountTypeInformationScreenContentProps> = ({ accountType }) => {
  const navigate = useNavigate()
  const { isBackupRequired } = useBackupRequired()

  const deployWalletAccount = async () => {
    useAppState.setState({ isLoading: true })

    const accountType = useAccountType(selectAccountType)
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
          <H2>{accountType.name}</H2>
          <h3>{accountType.creator}</h3>
          {accountType.description}
        </Paragraph>
        <Button onClick={() => deployWalletAccount()}>
          Deploy Wallet Account
        </Button>
      </AccountList>
    </AccountListWrapper>
  )
}
