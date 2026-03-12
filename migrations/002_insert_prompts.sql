-- +goose Up
INSERT INTO authors (name) VALUES ('rnditb2c') ON CONFLICT (name) DO NOTHING;

INSERT INTO prompts (name, author_id, version, tags, description, text)
VALUES (
    'bug-report',
    (SELECT id FROM authors WHERE name = 'rnditb2c'),
    '1.0.0',
    ARRAY['coding', 'debugging', 'productivity'],
    'Помогает структурировать и диагностировать баг по описанию симптомов',
    E'Помоги разобраться с багом.\n\nОкружение: {environment}\nОжидаемое поведение: {expected}\nФактическое поведение: {actual}\nШаги для воспроизведения: {steps}\n\nВозможные причины (от наиболее к наименее вероятной):\n1.\n\nДля каждой причины предложи способ проверки и потенциальное исправление.'
)
ON CONFLICT (name, author_id) DO NOTHING;

INSERT INTO prompts (name, author_id, version, tags, description, text)
VALUES (
    'code-reviewer',
    (SELECT id FROM authors WHERE name = 'rnditb2c'),
    '1.0.0',
    ARRAY['coding', 'code-review', 'best-practices'],
    'Проводит детальное ревью кода с указанием конкретных улучшений',
    E'Проведи детальное ревью следующего кода на {language}.\n\nОбрати внимание на:\n- Корректность логики\n- Читаемость и стиль\n- Потенциальные баги и уязвимости\n- Производительность\n- Соответствие best practices\n\nКод:\n{code}\n\nДля каждой проблемы укажи: строку, описание проблемы и конкретное исправление.'
)
ON CONFLICT (name, author_id) DO NOTHING;

INSERT INTO prompts (name, author_id, version, tags, description, text)
VALUES (
    'commit-message',
    (SELECT id FROM authors WHERE name = 'rnditb2c'),
    '1.0.0',
    ARRAY['coding', 'git', 'productivity'],
    'Генерирует чёткий git commit message по диффу изменений',
    E'Напиши git commit message для следующего диффа.\n\nПравила:\n- Первая строка: тип(scope): краткое описание (до 72 символов)\n- Типы: feat, fix, refactor, docs, test, chore\n- Если нужно, добавь тело сообщения через пустую строку\n- Пиши на английском, в повелительном наклонении\n\nДифф:\n{diff}'
)
ON CONFLICT (name, author_id) DO NOTHING;

INSERT INTO prompts (name, author_id, version, tags, description, text)
VALUES (
    'readme-generator',
    (SELECT id FROM authors WHERE name = 'rnditb2c'),
    '1.0.0',
    ARRAY['docs', 'productivity', 'coding'],
    'Генерирует профессиональный README.md для проекта',
    E'Напиши README.md для проекта.\n\nНазвание: {project_name}\nОписание: {description}\nТехнологии: {stack}\nОсновные команды: {commands}\n\nСтруктура README:\n- Краткое описание и бейджи\n- Возможности (Features)\n- Быстрый старт (Getting Started)\n- Конфигурация\n- Участие в разработке (Contributing)\n\nСтиль: чёткий, профессиональный, с примерами кода.'
)
ON CONFLICT (name, author_id) DO NOTHING;

INSERT INTO prompts (name, author_id, version, tags, description, text)
VALUES (
    'sql-query-builder',
    (SELECT id FROM authors WHERE name = 'rnditb2c'),
    '1.0.0',
    ARRAY['coding', 'sql', 'database'],
    'Генерирует оптимизированный SQL-запрос по описанию задачи',
    E'Напиши оптимизированный SQL-запрос для следующей задачи.\n\nБД: {database} ({dialect})\nСхема таблиц:\n{schema}\n\nЗадача: {task}\n\nТребования:\n- Используй индексы там, где это уместно\n- Избегай N+1 запросов\n- Добавь комментарии к неочевидным частям запроса'
)
ON CONFLICT (name, author_id) DO NOTHING;

INSERT INTO prompts (name, author_id, version, tags, description, text)
VALUES (
    'text-improver',
    (SELECT id FROM authors WHERE name = 'rnditb2c'),
    '1.0.0',
    ARRAY['writing', 'text-processing', 'productivity'],
    'Улучшает текст: устраняет ошибки, повышает ясность и профессионализм',
    E'Улучши следующий текст.\n\nЦелевая аудитория: {audience}\nТональность: {tone}\n\nТребования:\n- Исправь грамматические и стилистические ошибки\n- Сделай текст более чётким и лаконичным\n- Сохрани оригинальный смысл и ключевые идеи\n- Не меняй структуру, если она не мешает читаемости\n\nТекст:\n{text}\n\nВерни улучшенную версию и кратко поясни ключевые правки.'
)
ON CONFLICT (name, author_id) DO NOTHING;

-- +goose Down
DELETE FROM prompts
WHERE author_id = (SELECT id FROM authors WHERE name = 'rnditb2c')
  AND name IN (
    'bug-report',
    'code-reviewer',
    'commit-message',
    'readme-generator',
    'sql-query-builder',
    'text-improver'
);

DELETE FROM authors WHERE name = 'rnditb2c';
