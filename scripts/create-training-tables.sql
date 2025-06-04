-- إنشاء جداول قاعدة البيانات لنظام تدريب النماذج في 3RBAI

-- جدول النماذج المدربة
CREATE TABLE IF NOT EXISTS trained_models (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) UNIQUE NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0.0',
    status VARCHAR(50) DEFAULT 'active',
    performance_score DECIMAL(5,4),
    training_data_size INTEGER,
    test_data_size INTEGER,
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP,
    usage_count INTEGER DEFAULT 0
);

-- جدول بيانات التدريب
CREATE TABLE IF NOT EXISTS training_data (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) REFERENCES trained_models(model_name),
    data_type VARCHAR(50) NOT NULL, -- 'training', 'validation', 'test'
    input_text TEXT NOT NULL,
    expected_output TEXT,
    quality_score DECIMAL(3,2),
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول نتائج التدريب
CREATE TABLE IF NOT EXISTS training_results (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) REFERENCES trained_models(model_name),
    training_session_id UUID DEFAULT gen_random_uuid(),
    epoch INTEGER,
    loss DECIMAL(10,6),
    accuracy DECIMAL(5,4),
    validation_loss DECIMAL(10,6),
    validation_accuracy DECIMAL(5,4),
    learning_rate DECIMAL(10,8),
    batch_size INTEGER,
    training_time_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول أداء النماذج
CREATE TABLE IF NOT EXISTS model_performance (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) REFERENCES trained_models(model_name),
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    score DECIMAL(5,4) NOT NULL,
    details JSONB,
    tested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول استخدام النماذج
CREATE TABLE IF NOT EXISTS model_usage (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) REFERENCES trained_models(model_name),
    user_id VARCHAR(255),
    input_text TEXT,
    output_text TEXT,
    response_time_ms INTEGER,
    satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول تكوين النماذج
CREATE TABLE IF NOT EXISTS model_configurations (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) REFERENCES trained_models(model_name),
    config_name VARCHAR(255) NOT NULL,
    config_value TEXT NOT NULL,
    config_type VARCHAR(50) NOT NULL, -- 'prompt', 'parameter', 'setting'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول مراقبة النماذج
CREATE TABLE IF NOT EXISTS model_monitoring (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) REFERENCES trained_models(model_name),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    threshold_min DECIMAL(10,4),
    threshold_max DECIMAL(10,4),
    status VARCHAR(50) DEFAULT 'normal', -- 'normal', 'warning', 'critical'
    alert_sent BOOLEAN DEFAULT false,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_trained_models_type ON trained_models(model_type);
CREATE INDEX IF NOT EXISTS idx_trained_models_status ON trained_models(status);
CREATE INDEX IF NOT EXISTS idx_training_data_model ON training_data(model_name);
CREATE INDEX IF NOT EXISTS idx_training_data_type ON training_data(data_type);
CREATE INDEX IF NOT EXISTS idx_training_results_model ON training_results(model_name);
CREATE INDEX IF NOT EXISTS idx_training_results_session ON training_results(training_session_id);
CREATE INDEX IF NOT EXISTS idx_model_performance_model ON model_performance(model_name);
CREATE INDEX IF NOT EXISTS idx_model_performance_type ON model_performance(test_type);
CREATE INDEX IF NOT EXISTS idx_model_usage_model ON model_usage(model_name);
CREATE INDEX IF NOT EXISTS idx_model_usage_user ON model_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_model_usage_created ON model_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_model_configurations_model ON model_configurations(model_name);
CREATE INDEX IF NOT EXISTS idx_model_configurations_active ON model_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_model_monitoring_model ON model_monitoring(model_name);
CREATE INDEX IF NOT EXISTS idx_model_monitoring_status ON model_monitoring(status);

-- إدراج بيانات أولية للنماذج الأساسية
INSERT INTO trained_models (model_name, model_type, performance_score, config) VALUES
('3RBAI_Groq_Primary', 'groq', 0.92, '{"api_endpoint": "groq", "max_tokens": 4000, "temperature": 0.7}'),
('3RBAI_Gemini_Secondary', 'gemini', 0.89, '{"api_endpoint": "gemini", "max_tokens": 4000, "temperature": 0.7}'),
('3RBAI_DeepSeek_Coder', 'deepseek', 0.91, '{"specialization": "coding", "languages": ["Python", "JavaScript", "TypeScript"]}'),
('3RBAI_Financial_Expert', 'financial', 0.88, '{"specializations": ["fundamental", "technical", "macro"]}'),
('3RBAI_MultiAgent_System', 'multi_agent', 0.90, '{"agents": ["pm", "fundamental", "macro", "quant"]}')
ON CONFLICT (model_name) DO NOTHING;

