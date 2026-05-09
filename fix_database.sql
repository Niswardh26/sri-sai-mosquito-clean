-- Fix the database table columns to allow null
USE mosquito;

ALTER TABLE orders MODIFY COLUMN phone VARCHAR(50) NULL;
ALTER TABLE orders MODIFY COLUMN address VARCHAR(1000) NULL;

-- Verify the changes
DESCRIBE orders;