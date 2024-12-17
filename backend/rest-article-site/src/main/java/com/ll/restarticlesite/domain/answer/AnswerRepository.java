package com.ll.restarticlesite.domain.answer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepository  extends JpaRepository<Answer, Long> {

    @EntityGraph(attributePaths = {"question", "user"})
    Page<Answer> findAll(Pageable pageable);
}
