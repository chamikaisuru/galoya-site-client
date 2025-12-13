-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL
);

-- Portfolio Items table
CREATE TABLE IF NOT EXISTS "portfolio_items" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "thumbnail" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "images" TEXT[] NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "abv" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "ingredients" TEXT NOT NULL,
  "tasting_notes" TEXT NOT NULL,
  "long_description" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "portfolio_slug_idx" ON "portfolio_items" ("slug");
CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products" ("slug");