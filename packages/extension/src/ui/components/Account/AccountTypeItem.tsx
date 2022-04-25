import { FC } from "react"
import { useNavigate } from "react-router-dom"
import styled, { css } from "styled-components"

import { AccountType } from "../../AccountType"
import { routes } from "../../routes"
import { useAccountType } from "../../states/accountType"
import { makeClickable } from "../../utils/a11y"
import { getAccountTypeImageUrl } from "../../utils/accountTypes"
import { NetworkStatusWrapper } from "../NetworkSwitcher"
import { AccountColumn } from "./AccountColumn"
import { AccountRow } from "./AccountRow"
import { ProfilePicture } from "./ProfilePicture"

export const DeleteAccountButton = styled(NetworkStatusWrapper)`
  display: none;
`

export const AccountListItemWrapper = styled.div<{
  selected?: boolean
}>`
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 20px 16px;

  display: flex;
  gap: 12px;
  align-items: center;

  transition: all 200ms ease-in-out;

  ${({ selected = false }) =>
    selected &&
    css`
      border: 1px solid rgba(255, 255, 255, 0.3);
    `}

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.15);
    outline: 0;

    &.deleteable ${NetworkStatusWrapper} {
      display: none;
    }
    &.deleteable ${DeleteAccountButton} {
      display: flex;
    }
  }
`

const AccountStatusText = styled.p`
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
  text-align: center;
`

const AccountName = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 18px;
  margin: 0 0 5px 0;
`

interface AccountListProps {
  accountType: AccountType
}

export const AccountTypeItem: FC<AccountListProps> = ({ accountType }) => {
  const navigate = useNavigate()

  return (
    <AccountListItemWrapper
      {...makeClickable(() => {
        useAccountType.setState({ selectedAccountType: accountType.name })
        navigate(routes.accountTypeInformation())
      })}
      // className={isDeleteable ? "deleteable" : ""}
      // selected={status.code === "CONNECTED"}
    >
      {accountType.icon !== "" ? (
        <ProfilePicture src={accountType.icon} />
      ) : (
        <ProfilePicture src={getAccountTypeImageUrl(accountType.name)} />
      )}
      <AccountRow>
        <AccountColumn>
          <AccountName>{accountType.name}</AccountName>
          <p>{accountType.creator}</p>
        </AccountColumn>
      </AccountRow>
    </AccountListItemWrapper>
  )
}
