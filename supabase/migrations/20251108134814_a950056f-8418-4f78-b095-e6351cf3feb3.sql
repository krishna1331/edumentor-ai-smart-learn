-- Add foreign key relationships for profiles
ALTER TABLE doubts DROP CONSTRAINT IF EXISTS doubts_user_id_fkey;
ALTER TABLE doubts ADD CONSTRAINT doubts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE materials DROP CONSTRAINT IF EXISTS materials_user_id_fkey;
ALTER TABLE materials ADD CONSTRAINT materials_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_user_id_fkey;
ALTER TABLE notes ADD CONSTRAINT notes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE study_plans DROP CONSTRAINT IF EXISTS study_plans_user_id_fkey;
ALTER TABLE study_plans ADD CONSTRAINT study_plans_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE mcq_questions DROP CONSTRAINT IF EXISTS mcq_questions_user_id_fkey;
ALTER TABLE mcq_questions ADD CONSTRAINT mcq_questions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;