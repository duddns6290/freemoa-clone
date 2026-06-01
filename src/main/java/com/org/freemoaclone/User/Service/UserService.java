package com.org.freemoaclone.User.Service;

import com.org.freemoaclone.User.DTO.UserResponseDto;
import com.org.freemoaclone.User.Entity.User;
import com.org.freemoaclone.User.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
