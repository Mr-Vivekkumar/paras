-- Migration to ensure parent_id is properly nullable in menu_items table
-- This migration ensures the parent_id column is properly configured

-- Check if the column exists and is nullable
DO $$
BEGIN
    -- Check if parent_id column exists and is nullable
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'menu_items' 
        AND column_name = 'parent_id'
        AND is_nullable = 'NO'
    ) THEN
        -- Make parent_id nullable if it's not already
        ALTER TABLE menu_items ALTER COLUMN parent_id DROP NOT NULL;
        RAISE NOTICE 'Updated parent_id column to be nullable';
    ELSE
        RAISE NOTICE 'parent_id column is already nullable or does not exist';
    END IF;
END $$;

-- Ensure the column has the correct type
DO $$
BEGIN
    -- Check if parent_id column has correct type
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'menu_items' 
        AND column_name = 'parent_id'
        AND data_type != 'uuid'
    ) THEN
        -- Update column type to UUID if it's not already
        ALTER TABLE menu_items ALTER COLUMN parent_id TYPE UUID USING parent_id::UUID;
        RAISE NOTICE 'Updated parent_id column type to UUID';
    ELSE
        RAISE NOTICE 'parent_id column already has correct UUID type';
    END IF;
END $$;

-- Add index on parent_id for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON menu_items(parent_id);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'FK_menu_items_parent_id'
    ) THEN
        ALTER TABLE menu_items 
        ADD CONSTRAINT FK_menu_items_parent_id 
        FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint for parent_id';
    ELSE
        RAISE NOTICE 'Foreign key constraint for parent_id already exists';
    END IF;
END $$;
