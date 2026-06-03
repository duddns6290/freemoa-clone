package com.org.freemoaclone.User.Service;

import com.org.freemoaclone.User.DTO.UserResponseDto;
import com.org.freemoaclone.User.Entity.User;
import com.org.freemoaclone.User.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Login
    public UserResponseDto login(Long userId, String userPw) {
        User user = userRepository.findById(userId).orElseThrow(()->
                new IllegalArgumentException("User not found"));
        if (!user.getUserPw().equals(userPw)) {
            throw new IllegalArgumentException("Wrong Password");
        }
        return new UserResponseDto(user);
    }

    public UserResponseDto getUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(()->
                new IllegalArgumentException("User not found"));

        return new UserResponseDto(user);
    }

    public String uploadProfileImage(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(()->
                new IllegalArgumentException("User not found"));

        // 저장 폴더
        String uploadPath = System.getProperty("user.dir") + "/upload/profile/";
        File dir = new File(uploadPath);
        if(!dir.exists()) dir.mkdirs();

        String fileName = UUID.randomUUID() + "_" +  file.getOriginalFilename();
        File dest = new File(uploadPath + fileName);
        file.transferTo(dest);

        // DB 경로 저장
        user.setProfileImage("/profile/" + fileName);
        userRepository.save(user);

        return "/profile/" + fileName;
    }
}
