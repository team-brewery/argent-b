import AddIcon from "@mui/icons-material/Add"
import SettingsIcon from "@mui/icons-material/Settings"
import { FC, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { Container } from "../components/Account/AccountContainer"
import { AccountHeader } from "../components/Account/AccountHeader"
import { AccountTypeItem } from "../components/Account/AccountTypeItem"
import { Header } from "../components/Header"
import { IconButton } from "../components/IconButton"
import { NetworkSwitcher } from "../components/NetworkSwitcher"
import { RecoveryBanner } from "../components/RecoveryBanner"
import { H1, P } from "../components/Typography"
import { routes } from "../routes"
import { useAccountType } from "../states/accountType"
import { useAppState } from "../states/app"
import { useBackupRequired } from "../states/backupDownload"
import { makeClickable } from "../utils/a11y"
import { connectAccount, deployAccount, getStatus } from "../utils/accounts"
import { recover } from "../utils/recovery"
import { AccountType } from "../AccountType"

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

export const AccountTypeSelectionScreen: FC = () => {
  const navigate = useNavigate()
  const { accountTypes, addAccountType } = useAccountType()
  const { isBackupRequired } = useBackupRequired()

  const accountTypeList = Object.values(accountTypes)

  useEffect(() => {
    addAccountType(new AccountType(0, "Multisig"))
    addAccountType(new AccountType(1, "Filtered Contracts"))
    addAccountType(new AccountType(2, "secp256k1 signing"))
    addAccountType(new AccountType(3, "Fee delegation"))
    addAccountType(new AccountType(4, "Debit wallet"))
  }, []);

  const handleAddAccount = async () => {
    useAppState.setState({ isLoading: false })
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
            <SettingsIcon />
          </IconButton>
          <NetworkSwitcher />
        </Header>
      </AccountHeader>
      <H1>Account Type Selection</H1>
      <AccountList>
        {isBackupRequired && <RecoveryBanner noMargins />}
        {accountTypeList.length === 0 && (
          <Paragraph>
            No accounts types available.
          </Paragraph>
        )}
        {accountTypeList.map((accountType) => (
          <AccountTypeItem
            key={accountType.id}
            accountType={accountType}
          />
        ))}
        <IconButtonCenter size={48} {...makeClickable(handleAddAccount)}>
          <AddIcon fontSize="large" />
        </IconButtonCenter>
      </AccountList>
    </AccountListWrapper>
  )
}
