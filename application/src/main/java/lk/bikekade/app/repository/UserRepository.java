package lk.bikekade.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import lk.bikekade.app.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
}
