-- +goose Up
INSERT INTO prompts (name, text, description, tags, meta, version, card)
VALUES (
    'rnditb2c/idea-generator',
    'Предложи 10 креативных идей для {project_type} в нише {niche}',
    'Генерирует список креативных идей для проектов',
    ARRAY['brainstorming', 'creativity'],
    '{"authors": ["rnditb2c"]}'::jsonb,
    '0.1.0',
    NULL
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO prompts (name, text, description, tags, meta, version, card)
VALUES (
    'rnditb2c/interview-prep',
    'Составь список из 5 сложных вопросов для собеседования на позицию {position}',
    'Генерирует вопросы для проведения интервью с кандидатами',
    ARRAY['hr', 'question-answering'],
    '{"authors": ["rnditb2c"]}'::jsonb,
    '0.1.0',
    NULL
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO prompts (name, text, description, tags, meta, version, card)
VALUES (
    'rnditb2c/summarizer',
    E'Сгенерируй краткое резюме для следующего текста, выделив 3 ключевые мысли.\nТекст:\n{text}',
    'Генерирует краткое резюме текста с выделением основных мыслей',
    ARRAY['summarization', 'text-processing'],
    '{"authors": ["rnditb2c"]}'::jsonb,
    '0.1.0',
    NULL
)
ON CONFLICT (name) DO NOTHING;

-- +goose Down
DELETE FROM prompts 
WHERE name IN (
    'rnditb2c/idea-generator',
    'rnditb2c/interview-prep',
    'rnditb2c/summarizer'
);