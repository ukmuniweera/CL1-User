package lk.bikekade.app.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import lk.bikekade.app.model.Product;
import lk.bikekade.app.model.User;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByUser(User user);

    List<Product> findByUserUname(String username);

    List<Product> findByUserId(int userId);

    List<Product> findByCreatedAtBefore(LocalDateTime cutoffDate);
}