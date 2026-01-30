-- Таблица классов с кодами доступа
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    access_code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользователей (учителя и админы)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher')),
    class_id INTEGER REFERENCES classes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица расписаний
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    day_of_week VARCHAR(20) NOT NULL,
    lesson_number INTEGER NOT NULL,
    subject VARCHAR(100) NOT NULL,
    UNIQUE(class_id, day_of_week, lesson_number)
);

-- Таблица звонков
CREATE TABLE bells (
    id SERIAL PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL,
    lesson_number INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE(day_of_week, lesson_number)
);

-- Таблица меню столовой
CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL UNIQUE,
    breakfast TEXT,
    lunch TEXT
);

-- Таблица учителей
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    phone VARCHAR(30)
);

-- Таблица новостей
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    date DATE NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица контактов
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(30),
    email VARCHAR(100),
    address TEXT
);

-- Вставка начальных данных
INSERT INTO classes (name, access_code) VALUES 
    ('5А', 'MATH5A'),
    ('8Б', 'PHYS8B');

INSERT INTO contacts (phone, email, address) VALUES 
    ('+7 (495) 123-45-67', 'school@example.ru', 'г. Москва, ул. Школьная, д. 1');