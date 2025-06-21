package lk.bikekade.app.service;

import java.util.List;
import java.util.Optional;

import lk.bikekade.app.model.Product;
import lk.bikekade.app.model.User;

public interface ProductService {
    Product saveProduct(Product product, User user);
    Product saveProduct(Product product, int userId);
    Product saveProduct(Product product);  // Keep for backward compatibility
    List<Product> getAllProducts();
    List<Product> getProductsByUser(User user);
    List<Product> getProductsByUserId(int userId);
    List<Product> getProductsByUsername(String username);
    Optional<Product> getProductById(int id);
    Product updateProduct(int id, Product product);
    void deleteProduct(int id);
    boolean userOwnsProduct(int userId, int productId);
    Optional<User> getUserByUsername(String username);
    User saveUser(User user);
}