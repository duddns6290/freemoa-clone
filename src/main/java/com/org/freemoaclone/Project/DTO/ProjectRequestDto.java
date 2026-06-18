package com.org.freemoaclone.Project.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class ProjectRequestDto {

    private Long userId;
    private String title;
    private LocalDate hopeStartDate;  // 모집마감일
    private String recruitType;       // fixed(도급외주) | resident(상주)
    private Integer budgetMin;
    private Integer budgetMax;
    private String field;             // 프로젝트 분야 (콤마 구분 텍스트)
    private String prepareStatus;     // 기획상태
    private String recommendRegion;   // 미팅 희망 지역
    private String description;       // 업무내용
    private String projectType;       // 프로젝트 진행 방식
    private String techStack;         // 필요 기술 스택 (콤마 구분 텍스트)
    private String status;            // open | closed
}
