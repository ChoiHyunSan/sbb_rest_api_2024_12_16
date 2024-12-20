package com.ll.restarticlesite.domain.question;

import com.ll.restarticlesite.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByUser(User user);
}
