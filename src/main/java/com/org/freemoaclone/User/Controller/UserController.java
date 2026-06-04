package com.org.freemoaclone.User.Controller;

import com.org.freemoaclone.User.DTO.LoginRequestDto;
import com.org.freemoaclone.User.DTO.UpdateProfileRequestDto;
import com.org.freemoaclone.User.DTO.UserResponseDto;
import com.org.freemoaclone.User.Service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request, HttpSession session) {
        UserResponseDto user = userService.login(request.getLoginId(), request.getUserPw());
        session.setAttribute("loginUser", user);
        return ResponseEntity.ok(user);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logout");
    }

    // 유저 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    // 프로필 이미지 업로드
    @PostMapping("/{userId}/image")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) throws IOException {

        String imagePath = userService.uploadProfileImage(userId, file);
        return ResponseEntity.ok(Map.of("profileImage", imagePath));
    }

    // 프로필 정보 수정
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody UpdateProfileRequestDto dto) {

        return ResponseEntity.ok(userService.updateProfile(userId, dto));
    }
}
