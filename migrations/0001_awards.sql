-- Awards table
CREATE TABLE IF NOT EXISTS "awards" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "year" TEXT NOT NULL,
  "organization" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "image" TEXT,
  "display_order" TEXT NOT NULL DEFAULT '0',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "awards_display_order_idx" ON "awards" ("display_order");

-- Sample data
INSERT INTO "awards" (name, year, organization, category, description, display_order) VALUES
  ('ISO 9001:2015', '2020', 'International Organization for Standardization', 'certification', 'Quality Management System Certification', '1'),
  ('Gold Medal', '2021', 'London Spirits Competition', 'competition', 'Best Asian Arrack Category', '2'),
  ('Gold Medal', '2022', 'London Spirits Competition', 'competition', 'Premium Spirits Award', '3'),
  ('GMP Certified', '2023', 'National Standards Authority', 'certification', 'Good Manufacturing Practices', '4'),
  ('Gold Medal', '2024', 'London Spirits Competition', 'competition', 'Excellence in Distillation', '5'),
  ('Sri Lanka Export Award', '2024', 'Export Development Board', 'recognition', 'Outstanding Export Performance', '6');