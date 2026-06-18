package com.org.freemoaclone.Project.Repository;

import com.org.freemoaclone.Project.Entity.Project;
import com.org.freemoaclone.User.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Page<Project> findByRecruitType(Project.RecruitType recruitType, Pageable pageable);
    List<Project> findByUser(User user);
}
