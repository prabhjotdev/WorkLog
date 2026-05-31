-- ============================================================
-- WorkLog — Supabase Database Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL editor)
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. profiles
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  role          TEXT,          -- e.g. "Senior SWE", shown in reports
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. sprints
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sprints (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  goal        TEXT,
  status      TEXT NOT NULL DEFAULT 'planned'
                CHECK (status IN ('planned', 'active', 'completed')),
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. tasks
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sprint_id     UUID REFERENCES sprints(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'todo'
                  CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  priority      TEXT NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  tags          TEXT[] DEFAULT '{}',
  story_points  INT DEFAULT 1 CHECK (story_points >= 0),
  due_date      DATE,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. knowledge_gaps
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_gaps (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id      UUID REFERENCES tasks(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT,
  recurrence   INT DEFAULT 1 CHECK (recurrence >= 1),
  resolved     BOOLEAN DEFAULT FALSE,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. Indexes
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS tasks_user_id_idx        ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_sprint_id_idx      ON tasks(sprint_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx         ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_completed_at_idx   ON tasks(completed_at);
CREATE INDEX IF NOT EXISTS sprints_user_id_idx      ON sprints(user_id);
CREATE INDEX IF NOT EXISTS gaps_user_id_idx         ON knowledge_gaps(user_id);

-- ─────────────────────────────────────────────
-- 6. updated_at trigger
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER sprints_updated_at
  BEFORE UPDATE ON sprints
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER gaps_updated_at
  BEFORE UPDATE ON knowledge_gaps
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- 7. Auto-create profile on sign-up
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────────
-- 8. Sprint velocity RPC
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_sprint_velocity(p_user_id UUID)
RETURNS TABLE (
  sprint_id       UUID,
  sprint_name     TEXT,
  tasks_total     INT,
  tasks_done      INT,
  points_total    INT,
  points_done     INT,
  completion_pct  NUMERIC
) LANGUAGE sql STABLE AS $$
  SELECT
    s.id,
    s.name,
    COUNT(t.id)::INT,
    COUNT(t.id) FILTER (WHERE t.status = 'done')::INT,
    COALESCE(SUM(t.story_points), 0)::INT,
    COALESCE(SUM(t.story_points) FILTER (WHERE t.status = 'done'), 0)::INT,
    CASE
      WHEN COUNT(t.id) = 0 THEN 0
      ELSE ROUND(100.0 * COUNT(t.id) FILTER (WHERE t.status = 'done') / COUNT(t.id), 1)
    END
  FROM sprints s
  LEFT JOIN tasks t ON t.sprint_id = s.id AND t.user_id = p_user_id
  WHERE s.user_id = p_user_id
  GROUP BY s.id, s.name
  ORDER BY s.start_date NULLS LAST, s.created_at;
$$;

-- ─────────────────────────────────────────────
-- 9. Row-Level Security
-- ─────────────────────────────────────────────
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_gaps ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- sprints
CREATE POLICY "sprints: select own"
  ON sprints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sprints: insert own"
  ON sprints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sprints: update own"
  ON sprints FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sprints: delete own"
  ON sprints FOR DELETE USING (auth.uid() = user_id);

-- tasks
CREATE POLICY "tasks: select own"
  ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tasks: insert own"
  ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks: update own"
  ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tasks: delete own"
  ON tasks FOR DELETE USING (auth.uid() = user_id);

-- knowledge_gaps
CREATE POLICY "gaps: select own"
  ON knowledge_gaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gaps: insert own"
  ON knowledge_gaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gaps: update own"
  ON knowledge_gaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "gaps: delete own"
  ON knowledge_gaps FOR DELETE USING (auth.uid() = user_id);
