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
    public ResponseEntity<?> add(@RequestBody User user) {
        try {
            User savedUser = userService.saveUser(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating user: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ALL
    @GetMapping("/getall")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // READ ONE - Enhanced with proper error handling
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            // Validate ID format
            int userId;
            try {
                userId = Integer.parseInt(id);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
            }

            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving user: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ONE BY USERNAME
    @GetMapping("/name/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        try {
            Optional<User> user = userService.getUserByUsername(username);
            if (user.isPresent()) {
                return new ResponseEntity<>(user.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found with username " + username, 
                        HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving user: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // UPDATE - Enhanced with proper validation
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            // Validate ID format
            int userId;
            try {
                userId = Integer.parseInt(id);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
            }

            User updatedUser = userService.updateUser(userId, user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating user: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE - Enhanced with proper validation
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            // Validate ID format
            int userId;
            try {
                userId = Integer.parseInt(id);
            } catch (NumberFormatException e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Invalid user ID format");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            userService.deleteUser(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User with ID " + userId + " has been deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting user: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            // Validate login request
            if (loginRequest.getUname() == null || loginRequest.getUname().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Username is required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Password is required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            Optional<User> user = userService.loginUser(loginRequest.getUname().trim(), 
                    loginRequest.getPassword());

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
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Login error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        try {
            String identifier = payload.get("identifier");
            String newPassword = payload.get("newPassword");

            if (identifier == null || identifier.trim().isEmpty()) {
                return new ResponseEntity<>("Identifier is required", HttpStatus.BAD_REQUEST);
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                return new ResponseEntity<>("New password is required", HttpStatus.BAD_REQUEST);
            }

            Optional<User> userOptional = userService.getUserByUsername(identifier.trim());
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
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error resetting password: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET USER PROFILE (for edit form) - Enhanced with proper validation
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable String id) {
        try {
            // Validate ID format
            int userId;
            try {
                userId = Integer.parseInt(id);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
            }

            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
            
            // Return user without password for security
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("fname", user.getFname());
            profile.put("lname", user.getLname());
            profile.put("uname", user.getUname());
            profile.put("pno", user.getPno());
            profile.put("address", user.getAddress());
            
            return new ResponseEntity<>(profile, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving user profile: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // VALIDATE USER ID - Helper endpoint
    @GetMapping("/validate/{id}")
    public ResponseEntity<?> validateUserId(@PathVariable String id) {
        try {
            int userId = Integer.parseInt(id);
            boolean exists = userService.getUserById(userId).isPresent();
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", exists);
            response.put("userId", userId);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (NumberFormatException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "Invalid ID format");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}