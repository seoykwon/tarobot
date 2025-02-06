package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QTarotCard is a Querydsl query type for TarotCard
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QTarotCard extends EntityPathBase<TarotCard> {

    private static final long serialVersionUID = -202157832L;

    public static final QTarotCard tarotCard = new QTarotCard("tarotCard");

    public final StringPath cardImageUrl = createString("cardImageUrl");

    public final NumberPath<Integer> cardNumber = createNumber("cardNumber", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> setNumber = createNumber("setNumber", Integer.class);

    public QTarotCard(String variable) {
        super(TarotCard.class, forVariable(variable));
    }

    public QTarotCard(Path<? extends TarotCard> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTarotCard(PathMetadata metadata) {
        super(TarotCard.class, metadata);
    }

}

