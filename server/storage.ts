import { 
  users, 
  accounts, 
  transactions, 
  balanceHistory, 
  userAuditLogs,
  type User, 
  type SafeUser,
  type InsertUser,
  type Account,
  type InsertAccount,
  type Transaction,
  type InsertTransaction,
  type BalanceHistory,
  type UserAuditLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Account management
  getAccountsByUserId(userId: number): Promise<Account[]>;
  createAccount(insertAccount: InsertAccount & { userId: number }): Promise<Account>;
  updateAccount(id: number, updates: Partial<Account>): Promise<Account>;
  
  // Transaction management
  getRecentTransactions(userId: number, limit: number): Promise<Transaction[]>;
  createTransaction(insertTransaction: InsertTransaction & { userId: number }): Promise<Transaction>;
  
  // Balance history
  getBalanceHistory(userId: number): Promise<BalanceHistory[]>;
  createBalanceHistory(userId: number, totalBalance: string): Promise<BalanceHistory>;
  
  // Audit logging
  createAuditLog(auditLog: Omit<UserAuditLog, 'id' | 'createdAt'>): Promise<UserAuditLog>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      and(
        eq(users.passwordResetToken, token),
        // Token should not be expired (assuming passwordResetExpires is set)
      )
    );
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Account management
  async getAccountsByUserId(userId: number): Promise<Account[]> {
    return await db.select().from(accounts).where(eq(accounts.userId, userId));
  }

  async createAccount(insertAccount: InsertAccount & { userId: number }): Promise<Account> {
    const [account] = await db
      .insert(accounts)
      .values(insertAccount)
      .returning();
    return account;
  }

  async updateAccount(id: number, updates: Partial<Account>): Promise<Account> {
    const [account] = await db
      .update(accounts)
      .set(updates)
      .where(eq(accounts.id, id))
      .returning();
    return account;
  }

  // Transaction management
  async getRecentTransactions(userId: number, limit: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async createTransaction(insertTransaction: InsertTransaction & { userId: number }): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  // Balance history
  async getBalanceHistory(userId: number): Promise<BalanceHistory[]> {
    return await db
      .select()
      .from(balanceHistory)
      .where(eq(balanceHistory.userId, userId))
      .orderBy(desc(balanceHistory.date));
  }

  async createBalanceHistory(userId: number, totalBalance: string): Promise<BalanceHistory> {
    const [history] = await db
      .insert(balanceHistory)
      .values({
        userId,
        totalBalance,
        date: new Date(),
      })
      .returning();
    return history;
  }

  // Audit logging
  async createAuditLog(auditLog: Omit<UserAuditLog, 'id' | 'createdAt'>): Promise<UserAuditLog> {
    const [log] = await db
      .insert(userAuditLogs)
      .values(auditLog)
      .returning();
    return log;
  }
}

export const storage = new DatabaseStorage();