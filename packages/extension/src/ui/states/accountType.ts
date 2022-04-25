import create from "zustand"

import { AccountType } from "../AccountType"

interface State {
  accountTypes: Record<string, AccountType>
  addAccountType: (newAccountType: AccountType) => void
  selectedAccountType?: string
}

export const useAccountType = create<State>((set) => ({
  accountTypes: {},
  selectedAccountType: undefined,
  addAccountType: (newAccountType: AccountType) =>
    set((state) => ({
      accountTypes: {
        ...state.accountTypes,
        [newAccountType.name]: newAccountType,
      },
    })),
}))

export const selectAccountType = ({ accountTypes, selectedAccountType }: State) => {
  console.log(selectedAccountType)
  if (selectedAccountType) {
    return accountTypes[selectedAccountType]
  }
}
