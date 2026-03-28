package com.example.loanmanangementsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "del_yn", length = 1)
    private String delYn;

    @Column(name = "del_at")
    private LocalDateTime delAt;

    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    @Builder.Default
    private Set<User> users = new HashSet<>();
}
