package com.org.freemoaclone.User.DTO;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.org.freemoaclone.User.Entity.User;
import lombok.*;
import java.util.List;

@Getter
@JsonPropertyOrder({
        "userId",
        "userName",
        "profileImage",
        "role",
        "businessType",
        "careerYears",
        "regionCity",
        "regionDistrict",
        "fields",
        "tags",
        "bio",})
public class UserResponseDto {

    private Long userId;
    private String userName;
    private String profileImage;
    private String role;
    private Integer careerYears;
    private String businessType;
    private String regionCity;
    private String regionDistrict;
    private String bio;
    private List<String> fields;
    private List<String> tags;

    public UserResponseDto(User user) {
        this.userId = user.getUserId();
        this.userName = user.getUserName();
        this.profileImage = user.getProfileImage();
        this.role = user.getRole() != null ? user.getRole().name() : null;
        this.careerYears = user.getCareerYears();
        this.businessType = user.getBusinessType() != null ? user.getBusinessType().name() : null;
        this.regionCity = user.getRegionCity();
        this.regionDistrict = user.getRegionDistrict();
        this.bio = user.getBio();

        this.fields = user.getFields().stream()
                .map(f -> f.getField())
                .toList();
        this.tags = user.getTags().stream()
                .map(f->f.getSearchTags())
                .toList();
    }
}
