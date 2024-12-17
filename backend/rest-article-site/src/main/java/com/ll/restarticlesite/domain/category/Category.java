package com.ll.restarticlesite.domain.category;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ll.restarticlesite.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Category extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;
    private String name;

    public static Category createCategory(String name) {
        Category category = new Category();
        category.name = name;
        return category;
    }
}
