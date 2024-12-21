package com.ll.restarticlesite.domain.answer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ll.restarticlesite.domain.BaseEntity;
import com.ll.restarticlesite.domain.comment.Comment;
import com.ll.restarticlesite.domain.question.Question;
import com.ll.restarticlesite.domain.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Entity
public class Answer extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @ManyToMany
    Set<User> voter = new HashSet<>();

    @OneToMany(mappedBy = "answer", cascade = CascadeType.ALL)
    @BatchSize(size = 100)
    List<Comment> commentList = new ArrayList<>();  // TODO : Comment 가 많아질 것으로 예상된다면, 댓글은 필요할 때 불러오도록 바꾸는 것이 좋다.

    protected Answer() {}

    public static Answer createAnswer(Question question, String content, User user) {
        Answer answer = new Answer();
        answer.question = question;
        answer.content = content;
        answer.user = user;
        // question.getAnswerList().add(answer);
        return answer;
    }

    public static void modifyAnswer(Answer answer, String content) {
        answer.content = content;
    }

    public void modify(String content) {
        this.content = content;
    }
}
