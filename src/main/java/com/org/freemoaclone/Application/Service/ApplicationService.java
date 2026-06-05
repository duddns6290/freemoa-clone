package com.org.freemoaclone.Application.Service;

import com.org.freemoaclone.Application.Dto.ApplicationResponseDto;
import com.org.freemoaclone.Application.Entity.Application;
import com.org.freemoaclone.Application.Repository.ApplicationRepository;
import com.org.freemoaclone.Project.Entity.Project;
import com.org.freemoaclone.Project.Repository.ProjectRepository;
import com.org.freemoaclone.User.Entity.User;
import com.org.freemoaclone.User.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public void apply(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        if (applicationRepository.existsByProjectAndUser(project, user)) {
            throw new IllegalStateException("이미 지원한 프로젝트입니다.");
        }

        applicationRepository.save(new Application(project, user));
    }

    public Map<String, Object> getMyApplications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        List<ApplicationResponseDto> list = applicationRepository.findByUser(user).stream()
                .map(ApplicationResponseDto::from)
                .toList();

        if (list.isEmpty()) {
            return Map.of("message", "지원한 프로젝트가 없습니다.", "data", list);
        }

        return Map.of("message", "success", "data", list);
    }

    public Map<String, Object> getApplicants(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));

        List<ApplicationResponseDto> list = applicationRepository.findByProject(project).stream()
                .map(ApplicationResponseDto::from)
                .toList();

        if (list.isEmpty()) {
            return Map.of("message", "지원자가 없습니다.", "data", list);
        }

        return Map.of("message", "success", "data", list);
    }
}
