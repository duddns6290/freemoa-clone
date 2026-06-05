package com.org.freemoaclone.Application.Repository;

import com.org.freemoaclone.Application.Entity.Application;
import com.org.freemoaclone.Project.Entity.Project;
import com.org.freemoaclone.User.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByProjectAndUser(Project project, User user);

    List<Application> findByUser(User user);
    List<Application> findByProject(Project project);
}
