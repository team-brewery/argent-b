import create from "zustand"

import { AccountType } from "../AccountType"

interface State {
  accountTypes: Record<string, AccountType>
  addAccountType: (newAccountType: AccountType) => void
}

export const useAccountType = create<State>((set) => ({
  accountTypes: {},
  addAccountType: (newAccountType: AccountType) =>
    set((state) => ({
      accountTypes: {
        ...state.accountTypes,
        [newAccountType.name]: newAccountType,
      },
    })),
}))
