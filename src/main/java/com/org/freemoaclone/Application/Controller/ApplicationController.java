package com.org.freemoaclone.Application.Controller;

import com.org.freemoaclone.Application.Dto.ApplicationRequestDto;
import com.org.freemoaclone.Application.Service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // 프로젝트 지원 (지원서 내용 포함)
    @PostMapping("/projects/{projectId}/apply")
    public ResponseEntity<?> apply(
            @PathVariable Long projectId,
            @RequestBody ApplicationRequestDto dto) {
        try {
            applicationService.apply(projectId, dto);
            return ResponseEntity.ok("지원 완료");
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 특정 프로젝트에 이미 지원했는지 확인
    @GetMapping("/projects/{projectId}/applied")
    public ResponseEntity<?> hasApplied(
            @PathVariable Long projectId,
            @RequestParam Long userId) {
        boolean applied = applicationService.hasApplied(projectId, userId);
        return ResponseEntity.ok(applied);
    }

    // 내가 특정 프로젝트에 제출한 지원서 조회
    @GetMapping("/projects/{projectId}/my-application")
    public ResponseEntity<?> getMyApplication(
            @PathVariable Long projectId,
            @RequestParam Long userId) {
        try {
            return ResponseEntity.ok(applicationService.getMyApplication(projectId, userId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 내가 지원한 프로젝트 목록 조회
    @GetMapping("/users/{userId}/applications")
    public ResponseEntity<?> getMyApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getMyApplications(userId));
    }

    // 지원서 단건 조회
    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<?> getApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationService.getApplication(applicationId));
    }

    // 특정 프로젝트의 지원자 목록 (더보기 페이징)
    @GetMapping("/projects/{projectId}/applicants")
    public ResponseEntity<?> getApplicants(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(applicationService.getApplicants(projectId, page));
    }
}