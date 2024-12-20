package com.ll.restarticlesite.domain.answer;

import com.ll.restarticlesite.api.dto.request.answer.AnswerProfileRequest;
import com.ll.restarticlesite.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository  extends JpaRepository<Answer, Long> {

    @EntityGraph(attributePaths = {"question", "user"})
    Page<Answer> findAll(Pageable pageable);
    List<Answer> findByUser(User user);
}
