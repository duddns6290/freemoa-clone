package com.org.freemoaclone.Project.Service;

import com.org.freemoaclone.Project.DTO.ProjectDetailDto;
import com.org.freemoaclone.Project.DTO.ProjectResponseDto;
import com.org.freemoaclone.Project.Entity.Project;
import com.org.freemoaclone.Project.Repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    // 프로젝트 목록 조회 (필터, 정렬, 페이징)
    public Page<ProjectResponseDto> getProjects(String recruitType, String sort, int page) {
        Sort sorting = switch (sort) {
            case "latest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "budget_high" -> Sort.by(Sort.Direction.DESC, "budgetMax");
            case "budget_low" -> Sort.by(Sort.Direction.ASC, "budgetMin");
            case "deadline" -> Sort.by(Sort.Direction.ASC, "hopeStartDate");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(page, 4, sorting);

        Page<Project> projects;
        if (recruitType == null || recruitType.equals("all")) {
            projects = projectRepository.findAll(pageable);
        } else {
            projects = projectRepository.findByRecruitType(
                Project.RecruitType.valueOf(recruitType), pageable);
        }

        return projects.map(ProjectResponseDto::new);
    }

    // 프로젝트 단건 조회 (상세보기)
    public ProjectDetailDto getProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        return new ProjectDetailDto(project);
    }
}
