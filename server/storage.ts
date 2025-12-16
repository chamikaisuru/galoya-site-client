import { db } from "./db";
import { users, portfolioItems, products, awards,  type User, type InsertUser, type PortfolioItem, type InsertPortfolioItem, type Product, type InsertProduct, type Award, type InsertAward } from "@shared/schema";
import { eq } from "drizzle-orm";


export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Portfolio
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: string, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: string): Promise<void>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;

  // Awards
  getAllAwards(): Promise<Award[]>;
  getAward(id: string): Promise<Award | undefined>;
  createAward(award: InsertAward): Promise<Award>;
  updateAward(id: string, award: Partial<InsertAward>): Promise<Award | undefined>;
  deleteAward(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Portfolio Items
  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).orderBy(portfolioItems.createdAt);
  }

  async getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
    const result = await db.select().from(portfolioItems).where(eq(portfolioItems.slug, slug)).limit(1);
    return result[0];
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const result = await db.insert(portfolioItems).values(item).returning();
    return result[0];
  }

  async updatePortfolioItem(id: string, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const result = await db
      .update(portfolioItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(portfolioItems.id, id))
      .returning();
    return result[0];
  }

  async deletePortfolioItem(id: string): Promise<void> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.createdAt);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Awards
  async getAllAwards(): Promise<Award[]> {
    return await db.select().from(awards).orderBy(awards.displayOrder);
  }

  async getAward(id: string): Promise<Award | undefined> {
    const result = await db.select().from(awards).where(eq(awards.id, id)).limit(1);
    return result[0];
  }

  async createAward(award: InsertAward): Promise<Award> {
    const result = await db.insert(awards).values(award).returning();
    return result[0];
  }

  async updateAward(id: string, award: Partial<InsertAward>): Promise<Award | undefined> {
    const result = await db
      .update(awards)
      .set({ ...award, updatedAt: new Date() })
      .where(eq(awards.id, id))
      .returning();
    return result[0];
  }

  async deleteAward(id: string): Promise<void> {
    await db.delete(awards).where(eq(awards.id, id));
  }
}

export const storage = new DbStorage();