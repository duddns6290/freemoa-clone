package com.org.freemoaclone.User.Repository;

import com.org.freemoaclone.User.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByUserName(String username);
    Optional<User> findByLoginId(String loginId);
}
