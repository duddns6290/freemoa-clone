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
    private Long userId;
    private String userName;
    private LocalDateTime appliedAt;

    public static ApplicationResponseDto from(Application application) {
        return new ApplicationResponseDto(
                application.getApplicationId(),
                application.getProject().getProjectId(),
                application.getProject().getTitle(),
                application.getUser().getUserId(),
                application.getUser().getUserName(),
                application.getAppliedAt()
        );
    }
}
