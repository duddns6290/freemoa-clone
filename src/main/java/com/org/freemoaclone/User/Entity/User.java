package com.org.freemoaclone.User.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_pw", nullable = false)
    private String userPw;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "profile_image")
    private String profileImage;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "career_years")
    private Integer careerYears;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type")
    private BusinessType businessType;

    @Column(name = "is_active")
    private Boolean isActive = false;

    @Column(name = "is_resident")
    private Boolean isResident = false;

    @Column(name = "region_city")
    private String regionCity;

    @Column(name = "region_district")
    private String regionDistrict;

    @Column(columnDefinition = "TEXT")
    private String bio;

    public enum Role {
        client, developer
    }

    public enum BusinessType {
        freelancer, team_freelancer, sole_proprietor, corporation
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserField> fields = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserTag> tags = new ArrayList<>();
}
