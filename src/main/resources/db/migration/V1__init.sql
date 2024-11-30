-- Step 1: Create tables with relationships
-- Enum types
CREATE TYPE user_enum AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
CREATE TYPE priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE task_enum AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- Users table
CREATE TABLE Users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email VARCHAR(255) UNIQUE NOT NULL,
                       username VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       job_title VARCHAR(100),
                       role user_enum NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TaskStatus table
CREATE TABLE TaskStatus (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            name VARCHAR(100) NOT NULL,
                            description TEXT
);

-- Tasks table
CREATE TABLE Tasks (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       creator_id UUID REFERENCES Users(id) ON DELETE SET NULL,
                       assignee_id UUID REFERENCES Users(id) ON DELETE SET NULL,
                       title VARCHAR(255) NOT NULL,
                       description TEXT,
                       priority priority_enum NOT NULL,
                       status task_enum NOT NULL,
                       due_date TIMESTAMP,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE Comments (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          task_id UUID REFERENCES Tasks(id) ON DELETE CASCADE,
                          user_id UUID REFERENCES Users(id) ON DELETE SET NULL,
                          content TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GDPRArticles table
CREATE TABLE GDPRArticles (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              article_number VARCHAR(255) NOT NULL,
                              title VARCHAR(255) NOT NULL,
                              content TEXT,
                              keywords TEXT[],
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE gdprarticles
ALTER COLUMN content TYPE TEXT;

-- SavedArticles table
CREATE TABLE saved_articles (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
                               article_id UUID REFERENCES GDPRArticles(id) ON DELETE CASCADE,
                               saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attachments table
CREATE TABLE Attachments (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             task_id UUID REFERENCES Tasks(id) ON DELETE CASCADE,
                             file_name VARCHAR(255) NOT NULL,
                             file_path VARCHAR(255) NOT NULL,
                             mime_type VARCHAR(50),
                             file_size INT,
                             uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some indexes for performance
CREATE INDEX idx_task_creator ON Tasks (creator_id);
CREATE INDEX idx_task_assignee ON Tasks (assignee_id);
CREATE INDEX idx_comment_task ON Comments (task_id);
CREATE INDEX idx_saved_articles_user ON saved_articles (user_id);
CREATE INDEX idx_saved_articles_article ON saved_articles (article_id);
