-- إنشاء جداول المحادثات والملفات
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    model VARCHAR(100),
    is_starred BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
    thinking_process TEXT,
    model VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    service VARCHAR(100) NOT NULL,
    key_value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    usage_limit INTEGER DEFAULT 1000,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processed_files (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'processing',
    extracted_files JSONB,
    analysis JSONB,
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_processed_files_user_id ON processed_files(user_id);

-- إدراج بيانات تجريبية
INSERT INTO conversations (user_id, title, model, tags) VALUES 
('user_123', 'تحليل الأسهم التقنية', '3RBAI Financial Expert', ARRAY['استثمار', 'تكنولوجيا']),
('user_123', 'برمجة تطبيق React', '3RBAI DeepSeek Coder', ARRAY['برمجة', 'React']),
('user_123', 'فلسفة الوجود', '3RBAI Philosophical Reasoner', ARRAY['فلسفة', 'وجود']);

INSERT INTO messages (conversation_id, content, sender, model) VALUES 
(1, 'ما رأيك في أسهم التكنولوجيا؟', 'user', NULL),
(1, 'أسهم التكنولوجيا تظهر نمواً قوياً في السوق الحالي...', 'ai', '3RBAI Financial Expert'),
(2, 'كيف أنشئ تطبيق React متقدم؟', 'user', NULL),
(2, 'لإنشاء تطبيق React متقدم، ابدأ بإعداد البيئة...', 'ai', '3RBAI DeepSeek Coder'),
(3, 'ما معنى الوجود؟', 'user', NULL),
(3, 'سؤال الوجود من أعمق الأسئلة الفلسفية...', 'ai', '3RBAI Philosophical Reasoner');

COMMIT;
