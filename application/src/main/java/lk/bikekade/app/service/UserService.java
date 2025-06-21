package lk.bikekade.app.service;

import java.util.List;
import java.util.Optional;

import lk.bikekade.app.model.User;

public interface UserService {
    User saveUser(User user);
    List<User> getAllUsers();
    Optional<User> getUserById(int id);
    Optional<User> getUserByUsername(String username);
    User updateUser(int id, User user);
    void deleteUser(int id);
    Optional<User> loginUser(String uname, String password);
}