package com.org.freemoaclone.User.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_tag")
@Getter
@NoArgsConstructor
public class UserTag {

    @EmbeddedId
    private UserTagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "search_tags", nullable = false, length = 100, insertable = false, updatable = false)
    private String searchTags;
}
