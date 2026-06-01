package com.org.freemoaclone.User.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_field")
@Getter
@NoArgsConstructor
public class UserField {

    @EmbeddedId
    private UserFieldId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50, insertable = false, updatable = false)
    private String field;
}
