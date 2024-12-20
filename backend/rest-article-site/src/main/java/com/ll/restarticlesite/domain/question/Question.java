package com.ll.restarticlesite.domain.question;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ll.restarticlesite.domain.BaseEntity;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.domain.category.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Entity
@Builder
@AllArgsConstructor
public class Question extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private long id;

    @Column(length = 200)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @BatchSize(size = 100)
    private List<Answer> answerList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @JsonIgnore
    @ManyToMany
    Set<User> voter = new HashSet<User>();

    private Long views;

    protected Question() {}

    public void incrementViews(){
        views++;
    }

    public static Question createQuestion(User user, String subject, String content, Category category) {
        return Question.builder()
                .subject(subject)
                .content(content)
                .category(category)
                .views(0L)
                .user(user)
                .answerList(new ArrayList<>())
                .voter(new HashSet<>())
                .build();
    }

    public void modify(String subject, String content, Category category) {
        this.subject = subject;
        this.content = content;
        this.category = category;
    }

    public void addViews() {
        this.views++;
    }
}
