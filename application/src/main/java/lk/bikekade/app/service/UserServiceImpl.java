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
        if (user.getFname() == null || user.getFname().trim().isEmpty()) {
            throw new IllegalArgumentException("First name cannot be empty");
        }

        if (user.getUname() == null || user.getUname().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
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
        return userRepository.findAll().stream()
            .filter(user -> user.getUname().equals(username))
            .findFirst();
    }

    @Override
    @Transactional
    public User updateUser(int id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));

        if (user.getFname() != null && !user.getFname().trim().isEmpty()) {
            existing.setFname(user.getFname());
        }

        if (user.getLname() != null) {
            existing.setLname(user.getLname());
        }

        if (user.getUname() != null) {
            existing.setUname(user.getUname());
        }

        if (user.getPno() != null) {
            existing.setPno(user.getPno());
        }

        if (user.getAddress() != null) {
            existing.setAddress(user.getAddress());
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
        userRepository.deleteById(id);
    }
    
    @Override
    public Optional<User> loginUser(String uname, String password) {
        return userRepository.findAll().stream()
            .filter(user -> user.getUname().equals(uname) && user.getPassword().equals(password))
            .findFirst();
    }
}