package com.org.freemoaclone.Project.Repository;

import com.org.freemoaclone.Project.Entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Page<Project> findByRecruitType(Project.RecruitType recruitType, Pageable pageable);
}
