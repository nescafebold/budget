// src/types/index.ts
export type WalletType = "basic" | "credit" | "saving" | "linked";
export type CategoryType = "income" | "expense" | "debt/loan";
export type TransactionType = "income" | "expense" | "debt/load" | "transfer";
export type Frequency = "daily" | "weekly" | "monthly" | "yearly";
export type Currency = "PHP" | "USD";

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  fullName: string | null;
  currency: string;
}

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  type: WalletType;
  currency: Currency;
  amount: number;
  goal_amount: number;
  goal_date: string;
  isIncluded: boolean;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  categoryId: string;
  category?: Category;
  type: TransactionType;
  amount: number;
  description: string | null;
  date: string;
  isRecurring: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amountLimit: number;
  spent?: number;
  month: number;
  year: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
}
