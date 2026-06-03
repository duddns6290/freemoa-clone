package com.org.freemoaclone.User.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class UpdateProfileRequestDto {
    private Boolean isActive;
    private Boolean isResident;
    private String regionCity;
    private String regionDistrict;
    private String businessType;
    private Integer careerYears;
    private String bio;
    private List<String> fields;
    private List<String> tags;
}
