-- Таблица для хранения расписания учителя по урокам
CREATE TABLE IF NOT EXISTS teacher_schedule (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  day_of_week VARCHAR(20) NOT NULL,
  lesson_number INTEGER NOT NULL,
  subject VARCHAR(100) NOT NULL,
  class_id INTEGER REFERENCES classes(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_teacher_lesson UNIQUE(user_id, day_of_week, lesson_number)
);

CREATE INDEX idx_teacher_schedule_user ON teacher_schedule(user_id);
CREATE INDEX idx_teacher_schedule_class ON teacher_schedule(class_id);

COMMENT ON TABLE teacher_schedule IS 'Расписание учителя: какой класс ведет на каждом уроке';
COMMENT ON COLUMN teacher_schedule.day_of_week IS 'День недели (Понедельник, Вторник и т.д.)';
COMMENT ON COLUMN teacher_schedule.lesson_number IS 'Номер урока (1-6)';
COMMENT ON COLUMN teacher_schedule.subject IS 'Предмет учителя';
COMMENT ON COLUMN teacher_schedule.class_id IS 'Класс на этом уроке (может быть NULL если окно)';