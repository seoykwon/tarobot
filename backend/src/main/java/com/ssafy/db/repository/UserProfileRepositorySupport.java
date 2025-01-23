package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QUserProfile;
import com.ssafy.db.entity.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserProfileRepositorySupport {
    private final JPAQueryFactory jpaQueryFactory;
    QUserProfile qUserProfile = QUserProfile.userProfile;

}
