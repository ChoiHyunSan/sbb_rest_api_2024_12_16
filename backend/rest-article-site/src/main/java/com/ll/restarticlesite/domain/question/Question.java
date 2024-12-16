package com.ll.restarticlesite.domain.question;

import com.ll.restarticlesite.domain.BaseEntity;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.domain.category.Category;
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
    private User author;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @BatchSize(size = 100)
    private List<Answer> answerList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    Set<User> voter = new HashSet<User>();

    private Long views;

    protected Question() {}

    public void incrementViews(){
        views++;
    }
}
