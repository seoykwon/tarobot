package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QTarotBot is a Querydsl query type for TarotBot
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QTarotBot extends EntityPathBase<TarotBot> {

    private static final long serialVersionUID = -422163745L;

    public static final QTarotBot tarotBot = new QTarotBot("tarotBot");

    public final QBaseEntity _super = new QBaseEntity(this);

    public final StringPath botName = createString("botName");

    public final StringPath concept = createString("concept");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath description = createString("description");

    //inherited
    public final NumberPath<Long> id = _super.id;

    public final StringPath mbti = createString("mbti");

    public final StringPath profileImage = createString("profileImage");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QTarotBot(String variable) {
        super(TarotBot.class, forVariable(variable));
    }

    public QTarotBot(Path<? extends TarotBot> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTarotBot(PathMetadata metadata) {
        super(TarotBot.class, metadata);
    }

}

