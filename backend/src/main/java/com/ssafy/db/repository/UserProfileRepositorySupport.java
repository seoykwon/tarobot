package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QUserProfile;
import com.ssafy.db.entity.UserProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserProfileRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QUserProfile qUserProfile = QUserProfile.userProfile;

    public Optional<UserProfile> findUserProfileByUserId(String userId) {
        UserProfile userProfile = jpaQueryFactory.select(qUserProfile).from(qUserProfile)
                .where(qUserProfile.user.userId.eq(userId)).fetchOne();
        if(userProfile == null) return Optional.empty();
        return Optional.ofNullable(userProfile);
    }
}
