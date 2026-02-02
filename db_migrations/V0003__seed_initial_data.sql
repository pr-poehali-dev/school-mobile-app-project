-- Создание первого администратора (пароль: admin)
INSERT INTO users (username, password_hash, role, full_name) 
VALUES ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', 'Администратор')
ON CONFLICT (username) DO NOTHING;

-- Добавление тестовых классов
INSERT INTO classes (name, access_code) VALUES 
('5А', 'MATH5A'),
('5Б', 'MATH5B'),
('6А', 'PHYS6A')
ON CONFLICT (name) DO NOTHING;