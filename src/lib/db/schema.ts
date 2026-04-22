import {
  pgTable,
  uuid,
  varchar,
  decimal,
  boolean,
  integer,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const providerEnum = pgEnum("provider", [
  "google",
  "github",
  "credentials",
]);

export const walletTypeEnum = pgEnum("wallet_type", [
  "basic",
  "credit",
  "saving",
  "linked",
]);
export const categoryTypeEnum = pgEnum("category_type", [
  "income",
  "expense",
  "debt/loan",
]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
  "debt/load",
  "transfer",
]);
export const frequencyEnum = pgEnum("frequency", [
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);
export const currencyEnum = pgEnum("currency", ["PHP", "USD"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }),
  currency: varchar("currency", { length: 10 }).default("PHP"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, {
    onDelete: "cascade",
  }),
  token: varchar("refresh_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  isRevoked: boolean("is_revoked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const wallets = pgTable("wallets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  type: walletTypeEnum("type").notNull(),
  currency: currencyEnum("currency").default("PHP").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  goal_amount: decimal("goal_amount", { precision: 12, scale: 2 }).notNull(),
  goal_date: date("goal_date").notNull(),
  isIncluded: boolean("isIncluded").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  type: categoryTypeEnum("type").notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  walletId: uuid("wallet_id").references(() => wallets.id),
  categoryId: uuid("category_id").references(() => categories.id),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: varchar("description", { length: 255 }),
  date: date("date").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const budgets = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id),
  amountLimit: decimal("amount_limit", { precision: 12, scale: 2 }).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savingsGoals = pgTable("savings_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }),
  currentAmount: decimal("current_amount", { precision: 12, scale: 2 }).default(
    "0",
  ),
  targetDate: date("target_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recurringTransactions = pgTable("recurring_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  description: varchar("description", { length: 255 }),
  frequency: frequencyEnum("frequency").notNull(),
  nextDueDate: date("next_due_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});


export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type RefreshToken = InferSelectModel<typeof refreshTokens>;