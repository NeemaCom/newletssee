import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "cush-platform-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Create default accounts
      await storage.createAccount({
        userId: user.id,
        name: "Current Account",
        type: "current",
        balance: "2340.50",
      });

      await storage.createAccount({
        userId: user.id,
        name: "Savings Account",
        type: "savings",
        balance: "6700.00",
      });

      await storage.createAccount({
        userId: user.id,
        name: "Investment Account",
        type: "investment",
        balance: "12450.75",
      });

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username, name: user.name, email: user.email });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username, name: user.name, email: user.email });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, username: user.username, name: user.name, email: user.email });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Dashboard data
  app.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      const accounts = await storage.getAccountsByUserId(userId);
      const recentTransactions = await storage.getRecentTransactions(userId, 10);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Calculate totals
      const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
      const currentAccount = accounts.find(a => a.type === "current");
      const savingsAccount = accounts.find(a => a.type === "savings");
      const investmentAccount = accounts.find(a => a.type === "investment");

      // Calculate monthly stats (mock data for now)
      const monthlyIncome = 2520.00;
      const monthlyExpenses = 1850.00;
      const monthlySavings = monthlyIncome - monthlyExpenses;

      const dashboardData = {
        user: {
          name: user.name,
          email: user.email,
          initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        },
        accounts: {
          current: parseFloat(currentAccount?.balance || "0"),
          savings: parseFloat(savingsAccount?.balance || "0"),
          investment: parseFloat(investmentAccount?.balance || "0"),
          total: totalBalance,
        },
        monthlyStats: {
          income: monthlyIncome,
          expenses: monthlyExpenses,
          savings: monthlySavings,
          incomeChange: 8.2,
          expensesChange: 3.1,
          savingsChange: 12.5,
        },
        spendingCategories: [
          { name: "Housing", amount: 1200, color: "#2563eb" },
          { name: "Food", amount: 450, color: "#16a34a" },
          { name: "Transportation", amount: 320, color: "#ca8a04" },
          { name: "Entertainment", amount: 180, color: "#dc2626" },
        ],
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Dashboard data error:", error);
      res.status(500).json({ message: "Failed to load dashboard data" });
    }
  });

  // Balance history
  app.get("/api/balance-history", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const history = await storage.getBalanceHistory(userId);
      
      // If no history, return mock data
      if (history.length === 0) {
        const mockData = [
          { period: "Jan", balance: 1200 },
          { period: "Feb", balance: 1350 },
          { period: "Mar", balance: 1280 },
          { period: "Apr", balance: 1420 },
          { period: "May", balance: 1380 },
          { period: "Jun", balance: 1500 },
          { period: "Jul", balance: 1320 },
        ];
        return res.json(mockData);
      }

      res.json(history);
    } catch (error) {
      console.error("Balance history error:", error);
      res.status(500).json({ message: "Failed to load balance history" });
    }
  });

  // Recent transactions
  app.get("/api/transactions/recent", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const transactions = await storage.getRecentTransactions(userId, 10);
      res.json(transactions);
    } catch (error) {
      console.error("Recent transactions error:", error);
      res.status(500).json({ message: "Failed to load transactions" });
    }
  });

  // Create transaction
  app.post("/api/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const transactionData = {
        ...req.body,
        userId,
      };
      
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      console.error("Create transaction error:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
