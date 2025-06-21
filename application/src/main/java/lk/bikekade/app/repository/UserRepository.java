package lk.bikekade.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import lk.bikekade.app.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Find user by username
    Optional<User> findByUname(String uname);
    
    // Check if username exists (for validation)
    boolean existsByUname(String uname);
    
    // Find user by username or phone number (for password reset)
    @Query("SELECT u FROM User u WHERE u.uname = :identifier OR u.pno = :identifier")
    Optional<User> findByUsernameOrPhone(@Param("identifier") String identifier);
}