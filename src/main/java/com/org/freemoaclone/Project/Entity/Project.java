package com.org.freemoaclone.Project.Entity;

import com.org.freemoaclone.User.Entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "project")
@Getter @Setter
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(name = "budget_min")
    private Integer budgetMin;

    @Column(name = "budget_max")
    private Integer budgetMax;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "apply_count")
    private Integer applyCount = 0;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "recruit_type")
    private RecruitType recruitType;

    private String field;

    @Column(name = "project_status")
    private String projectStatus;

    @Column(name = "next_step")
    private String nextStep;

    @Column(name = "recommend_region")
    private String recommendRegion;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "project_type")
    private ProjectType projectType;

    @Column(name = "prepare_status")
    private String prepareStatus;

    @Column(name = "hope_start_date")
    private LocalDate hopeStartDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public enum ProjectStatus { open, closed }

    public enum RecruitType { fixed, resident }

    public enum NextStep { after_meeting, immediately }

    public enum ProjectType { planning, design, development, maintenance, upgrade }
}
