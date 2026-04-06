-- MIGRATION: ADD SUSPENSION STATUS
-- Empowering Admins with the ability to temporarily disable platform access.

ALTER TABLE IF EXISTS profiles 
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;

-- Ensure RLS is updated for the new column (if needed, but usually not for just adding a column)
-- Admins can update this field
CREATE POLICY "Admins can update suspension status" ON profiles 
FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
