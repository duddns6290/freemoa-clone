package com.org.freemoaclone.Application.Controller;

import com.org.freemoaclone.Application.Service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // 프로젝트 지원
    @PostMapping("/projects/{projectId}/apply")
    public ResponseEntity<?> apply(
            @PathVariable Long projectId,
            @RequestParam Long userId) {

        applicationService.apply(projectId, userId);
        return ResponseEntity.ok("지원 완료");
    }

    // 내가 지원한 프로젝트 목록 조회
    @GetMapping("/users/{userId}/applications")
    public ResponseEntity<?> getMyApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getMyApplications(userId));
    }

    // 내 프로젝트에 지원한 유저 목록 조회
    @GetMapping("/projects/{projectId}/applicants")
    public ResponseEntity<?> getApplicants(@PathVariable Long projectId) {
        return ResponseEntity.ok(applicationService.getApplicants(projectId));
    }
}