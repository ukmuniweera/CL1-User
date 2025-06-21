package lk.bikekade.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lk.bikekade.app.model.User;
import lk.bikekade.app.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // CREATE
    @PostMapping("/add")
    public User add(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // READ ALL
    @GetMapping("/getall")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // READ ONE
    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // READ ONE BY USERNAME
    @GetMapping("/name/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found with username " + username, HttpStatus.NOT_FOUND);
        }
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return "User with ID " + id + " has been deleted";
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> user = userService.loginUser(loginRequest.getUname(), loginRequest.getPassword());

        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", user.get().getId());
            response.put("username", user.get().getUname());
            response.put("fullName", user.get().getFname() + " " +
                    (user.get().getLname() != null ? user.get().getLname() : ""));

            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid username or password");

            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String identifier = payload.get("identifier");
        String newPassword = payload.get("newPassword");

        if (identifier == null || newPassword == null) {
            return new ResponseEntity<>("Missing identifier or newPassword", HttpStatus.BAD_REQUEST);
        }

        Optional<User> userOptional = userService.getUserByUsername(identifier);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        User user = userOptional.get();
        user.setPassword(newPassword);
        userService.saveUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password updated successfully.");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}