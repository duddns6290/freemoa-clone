package com.org.freemoaclone.User.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequestDto {
    private Long userId;
    private String userPw;
}