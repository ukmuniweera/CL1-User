package lk.bikekade.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lk.bikekade.app.model.Product;
import lk.bikekade.app.model.User;
import lk.bikekade.app.service.ProductService;
import lk.bikekade.app.service.UserService;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    // CREATE with user relationship
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Product product, @RequestParam(required = false) String userId) {
        try {
            if (userId != null && !userId.trim().isEmpty() && !userId.equals("undefined")) {
                try {
                    int userIdInt = Integer.parseInt(userId);
                    Product savedProduct = productService.saveProduct(product, userIdInt);
                    return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
                } catch (NumberFormatException e) {
                    return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
                }
            } else {
                Product savedProduct = productService.saveProduct(product);
                return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating product: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // CREATE with username
    @PostMapping("/user/{username}/add")
    public ResponseEntity<?> addProductForUser(@PathVariable String username, @RequestBody Product product) {
        try {
            if (username == null || username.trim().isEmpty()) {
                return new ResponseEntity<>("Username cannot be empty", HttpStatus.BAD_REQUEST);
            }

            User user = userService.getUserByUsername(username.trim())
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

            Product savedProduct = productService.saveProduct(product, user);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating product: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ALL
    @GetMapping("/getall")
    public ResponseEntity<?> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving products: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ALL BY USER ID - Enhanced with validation
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProductsByUserId(@PathVariable String userId) {
        try {
            // Validate user ID format
            int userIdInt;
            try {
                userIdInt = Integer.parseInt(userId);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
            }

            List<Product> products = productService.getProductsByUserId(userIdInt);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving products: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ALL BY USERNAME
    @GetMapping("/user/name/{username}")
    public ResponseEntity<?> getProductsByUsername(@PathVariable String username) {
        try {
            if (username == null || username.trim().isEmpty()) {
                return new ResponseEntity<>("Username cannot be empty", HttpStatus.BAD_REQUEST);
            }

            List<Product> products = productService.getProductsByUsername(username.trim());
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving products: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ONE - Enhanced with validation
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        try {
            // Validate product ID format
            int productId;
            try {
                productId = Integer.parseInt(id);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid product ID format", HttpStatus.BAD_REQUEST);
            }

            Product product = productService.getProductById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving product: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // UPDATE - Enhanced with proper validation
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable String id,
            @RequestBody Product product,
            @RequestParam(required = false) String userId) {

        try {
            // Validate product ID format
            int productId;
            try {
                productId = Integer.parseInt(id);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid product ID format", HttpStatus.BAD_REQUEST);
            }

            // Validate user ID if provided
            if (userId != null && !userId.trim().isEmpty() && !userId.equals("undefined")) {
                try {
                    int userIdInt = Integer.parseInt(userId);
                    if (!productService.userOwnsProduct(userIdInt, productId)) {
                        return new ResponseEntity<>("User does not own this product", HttpStatus.FORBIDDEN);
                    }
                } catch (NumberFormatException e) {
                    return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
                }
            }

            Product updated = productService.updateProduct(productId, product);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating product: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE - Enhanced with proper validation
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable String id,
            @RequestParam(required = false) String userId) {

        try {
            // Validate product ID format
            int productId;
            try {
                productId = Integer.parseInt(id);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid product ID format", HttpStatus.BAD_REQUEST);
            }

            // Validate user ID if provided
            if (userId != null && !userId.trim().isEmpty() && !userId.equals("undefined")) {
                try {
                    int userIdInt = Integer.parseInt(userId);
                    if (!productService.userOwnsProduct(userIdInt, productId)) {
                        return new ResponseEntity<>("User does not own this product", HttpStatus.FORBIDDEN);
                    }
                } catch (NumberFormatException e) {
                    return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
                }
            }

            productService.deleteProduct(productId);
            return new ResponseEntity<>("Product with ID " + productId + " has been deleted", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting product: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // CHECK OWNERSHIP - Helper endpoint
    @GetMapping("/ownership/{productId}/{userId}")
    public ResponseEntity<?> checkOwnership(@PathVariable String productId, @PathVariable String userId) {
        try {
            int productIdInt = Integer.parseInt(productId);
            int userIdInt = Integer.parseInt(userId);
            
            boolean owns = productService.userOwnsProduct(userIdInt, productIdInt);
            return new ResponseEntity<>(owns, HttpStatus.OK);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>("Invalid ID format", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error checking ownership: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}