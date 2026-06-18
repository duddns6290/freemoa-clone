package com.org.freemoaclone.User.Service;

import com.org.freemoaclone.User.DTO.UpdateProfileRequestDto;
import com.org.freemoaclone.User.DTO.UserResponseDto;
import com.org.freemoaclone.User.Entity.User;
import com.org.freemoaclone.User.Entity.UserField;
import com.org.freemoaclone.User.Entity.UserTag;
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
    public UserResponseDto login(String loginId, String userPw) {
        User user = userRepository.findByLoginId(loginId).orElseThrow(()->
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
        String uploadPath = System.getProperty("user.dir") + "/base_img/";
        File dir = new File(uploadPath);
        if(!dir.exists()) dir.mkdirs();

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(uploadPath + fileName);
        file.transferTo(dest);

        user.setProfileImage(fileName);
        userRepository.save(user);

        return fileName;
    }

    // 프로필 수정
    public UserResponseDto updateProfile(Long userId, UpdateProfileRequestDto dto) {
        User user = userRepository.findById(userId).orElseThrow(()->
                new IllegalArgumentException("User not found"));

        // 기본 정보 수정
        user.setIsActive(dto.getIsActive());
        user.setIsResident(dto.getIsResident());
        user.setRegionCity(dto.getRegionCity());
        user.setRegionDistrict(dto.getRegionDistrict());

        user.setBusinessType(User.BusinessType.valueOf(dto.getBusinessType()));
        user.setCareerYears(dto.getCareerYears());
        user.setBio(dto.getBio());

        // 태그 수정 (기존 정보 삭제 후 추가)
        user.getTags().clear();
        if(dto.getTags() != null) {
            if(dto.getTags().size() > 5) {
                throw new IllegalArgumentException("태그는 5개 이하로 입력");
            }
            dto.getTags().forEach(tag -> user.getTags().add(new UserTag(user, tag)));
        }

        // 분야 수정 (기존 정보 삭제 후 추가)
        user.getFields().clear();
        if(dto.getFields() != null) {
            dto.getFields().forEach(field ->
                    user.getFields().add(new UserField(user, field)));
        }

        userRepository.save(user);
        return new UserResponseDto(user);
    }
}
