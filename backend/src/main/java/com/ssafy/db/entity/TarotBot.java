package com.ssafy.db.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class TarotBot extends BaseEntity {

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(length = 255)
    private String concept;

    @Column(length = 255)
    private String profileImage;

    @Column(length = 10)
    private String mbti;

    @ElementCollection
    @CollectionTable(name = "tarotbot_expertise", joinColumns = @JoinColumn(name = "tarotbot_id"))
    @Column(name = "expertise", length = 100)
    private List<String> expertise = new ArrayList<>();

    @OneToMany(mappedBy = "tarotBot", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("tarotBot")  // Review의 JSON에서 tarotBot을 무시하도록 설정
    private List<Review> reviews = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}