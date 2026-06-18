package com.org.freemoaclone.Application.Service;

import com.org.freemoaclone.Application.Dto.ApplicationRequestDto;
import com.org.freemoaclone.Application.Dto.ApplicationResponseDto;
import com.org.freemoaclone.Application.Entity.Application;
import com.org.freemoaclone.Application.Repository.ApplicationRepository;
import com.org.freemoaclone.Project.Entity.Project;
import com.org.freemoaclone.Project.Repository.ProjectRepository;
import com.org.freemoaclone.User.Entity.User;
import com.org.freemoaclone.User.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public void apply(Long projectId, ApplicationRequestDto dto) {
        dto.validateCoverLetter();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        if (applicationRepository.existsByProjectAndUser(project, user)) {
            throw new IllegalStateException("이미 지원한 프로젝트입니다.");
        }

        Application application = new Application(
                project, user,
                dto.getWorkDays(), dto.getBidAmount(),
                dto.getSkillType(), dto.getCareerLevel(),
                dto.getSalary(), dto.getCoverLetter()
        );
        applicationRepository.save(application);

        project.setApplyCount(project.getApplyCount() + 1);
        projectRepository.save(project);
    }

    public ApplicationResponseDto getMyApplication(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        Application app = applicationRepository.findByProjectAndUser(project, user)
                .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));
        return ApplicationResponseDto.from(app);
    }

    public boolean hasApplied(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        return applicationRepository.existsByProjectAndUser(project, user);
    }

    public List<ApplicationResponseDto> getMyApplications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        return applicationRepository.findByUser(user).stream()
                .map(ApplicationResponseDto::from)
                .toList();
    }

    // 지원서 단건 조회
    public ApplicationResponseDto getApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));
        return ApplicationResponseDto.from(application);
    }

    // 특정 프로젝트의 지원자 목록 (더보기 페이징, 페이지사이즈=2)
    public Map<String, Object> getApplicants(Long projectId, int page) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, 2, Sort.by(Sort.Direction.ASC, "appliedAt"));
        Page<Application> pageResult = applicationRepository.findByProject(project, pageable);

        List<ApplicationResponseDto> list = pageResult.getContent().stream()
                .map(ApplicationResponseDto::from)
                .toList();

        return Map.of(
                "data", list,
                "hasNext", pageResult.hasNext(),
                "totalElements", pageResult.getTotalElements()
        );
    }
}
