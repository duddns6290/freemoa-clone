package com.org.freemoaclone.User.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_field")
@NoArgsConstructor
public class UserField {

    @EmbeddedId
    private UserFieldId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public UserField(User user, String field) {
        this.id = new UserFieldId(user.getUserId(), field);
        this.user = user;
    }

    public String getField() {
        return id.getField();
    }
}
