package com.org.freemoaclone.Project.Service;

import com.org.freemoaclone.Project.DTO.ProjectDetailDto;
import com.org.freemoaclone.Project.DTO.ProjectRequestDto;
import com.org.freemoaclone.Project.DTO.ProjectResponseDto;
import com.org.freemoaclone.Project.Entity.Project;
import com.org.freemoaclone.Project.Repository.ProjectRepository;
import com.org.freemoaclone.User.Entity.User;
import com.org.freemoaclone.User.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    // 프로젝트 목록 조회 (필터, 정렬, 페이징)
    public Page<ProjectResponseDto> getProjects(String recruitType, String sort, int page) {
        Sort sorting = switch (sort) {
            case "budget_high" -> Sort.by(Sort.Direction.DESC, "budgetMax");
            case "budget_low"  -> Sort.by(Sort.Direction.ASC,  "budgetMin");
            case "deadline"    -> Sort.by(Sort.Direction.ASC,  "hopeStartDate");
            default            -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(page, 4, sorting);

        Page<Project> projects;
        if (recruitType == null || recruitType.isBlank() || recruitType.equals("all")) {
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

    // 프로젝트 생성 (의뢰인)
    public ProjectDetailDto createProject(ProjectRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Project project = new Project();
        project.setUser(user);
        project.setTitle(dto.getTitle());
        project.setHopeStartDate(dto.getHopeStartDate());
        project.setRecruitType(Project.RecruitType.valueOf(dto.getRecruitType()));
        project.setBudgetMin(dto.getBudgetMin());
        project.setBudgetMax(dto.getBudgetMax());
        project.setField(dto.getField());
        project.setPrepareStatus(dto.getPrepareStatus());
        project.setRecommendRegion(dto.getRecommendRegion());
        project.setDescription(dto.getDescription());
        project.setTechStack(dto.getTechStack());
        if (dto.getProjectType() != null && !dto.getProjectType().isBlank()) {
            project.setProjectType(Project.ProjectType.valueOf(dto.getProjectType()));
        }
        project.setStatus(dto.getStatus() != null
                ? Project.ProjectStatus.valueOf(dto.getStatus())
                : Project.ProjectStatus.open);
        project.setApplyCount(0);

        return new ProjectDetailDto(projectRepository.save(project));
    }

    // 의뢰인이 등록한 프로젝트 목록
    public List<ProjectDetailDto> getMyProjects(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        return projectRepository.findByUser(user).stream()
                .map(ProjectDetailDto::new)
                .toList();
    }
}
