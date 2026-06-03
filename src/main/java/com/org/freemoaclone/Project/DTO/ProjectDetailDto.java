package com.org.freemoaclone.Project.DTO;

import com.org.freemoaclone.Project.Entity.Project;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ProjectDetailDto {

    private Long projectId;
    private String title;
    private String recruitType;
    private String status;
    private String field;
    private Integer budgetMin;
    private Integer budgetMax;
    private Integer durationDays;
    private Integer applyCount;
    private String nextStep;
    private String projectStatus;
    private String recommendRegion;
    private String description;
    private String projectType;
    private String prepareStatus;
    private LocalDate hopeStartDate;
    private LocalDateTime createdAt;

    public ProjectDetailDto(Project project) {
        this.projectId = project.getProjectId();
        this.title = project.getTitle();
        this.recruitType = project.getRecruitType() != null ? project.getRecruitType().name() : null;
        this.status = project.getStatus() != null ? project.getStatus().name() : null;
        this.field = project.getField();
        this.budgetMin = project.getBudgetMin();
        this.budgetMax = project.getBudgetMax();
        this.durationDays = project.getDurationDays();
        this.applyCount = project.getApplyCount();
        this.nextStep = project.getNextStep();
        this.projectStatus = project.getProjectStatus();
        this.recommendRegion = project.getRecommendRegion();
        this.description = project.getDescription();
        this.projectType = project.getProjectType() != null ? project.getProjectType().name() : null;
        this.prepareStatus = project.getPrepareStatus();
        this.hopeStartDate = project.getHopeStartDate();
        this.createdAt = project.getCreatedAt();
    }
}
