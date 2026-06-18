INSERT INTO users (user_pw, user_name, profile_image, role, career_years, business_type, is_active, is_resident, region_city, region_district, bio)
VALUES
    ('password123', '김개발', NULL, 'developer', 3, 'freelancer', 1, 0, '서울특별시', '강남구', '안녕하세요. 3년차 웹 개발자 김개발입니다.'),
    ('password123', '이디자', NULL, 'developer', 5, 'sole_proprietor', 1, 1, '경기도', '성남시', 'UI/UX 전문 디자이너입니다.'),
    ('password123', '박의뢰', NULL, 'client', 0, 'corporation', 0, 0, '부산광역시', '해운대구', '스타트업 대표입니다.'),
    ('password123', '최프리', NULL, 'developer', 7, 'team_freelancer', 1, 1, '경상북도', '구미시', '풀스택 개발 팀을 운영하고 있습니다.'),
    ('password123', '정기획', NULL, 'client', 0, 'corporation', 1, 0, '서울특별시', '마포구', 'IT 서비스 기획자입니다.');


-- project 더미데이터
INSERT INTO project (user_id, title, budget_min, budget_max, duration_days, apply_count, status, recruit_type, field, project_status, next_step, recommend_region, description, project_type, prepare_status, hope_start_date, created_at) VALUES
(3, '[신규/Web] AI 기반 쇼핑몰 플랫폼 개발', 500, 800, 90, 12, 'open', 'fixed', '개발', '기획 완료', '미팅 후', '서울 강남구', '쇼핑몰 플랫폼 신규 개발 프로젝트입니다.', 'development', '기획 완료', '2026-07-01', NOW()),
(5, '[상주/대기업] React 관리자 페이지 리뉴얼', 600, 700, 180, 5, 'open', 'resident', '개발', '상세기획 보유', '미팅 후', '서울 마포구', '관리자 페이지 리뉴얼 프로젝트입니다.', 'development', '기획 완료', '2026-07-15', NOW()),
(3, '[도급] 숙박 예약 서비스 앱 개발', 1000, 1500, 120, 18, 'open', 'fixed', '개발', '필요기능 정리', '즉시', '부산 해운대구', '숙박 예약 앱 신규 개발입니다.', 'development', '기획중', '2026-06-30', NOW()),
(5, '[신규] LLM 기반 챗봇 플랫폼 구축', 800, 1200, 150, 7, 'open', 'fixed', '개발', '기획 완료', '미팅 후', '서울 강남구', 'LLM 챗봇 플랫폼 개발 프로젝트입니다.', 'development', '기획 완료', '2026-07-20', NOW()),
(3, '[상주] 제조업 ERP 시스템 유지보수', 500, 600, 365, 3, 'open', 'resident', '개발', '운영중', '즉시', '경기도 성남시', 'ERP 시스템 유지보수 및 기능 추가입니다.', 'maintenance', '운영중', '2026-06-15', NOW()),
(5, '[도급] 전자상거래 백엔드 API 개발', 300, 500, 60, 9, 'open', 'fixed', '개발', '상세기획 보유', '미팅 후', '서울 서초구', '전자상거래 백엔드 REST API 개발입니다.', 'development', '기획 완료', '2026-07-10', NOW()),
(3, '[상주] 금융권 사내 신규 시스템 구축', 700, 1000, 180, 5, 'open', 'resident', '개발', '상세기획 보유', '미팅 후', '서울 영등포구', '금융권 사내 시스템 신규 구축 프로젝트입니다.', 'development', '기획 완료', '2026-07-01', NOW()),
(5, '[신규] 헬스케어 모바일 앱 개발', 600, 900, 120, 11, 'open', 'fixed', '개발', '필요기능 정리', '즉시', '서울 강남구', '헬스케어 iOS/Android 앱 개발 프로젝트입니다.', 'development', '기획중', '2026-08-01', NOW()),
(3, '[도급] 교육 플랫폼 웹서비스 고도화', 400, 700, 90, 6, 'open', 'fixed', '개발', '운영중', '미팅 후', '경기도 수원시', '기존 교육 플랫폼 기능 고도화 프로젝트입니다.', 'upgrade', '운영중', '2026-07-05', NOW()),
(5, '[상주] 물류 관리 시스템 개발', 550, 750, 240, 4, 'open', 'resident', '개발', '기획 완료', '즉시', '인천 남동구', '물류 관리 통합 시스템 개발 프로젝트입니다.', 'development', '기획 완료', '2026-06-25', NOW()),
(3, '[신규] 부동산 중개 플랫폼 개발', 700, 1000, 150, 8, 'open', 'fixed', '개발', '상세기획 보유', '미팅 후', '서울 송파구', '부동산 중개 웹/앱 플랫폼 신규 개발입니다.', 'development', '기획 완료', '2026-08-15', NOW()),
(5, '[도급] 소셜 커머스 웹 개발', 200, 400, 60, 15, 'closed', 'fixed', '개발', '기획 완료', '즉시', '서울 마포구', '소셜 커머스 웹서비스 개발 프로젝트입니다.', 'development', '기획 완료', '2026-06-01', NOW());