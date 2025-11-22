
-- Add notification_sent column to exams table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exams' AND column_name = 'notification_sent') THEN
        ALTER TABLE exams ADD COLUMN notification_sent BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
