package com.ll.restarticlesite.domain.answer;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QAnswer is a Querydsl query type for Answer
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QAnswer extends EntityPathBase<Answer> {

    private static final long serialVersionUID = -102874998L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QAnswer answer = new QAnswer("answer");

    public final com.ll.restarticlesite.domain.QBaseEntity _super = new com.ll.restarticlesite.domain.QBaseEntity(this);

    public final ListPath<com.ll.restarticlesite.domain.comment.Comment, com.ll.restarticlesite.domain.comment.QComment> commentList = this.<com.ll.restarticlesite.domain.comment.Comment, com.ll.restarticlesite.domain.comment.QComment>createList("commentList", com.ll.restarticlesite.domain.comment.Comment.class, com.ll.restarticlesite.domain.comment.QComment.class, PathInits.DIRECT2);

    public final StringPath content = createString("content");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final com.ll.restarticlesite.domain.question.QQuestion question;

    public final com.ll.restarticlesite.domain.user.QUser user;

    public final SetPath<com.ll.restarticlesite.domain.user.User, com.ll.restarticlesite.domain.user.QUser> voter = this.<com.ll.restarticlesite.domain.user.User, com.ll.restarticlesite.domain.user.QUser>createSet("voter", com.ll.restarticlesite.domain.user.User.class, com.ll.restarticlesite.domain.user.QUser.class, PathInits.DIRECT2);

    public QAnswer(String variable) {
        this(Answer.class, forVariable(variable), INITS);
    }

    public QAnswer(Path<? extends Answer> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QAnswer(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QAnswer(PathMetadata metadata, PathInits inits) {
        this(Answer.class, metadata, inits);
    }

    public QAnswer(Class<? extends Answer> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.question = inits.isInitialized("question") ? new com.ll.restarticlesite.domain.question.QQuestion(forProperty("question"), inits.get("question")) : null;
        this.user = inits.isInitialized("user") ? new com.ll.restarticlesite.domain.user.QUser(forProperty("user")) : null;
    }

}

