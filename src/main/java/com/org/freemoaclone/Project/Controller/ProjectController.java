package com.org.freemoaclone.Project.Controller;

import com.org.freemoaclone.Project.DTO.ProjectRequestDto;
import com.org.freemoaclone.Project.DTO.ProjectResponseDto;
import com.org.freemoaclone.Project.Service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // 프로젝트 목록 조회 (필터, 정렬, 페이징)
    @GetMapping
    public ResponseEntity<?> getProjects(
            @RequestParam(required = false) String recruitType,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "0") int page) {

        Page<ProjectResponseDto> result = projectService.getProjects(recruitType, sort, page);
        return ResponseEntity.ok(result);
    }

    // 프로젝트 상세보기
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProject(projectId));
    }

    // 프로젝트 생성 (의뢰인)
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectRequestDto dto) {
        return ResponseEntity.ok(projectService.createProject(dto));
    }

    // 의뢰인이 등록한 프로젝트 목록
    @GetMapping("/my/{userId}")
    public ResponseEntity<?> getMyProjects(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.getMyProjects(userId));
    }
}
