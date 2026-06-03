package com.org.freemoaclone.User.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_tag")
@NoArgsConstructor
public class UserTag {

    @EmbeddedId
    private UserTagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public UserTag(User user, String searchTags) {
        this.id = new UserTagId(user.getUserId(), searchTags);
        this.user = user;
    }

    public String getSearchTags() {
        return id.getSearchTags();
    }
}
