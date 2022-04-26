import AddIcon from "@mui/icons-material/Add"
import SettingsIcon from "@mui/icons-material/Settings"
import { FC, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { AccountType } from "../AccountType"
import { Container } from "../components/Account/AccountContainer"
import { AccountHeader } from "../components/Account/AccountHeader"
import { AccountTypeItem } from "../components/Account/AccountTypeItem"
import { BackButton } from "../components/BackButton"
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
    addAccountType(
      new AccountType(
        "default",
        "Default",
        "Argent",
        "v0.0.1",
        ["Default account contract implementation from Argent."],
        "0.50 €",
      ),
    )
    const filteredContract = new AccountType(
      "allow_deny_list",
      "Allowlist & Denylist Account",
      "Team Brevery",
      "v0.0.1",
      ["This account contract has a whitelist and blacklist mechanism with varying levels of degeneracy. Depending on your risk appetite",
      "", "",
      "LEVEL 0: SAFE",
      "- Funds are SAFU",
      "- Can only interact with contracts that are whitelisted and cannot interact with blacklisted (even if mistakenly whitelisted)",
      "",
      "LEVEL 1: DEGEN",
      "- You like to spice things up a bit and have some risks",
      "- Cannot interact with contracts that are blacklisted but there is no whitelist",
      "",
      "LEVEL 2: FULL DEGEN",
      "- YOLO",
      "- You like pain and throwing away money"],
      "0.99 €",
    )
    filteredContract.setIcon(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAT0SURBVFiF7Zd7bFRFFIe/e+/e3aUPWloKFLYPhLa04SmPgFhTKShNUIQQQGvQIASjQCJoBII0YgxFAhpEHjE0NLyioviIgAUMkJZCW3SXYIBSoUuBQKFQoWUf9+4d/yhtWrrtbkHgH3/JJJNzz5nzzZmZmxkITiowP8RqOWVSFLfJpNRbLZbDwMQg49uUFIRPtMWs/t7Jau03b+Y084ghaWiaj32Hio28nT8B/CjglhDCMAwjDzj2XwBYgQwgRVXV7NSkxEH7d64zd+sa1cKpzHGa7LlLvWnJvU0ej2b8drhYNgyxEKgDrgAFgN5RgKlmVV0vEJG943p6IyPC5W82rLAkxsUGnM2yVRv55IvN9IiJdt+sva3KimR3u70Z94CCApgjy/L6nPdmSQvmZEthoSEBkzaXYRhUXblGgi2Wq9U1DBz7qna95lYusKytGKVZP1FR5L0bcxebFszJlsxmtUPJASRJIrJzOABhoSHU3r6jnDh5xqTpel5bMXKz/syUPgnGrNceemMDIISgqNSha7p2oT0/U2PHarWMnjA23SJJLVelorKKwhIHk7IyiAgPa7IfKj7B2Qon/fom8tzIIUiSxHnnZRYu/9wYNihNLiyx+4pKHbqu+1YGRRwa0sm+YvG7QlwubWrVJwtEj5hI0TnULGw9osWmlUvEL/lrxIwpWcKkyOKpXhFCNSlizDNPC6+zWOzdtlbIsiTGjugpoiIsAlgVKK/sz6jrPgpL7Iyb9ja9ohUu/TyeN7NiyF27jkkz36f8TBkHvnyWiu8yObU9kxL7KfYcLALArCoUfDGSoaldBQGOIDRbgkadd15mQOZ0XG4PkzNsbPpwFGGdTCyfncby2WmtBkiKCyM1MYJzF6ron9KnyS6QkGV5oaQo8wAkSfJJilKuuVxLgP1tAlTX3OSuy41zdxZx3TsFmgAAiiKh6y0na0gyA17IUodNntJwnISg4tjRoUfy8/YJw0gHjkIbSwAQ08UMQPnFOgodNS2++bP5093b/3DDWckNZyW3q6/xykcfS4MnvIyiqnMbfVpV4H7l73FiP1fLr6tHt2mLClcpKrVz9XoN0RFWAGTh43zp8ZqLDns1gPdufb/uSclSfP+B8l8HClJ9mka7FWiUEA2tPVvOW8n84bCzecf3rJ7XsE8kwKdrX3vq69I89XVpkizrwjAaQ5rOevMK+DxeDbfHG4iplYandmHGeBv2c7VMzbR1KLapAi63Z+/Kr/L16XMWd5zgIdRUAcMwclxuzxmX2zMKeOdxATTfAz5gG7D1cSW/H+CJ6H+AJw4Q8E/4oBKAYjK9bjJb0wE8rnrT/XeNRwpgSArxgwbbkkaNtgGoViu9hw7n+K5vDZ+mlQcNkDk8hj620AeyRcXFk5KeAYAQBvvXr6Vs9y6EYWxs9PF3LR8JFN89NBGrWfHzOTiNW1AiDh671DS+JEmGarH87XW7FwE/NNof2RLICIBcYDE0XFK9bncrP38AAmD8B2XIAR5usd1C2ZDzPGu2/MnAlK707xvF/E+P4NV8OM7WBPPs8wvgBKiLHU7X+IT2oxMS2W57g/oXj3M6tidVUdGEjduC7nZzx/6ZAVQGAvBLabJY9kT17DXmpUVLLSGRXQKN0UI+XaN4x1b9ZMG+Op+mJQPXOzTAPUUoqrrZZDbX0rAkQTdZUTyq1VoIDAgm0b9LlO5POUUEggAAAABJRU5ErkJggg==",
    )
    addAccountType(filteredContract)
    addAccountType(
      new AccountType(
        "multisig",
        "Multisignature Account",
        "Team",
        "v0.0.1",
        ["Multi-signature account contract."],
        "1.99 €",
      ),
    )
    addAccountType(
      new AccountType(
        "custom_crypto",
        "Custom Cryptographic Digital Signature Account",
        "TBD",
        "v0.0.1",
        ["This account contract allows you to use other digital signature methods."],
        "2.30 €",
      ),
    )
    addAccountType(
      new AccountType(
        "new",
        "new",
        "",
        "v0.0.1",
        ["Import your own account contract"],
        "",
      ),
    )
    const fee_insurant = new AccountType(
      "fee_insurant",
      "Fee Insurant Account",
      "Team Brevery",
      "v0.0.1",
      ["The wallet buys an insurance from a \"fee insurance contract\" that guarantees that the next \"compute units (gas)\" will have a fixed cost each. The wallet then proceeds to operate as usual. Every time it makes a transaction the insurance contract reimburses the transaction costs (until the contract expires)."],
      "1,19 €",
    )
    fee_insurant.setIcon(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAT0SURBVFiF7Zd7bFRFFIe/e+/e3aUPWloKFLYPhLa04SmPgFhTKShNUIQQQGvQIASjQCJoBII0YgxFAhpEHjE0NLyioviIgAUMkJZCW3SXYIBSoUuBQKFQoWUf9+4d/yhtWrrtbkHgH3/JJJNzz5nzzZmZmxkITiowP8RqOWVSFLfJpNRbLZbDwMQg49uUFIRPtMWs/t7Jau03b+Y084ghaWiaj32Hio28nT8B/CjglhDCMAwjDzj2XwBYgQwgRVXV7NSkxEH7d64zd+sa1cKpzHGa7LlLvWnJvU0ej2b8drhYNgyxEKgDrgAFgN5RgKlmVV0vEJG943p6IyPC5W82rLAkxsUGnM2yVRv55IvN9IiJdt+sva3KimR3u70Z94CCApgjy/L6nPdmSQvmZEthoSEBkzaXYRhUXblGgi2Wq9U1DBz7qna95lYusKytGKVZP1FR5L0bcxebFszJlsxmtUPJASRJIrJzOABhoSHU3r6jnDh5xqTpel5bMXKz/syUPgnGrNceemMDIISgqNSha7p2oT0/U2PHarWMnjA23SJJLVelorKKwhIHk7IyiAgPa7IfKj7B2Qon/fom8tzIIUiSxHnnZRYu/9wYNihNLiyx+4pKHbqu+1YGRRwa0sm+YvG7QlwubWrVJwtEj5hI0TnULGw9osWmlUvEL/lrxIwpWcKkyOKpXhFCNSlizDNPC6+zWOzdtlbIsiTGjugpoiIsAlgVKK/sz6jrPgpL7Iyb9ja9ohUu/TyeN7NiyF27jkkz36f8TBkHvnyWiu8yObU9kxL7KfYcLALArCoUfDGSoaldBQGOIDRbgkadd15mQOZ0XG4PkzNsbPpwFGGdTCyfncby2WmtBkiKCyM1MYJzF6ron9KnyS6QkGV5oaQo8wAkSfJJilKuuVxLgP1tAlTX3OSuy41zdxZx3TsFmgAAiiKh6y0na0gyA17IUodNntJwnISg4tjRoUfy8/YJw0gHjkIbSwAQ08UMQPnFOgodNS2++bP5093b/3DDWckNZyW3q6/xykcfS4MnvIyiqnMbfVpV4H7l73FiP1fLr6tHt2mLClcpKrVz9XoN0RFWAGTh43zp8ZqLDns1gPdufb/uSclSfP+B8l8HClJ9mka7FWiUEA2tPVvOW8n84bCzecf3rJ7XsE8kwKdrX3vq69I89XVpkizrwjAaQ5rOevMK+DxeDbfHG4iplYandmHGeBv2c7VMzbR1KLapAi63Z+/Kr/L16XMWd5zgIdRUAcMwclxuzxmX2zMKeOdxATTfAz5gG7D1cSW/H+CJ6H+AJw4Q8E/4oBKAYjK9bjJb0wE8rnrT/XeNRwpgSArxgwbbkkaNtgGoViu9hw7n+K5vDZ+mlQcNkDk8hj620AeyRcXFk5KeAYAQBvvXr6Vs9y6EYWxs9PF3LR8JFN89NBGrWfHzOTiNW1AiDh671DS+JEmGarH87XW7FwE/NNof2RLICIBcYDE0XFK9bncrP38AAmD8B2XIAR5usd1C2ZDzPGu2/MnAlK707xvF/E+P4NV8OM7WBPPs8wvgBKiLHU7X+IT2oxMS2W57g/oXj3M6tidVUdGEjduC7nZzx/6ZAVQGAvBLabJY9kT17DXmpUVLLSGRXQKN0UI+XaN4x1b9ZMG+Op+mJQPXOzTAPUUoqrrZZDbX0rAkQTdZUTyq1VoIDAgm0b9LlO5POUUEggAAAABJRU5ErkJggg==",
    )
    addAccountType(fee_insurant)
    addAccountType(new AccountType(
      "deadman_switch",
      "Deadman Switch",
      "TBD",
      "v0.0.1",
      ["Specify a time range and an address.",
      "If you not making a transaction in this period, all your funds are sent to the given address"],
      "19,99 €",
    ))
  }, [])

  const handleAddAccountType = async () => {
    useAppState.setState({ isLoading: false })
    console.log("handling")
    useAccountType.setState({ selectedAccountType: "new" })
    navigate(routes.accountTypeInformation())
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
      <H1>Account contract store</H1>
      <AccountList>
        {accountTypeList.length === 0 && (
          <Paragraph>No accounts types available.</Paragraph>
        )}
        {accountTypeList
          .filter((acc) => acc.name != "new")
          .map((accountType) => (
            <AccountTypeItem key={accountType.name} accountType={accountType} />
          ))}
        <IconButtonCenter size={48} {...makeClickable(handleAddAccountType)}>
          <AddIcon fontSize="large" />
        </IconButtonCenter>
      </AccountList>
    </AccountListWrapper>
  )
}
