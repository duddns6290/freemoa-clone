package com.org.freemoaclone.Application.Dto;

import com.org.freemoaclone.Application.Entity.Application;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ApplicationResponseDto {

    private Long applicationId;
    private Long projectId;
    private String projectTitle;
    private Integer budgetMin;
    private Integer budgetMax;
    private Integer durationDays;
    private Integer applyCount;
    private Long userId;
    private String userName;
    private LocalDateTime appliedAt;

    // 지원서 내용
    private Integer workDays;
    private Long bidAmount;
    private String skillType;
    private String careerLevel;
    private Long salary;
    private String coverLetter;

    public static ApplicationResponseDto from(Application application) {
        return new ApplicationResponseDto(
                application.getApplicationId(),
                application.getProject().getProjectId(),
                application.getProject().getTitle(),
                application.getProject().getBudgetMin(),
                application.getProject().getBudgetMax(),
                application.getProject().getDurationDays(),
                application.getProject().getApplyCount(),
                application.getUser().getUserId(),
                application.getUser().getUserName(),
                application.getAppliedAt(),
                application.getWorkDays(),
                application.getBidAmount(),
                application.getSkillType(),
                application.getCareerLevel(),
                application.getSalary(),
                application.getCoverLetter()
        );
    }
}
