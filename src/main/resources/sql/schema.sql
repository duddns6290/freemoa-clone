-- CREATE TABLE

-- users 테이블
CREATE TABLE users (
                       user_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
                       user_pw         VARCHAR(255) NOT NULL,
                       user_name       VARCHAR(100),
                       profile_image   VARCHAR(500),
                       role            ENUM('client', 'developer'),
                       career_years    INT,
                       business_type   ENUM('freelancer', 'team_freelancer', 'sole_proprietor', 'corporation'),
                       is_active       TINYINT(1) DEFAULT 0,
                       is_resident     TINYINT(1) DEFAULT 0,
                       region_city     VARCHAR(100),
                       region_district VARCHAR(100),
                       bio             TEXT
);

-- user_field 테이블
CREATE TABLE user_field (
                            user_id BIGINT NOT NULL,
                            field   VARCHAR(50) NOT NULL,
                            FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- user_tag 테이블
CREATE TABLE user_tag (
                          user_id     BIGINT NOT NULL,
                          search_tags VARCHAR(100) NOT NULL,
                          FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- project 테이블
CREATE TABLE project (
                         project_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
                         user_id          BIGINT NOT NULL,
                         title            VARCHAR(255),
                         budget_min       INT,
                         budget_max       INT,
                         duration_days    INT,
                         apply_count      INT DEFAULT 0,
                         status           ENUM('open', 'closed'),
                         recruit_type     ENUM('fixed', 'resident'),
                         field            VARCHAR(100),
                         project_status   VARCHAR(100),
                         next_step        VARCHAR(50),
                         recommend_region VARCHAR(100),
                         description      TEXT,
                         project_type     ENUM('planning', 'design', 'development', 'maintenance', 'upgrade'),
                         prepare_status   VARCHAR(100),
                         hope_start_date  DATE,
                         tech_stack       VARCHAR(500),
                         created_at       DATETIME DEFAULT NOW(),
                         FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- application 테이블
CREATE TABLE application (
                             application_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             project_id     BIGINT NOT NULL,
                             user_id        BIGINT NOT NULL,
                             applied_at     DATETIME DEFAULT NOW(),
                             work_days      INT,
                             bid_amount     INT,
                             skill_type     VARCHAR(100),
                             career_level   VARCHAR(100),
                             salary         INT,
                             cover_letter   TEXT,
                             FOREIGN KEY (project_id) REFERENCES project(project_id),
                             FOREIGN KEY (user_id)    REFERENCES users(user_id)
);