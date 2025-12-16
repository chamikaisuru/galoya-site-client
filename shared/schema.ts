import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Portfolio Items Table
export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(), // csr, plantation, distillery, bottle_shots
  thumbnail: text("thumbnail").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  images: text("images").array().notNull(), // Array of image URLs
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products Table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  abv: text("abv").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").notNull(),
  tastingNotes: text("tasting_notes").notNull(),
  longDescription: text("long_description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Awards table
export const awards = pgTable("awards", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  year: text("year").notNull(),
  organization: text("organization").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  image: text("image"),
  displayOrder: text("display_order").notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAwardSchema = createInsertSchema(awards, {
  name: z.string().min(1, "Award name is required"),
  year: z.string().min(4, "Year is required"),
  organization: z.string().min(1, "Organization is required"),
  category: z.string().min(1, "Category is required"),
});

export const selectAwardSchema = createSelectSchema(awards);

export type Award = z.infer<typeof selectAwardSchema>;
export type InsertAward = z.infer<typeof insertAwardSchema>;

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

