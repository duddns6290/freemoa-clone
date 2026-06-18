package com.org.freemoaclone.Application.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApplicationRequestDto {

    private Long userId;

    // 도급
    private Integer workDays;
    private Integer bidAmount;

    // 상주
    private String skillType;
    private String careerLevel;
    private Integer salary;

    // 공통
    private String coverLetter;

    public void validateCoverLetter() {
        if (coverLetter == null) return;
        String emailRegex = "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}";
        String phoneRegex = "\\d{2,4}[-\\s.]?\\d{3,4}[-\\s.]?\\d{4}";
        if (coverLetter.matches(".*(" + emailRegex + ").*") ||
            coverLetter.matches(".*(" + phoneRegex + ").*")) {
            throw new IllegalArgumentException("지원 내용에 이메일 또는 전화번호를 포함할 수 없습니다.");
        }
    }
}
