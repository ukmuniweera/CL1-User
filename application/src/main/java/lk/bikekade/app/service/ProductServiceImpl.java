package lk.bikekade.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lk.bikekade.app.model.Product;
import lk.bikekade.app.model.User;
import lk.bikekade.app.repository.ProductRepository;
import lk.bikekade.app.repository.UserRepository;

import org.springframework.scheduling.annotation.Scheduled;
import java.time.LocalDateTime;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public Product saveProduct(Product product, User user) {
        validateProduct(product);
        product.setUser(user);
        return productRepository.save(product);
    }
    
    @Override
    @Transactional
    public Product saveProduct(Product product, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
        return saveProduct(product, user);
    }

    @Override
    @Transactional
    public Product saveProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }
    
    private void validateProduct(Product product) {
        // Basic validation
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        
        if (product.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }
        
        // Validate spare part specific fields
        if ("spare part".equals(product.getProductType())) {
            if (product.getBrand() == null || product.getBrand().trim().isEmpty()) {
                throw new IllegalArgumentException("Brand is required for spare parts");
            }
            
            if (product.getPartType() == null || product.getPartType().trim().isEmpty()) {
                throw new IllegalArgumentException("Part type is required for spare parts");
            }
            
            if (product.getBikeModel() == null || product.getBikeModel().trim().isEmpty()) {
                throw new IllegalArgumentException("Bike model is required for spare parts");
            }
            
            // Ensure bike model follows the format rules (uppercase, no spaces)
            String bikeModel = product.getBikeModel().toUpperCase().replace(" ", "-");
            product.setBikeModel(bikeModel);
        }
        
        // Trim whitespace from string fields
        product.setName(product.getName().trim());
        if (product.getDescription() != null) {
            product.setDescription(product.getDescription().trim());
        }
        if (product.getBrand() != null) {
            product.setBrand(product.getBrand().trim());
        }
        if (product.getPartType() != null) {
            product.setPartType(product.getPartType().trim());
        }
        if (product.getBikeModel() != null) {
            product.setBikeModel(product.getBikeModel().trim());
        }
        
        // Handle potential large image data
        if (product.getImage() != null && product.getImage().length() > 1_000_000) {
            System.out.println("Large image detected: " + product.getImage().length() + " characters");
        }
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    @Override
    public List<Product> getProductsByUser(User user) {
        return productRepository.findByUser(user);
    }
    
    @Override
    public List<Product> getProductsByUserId(int userId) {
        return productRepository.findByUserId(userId);
    }
    
    @Override
    public List<Product> getProductsByUsername(String username) {
        return productRepository.findByUserUname(username);
    }

    @Override
    public Optional<Product> getProductById(int id) {
        return productRepository.findById(id);
    }

    @Override
    @Transactional
    public Product updateProduct(int id, Product product) {
        Product