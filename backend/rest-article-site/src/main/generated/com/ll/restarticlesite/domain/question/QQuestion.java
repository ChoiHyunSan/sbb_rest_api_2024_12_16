package com.ll.restarticlesite.domain.question;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QQuestion is a Querydsl query type for Question
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQuestion extends EntityPathBase<Question> {

    private static final long serialVersionUID = 1498938250L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QQuestion question = new QQuestion("question");

    public final com.ll.restarticlesite.domain.QBaseEntity _super = new com.ll.restarticlesite.domain.QBaseEntity(this);

    public final ListPath<com.ll.restarticlesite.domain.answer.Answer, com.ll.restarticlesite.domain.answer.QAnswer> answerList = this.<com.ll.restarticlesite.domain.answer.Answer, com.ll.restarticlesite.domain.answer.QAnswer>createList("answerList", com.ll.restarticlesite.domain.answer.Answer.class, com.ll.restarticlesite.domain.answer.QAnswer.class, PathInits.DIRECT2);

    public final com.ll.restarticlesite.domain.category.QCategory category;

    public final StringPath content = createString("content");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final StringPath subject = createString("subject");

    public final com.ll.restarticlesite.domain.user.QUser user;

    public final NumberPath<Long> views = createNumber("views", Long.class);

    public final SetPath<com.ll.restarticlesite.domain.user.User, com.ll.restarticlesite.domain.user.QUser> voter = this.<com.ll.restarticlesite.domain.user.User, com.ll.restarticlesite.domain.user.QUser>createSet("voter", com.ll.restarticlesite.domain.user.User.class, com.ll.restarticlesite.domain.user.QUser.class, PathInits.DIRECT2);

    public QQuestion(String variable) {
        this(Question.class, forVariable(variable), INITS);
    }

    public QQuestion(Path<? extends Question> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QQuestion(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QQuestion(PathMetadata metadata, PathInits inits) {
        this(Question.class, metadata, inits);
    }

    public QQuestion(Class<? extends Question> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.category = inits.isInitialized("category") ? new com.ll.restarticlesite.domain.category.QCategory(forProperty("category")) : null;
        this.user = inits.isInitialized("user") ? new com.ll.restarticlesite.domain.user.QUser(forProperty("user")) : null;
    }

}

