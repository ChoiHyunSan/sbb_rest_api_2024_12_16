package com.ll.restarticlesite.domain.comment;

import com.ll.restarticlesite.domain.BaseEntity;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.global.service.Ownable;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class Comment extends BaseEntity implements Ownable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id")
    Answer answer;

    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public static Comment createComment(Answer answer, User user, String content) {
        Comment comment = new Comment();
        comment.answer = answer;
        comment.user = user;
        comment.content = content;
        // answer.getCommentList().add(comment);
        return comment;
    }
}
