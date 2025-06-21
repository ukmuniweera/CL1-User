package lk.bikekade.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lk.bikekade.app.model.User;
import lk.bikekade.app.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public User saveUser(User user) {
        // Validate required fields
        if (user.getFname() == null || user.getFname().trim().isEmpty()) {
            throw new IllegalArgumentException("First name cannot be empty");
        }

        if (user.getUname() == null || user.getUname().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        // Check if username already exists (for new users)
        if (user.getId() == 0 && userRepository.existsByUname(user.getUname())) {
            throw new IllegalArgumentException("Username already exists");
        }

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }
    
    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUname(username);
    }

    @Override
    @Transactional
    public User updateUser(int id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));

        // Update fields only if they're provided and different
        if (user.getFname() != null && !user.getFname().trim().isEmpty()) {
            existing.setFname(user.getFname().trim());
        }

        if (user.getLname() != null) {
            existing.setLname(user.getLname().trim());
        }

        if (user.getUname() != null && !user.getUname().trim().isEmpty()) {
            // Check if new username already exists (by another user)
            if (!existing.getUname().equals(user.getUname()) && 
                userRepository.existsByUname(user.getUname())) {
                throw new IllegalArgumentException("Username already exists");
            }
            existing.setUname(user.getUname().trim());
        }

        if (user.getPno() != null) {
            existing.setPno(user.getPno().trim());
        }

        if (user.getAddress() != null) {
            existing.setAddress(user.getAddress().trim());
        }

        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            existing.setPassword(user.getPassword());
        }

        return userRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteUser(int id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. User not found with id " + id);
        }
        
        // Note: This will cascade delete all products associated with this user
        // due to the @OneToMany(cascade = CascadeType.ALL) annotation in User model
        userRepository.deleteById(id);
    }
    
    @Override
    public Optional<User> loginUser(String uname, String password) {
        return userRepository.findByUname(uname)
                .filter(user -> user.getPassword().equals(password));
    }
}