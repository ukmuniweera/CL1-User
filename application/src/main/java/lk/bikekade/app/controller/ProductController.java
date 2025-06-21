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
    public Product add(@RequestBody Product product, @RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return productService.saveProduct(product, userId);
        } else {
            return productService.saveProduct(product);
        }
    }

    // CREATE with username
    @PostMapping("/user/{username}/add")
    public ResponseEntity<?> addProductForUser(@PathVariable String username, @RequestBody Product product) {
        try {
            User user = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

            Product savedProduct = productService.saveProduct(product, user);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // READ ALL
    @GetMapping("/getall")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // READ ALL BY USER ID
    @GetMapping("/user/{userId}")
    public List<Product> getProductsByUserId(@PathVariable int userId) {
        return productService.getProductsByUserId(userId);
    }

    // READ ALL BY USERNAME
    @GetMapping("/user/name/{username}")
    public List<Product> getProductsByUsername(@PathVariable String username) {
        return productService.getProductsByUsername(username);
    }

    // READ ONE
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable int id) {
        return productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int id,
            @RequestBody Product product,
            @RequestParam(required = false) Integer userId) {

        if (userId != null && !productService.userOwnsProduct(userId, id)) {
            return new ResponseEntity<>("User does not own this product", HttpStatus.FORBIDDEN);
        }

        try {
            Product updated = productService.updateProduct(id, product);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable int id,
            @RequestParam(required = false) Integer userId) {

        if (userId != null && !productService.userOwnsProduct(userId, id)) {
            return new ResponseEntity<>("User does not own this product", HttpStatus.FORBIDDEN);
        }

        try {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Product with ID " + id + " has been deleted", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}