-- إدراج بيانات تدريب عينة
INSERT INTO training_data (model_name, data_type, input_text, expected_output, quality_score, tags) VALUES
('3RBAI_Groq_Primary', 'training', 'ما هي أفضل استراتيجيات الاستثمار؟', 'تحليل شامل لاستراتيجيات الاستثمار المختلفة...', 0.95, ARRAY['investment', 'strategy']),
('3RBAI_Groq_Primary', 'training', 'كيف أطور تطبيق ويب؟', 'خطوات تطوير تطبيق ويب حديث...', 0.92, ARRAY['programming', 'web_development']),
('3RBAI_DeepSeek_Coder', 'training', 'اكتب دالة لترتيب مصفوفة', 'def sort_array(arr): return sorted(arr)', 0.98, ARRAY['programming', 'algorithms']),
('3RBAI_Financial_Expert', 'training', 'تحليل سهم أبل', 'تحليل أساسي وتقني شامل لسهم أبل...', 0.94, ARRAY['financial_analysis', 'stocks'])
ON CONFLICT DO NOTHING;

-- إدراج بيانات مراقبة أولية
INSERT INTO model_monitoring (model_name, metric_name, metric_value, threshold_min, threshold_max) VALUES
('3RBAI_Groq_Primary', 'response_time_ms', 1200, 0, 5000),
('3RBAI_Groq_Primary', 'accuracy_score', 0.92, 0.8, 1.0),
('3RBAI_Gemini_Secondary', 'response_time_ms', 1500, 0, 5000),
('3RBAI_Gemini_Secondary', 'accuracy_score', 0.89, 0.8, 1.0),
('3RBAI_DeepSeek_Coder', 'code_quality_score', 0.91, 0.8, 1.0),
('3RBAI_Financial_Expert', 'analysis_accuracy', 0.88, 0.8, 1.0)
ON CONFLICT DO NOTHING;

-- إنشاء دالة لتحديث timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء triggers لتحديث updated_at تلقائياً
CREATE TRIGGER update_trained_models_updated_at BEFORE UPDATE ON trained_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_configurations_updated_at BEFORE UPDATE ON model_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إنشاء دالة لحساب إحصائيات النماذج
CREATE OR REPLACE FUNCTION get_model_statistics(model_name_param VARCHAR)
RETURNS TABLE (
    total_usage INTEGER,
    avg_response_time DECIMAL,
    avg_satisfaction DECIMAL,
    last_used TIMESTAMP,
    performance_trend VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_usage,
        AVG(response_time_ms)::DECIMAL as avg_response_time,
        AVG(satisfaction_score)::DECIMAL as avg_satisfaction,
        MAX(created_at) as last_used,
        CASE 
            WHEN AVG(satisfaction_score) >= 4.0 THEN 'excellent'
            WHEN AVG(satisfaction_score) >= 3.0 THEN 'good'
            WHEN AVG(satisfaction_score) >= 2.0 THEN 'fair'
            ELSE 'poor'
        END as performance_trend
    FROM model_usage 
    WHERE model_name = model_name_param;
END;
$$ LANGUAGE plpgsql;

-- إنشاء view لملخص أداء النماذج
CREATE OR REPLACE VIEW model_performance_summary AS
SELECT 
    tm.model_name,
    tm.model_type,
    tm.performance_score,
    tm.status,
    COUNT(mu.id) as total_usage,
    AVG(mu.response_time_ms) as avg_response_time,
    AVG(mu.satisfaction_score) as avg_satisfaction,
    MAX(mu.created_at) as last_used,
    tm.created_at as model_created,
    tm.updated_at as model_updated
FROM trained_models tm
LEFT JOIN model_usage mu ON tm.model_name = mu.model_name
GROUP BY tm.model_name, tm.model_type, tm.performance_score, tm.status, tm.created_at, tm.updated_at;

COMMENT ON TABLE trained_models IS 'جدول النماذج المدربة في نظام 3RBAI';
COMMENT ON TABLE training_data IS 'بيانات التدريب والاختبار للنماذج';
COMMENT ON TABLE training_results IS 'نتائج عمليات التدريب والتحسين';
COMMENT ON TABLE model_performance IS 'مقاييس أداء النماذج المختلفة';
COMMENT ON TABLE model_usage IS 'سجل استخدام النماذج من قبل المستخدمين';
COMMENT ON TABLE model_configurations IS 'إعدادات وتكوينات النماذج';
COMMENT ON TABLE model_monitoring IS 'مراقبة أداء النماذج في الوقت الفعلي';
