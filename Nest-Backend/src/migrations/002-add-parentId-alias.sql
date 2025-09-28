-- Migration to add camelCase alias column "parentId" to menu_items
-- This addresses legacy code expecting "parentId" while keeping existing "parent_id"

DO $$
BEGIN
    -- Add parentId column if it does not exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'menu_items'
          AND column_name = 'parentId'
    ) THEN
        ALTER TABLE menu_items ADD COLUMN "parentId" UUID;
        RAISE NOTICE 'Added parentId column';
    ELSE
        RAISE NOTICE 'parentId column already exists';
    END IF;
END $$;

-- Backfill parentId from parent_id if parentId is NULL
UPDATE menu_items SET "parentId" = parent_id WHERE "parentId" IS NULL;

-- Create index on parentId for performance if not exists
CREATE INDEX IF NOT EXISTS idx_menu_items_parentId ON menu_items("parentId");

-- Add foreign key constraint for parentId if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = 'menu_items'
          AND constraint_name = 'FK_menu_items_parentId'
    ) THEN
        ALTER TABLE menu_items
            ADD CONSTRAINT FK_menu_items_parentId
            FOREIGN KEY ("parentId") REFERENCES menu_items(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint for parentId';
    ELSE
        RAISE NOTICE 'Foreign key constraint for parentId already exists';
    END IF;
END $$;