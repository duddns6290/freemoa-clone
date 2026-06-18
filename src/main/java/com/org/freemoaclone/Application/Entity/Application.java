package com.org.freemoaclone.Application.Entity;

import com.org.freemoaclone.Project.Entity.Project;
import com.org.freemoaclone.User.Entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "application")
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    // 도급 지원서 필드
    @Column(name = "work_days")
    private Integer workDays;

    @Column(name = "bid_amount")
    private Long bidAmount;

    // 상주 지원서 필드
    @Column(name = "skill_type")
    private String skillType;

    @Column(name = "career_level")
    private String careerLevel;

    @Column(name = "salary")
    private Long salary;

    // 공통
    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @PrePersist
    public void prePersist() {
        this.appliedAt = LocalDateTime.now();
    }

    public Application(Project project, User user) {
        this.project = project;
        this.user = user;
    }

    public Application(Project project, User user, Integer workDays, Long bidAmount,
                       String skillType, String careerLevel, Long salary, String coverLetter) {
        this.project = project;
        this.user = user;
        this.workDays = workDays;
        this.bidAmount = bidAmount;
        this.skillType = skillType;
        this.careerLevel = careerLevel;
        this.salary = salary;
        this.coverLetter = coverLetter;
    }
}
