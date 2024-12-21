package com.ll.restarticlesite.domain.category;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public void createCategory(String name) {
        // 유니크 컬럼으로 관리하는 대신, 우선은 중복된 값이 있는지 체크하는 방식으로 대체
        if(categoryRepository.findByName(name).isEmpty()){
            Category category = Category.createCategory(name);
            categoryRepository.save(category);
        }
    }
}
