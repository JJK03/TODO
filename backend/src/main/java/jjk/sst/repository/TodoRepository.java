package jjk.sst.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import jjk.sst.domain.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    // 완료 여부로 필터링, 정렬 조건은 외부에서
    List<Todo> findByCompleted(boolean completed, Sort sort);

    // 제목 키워드 검색, 정렬 조건은 외부에서
    List<Todo> findByTitleContaining(String keyword, Sort sort);
}
