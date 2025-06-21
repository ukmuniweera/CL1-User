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
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
        
        // Keep the existing user reference
        User user = existing.getUser();
                
        // Update fields only if they're provided
        if (product.getName() != null && !product.getName().trim().isEmpty()) {
            existing.setName(product.getName());
        }
        
        if (product.getImage() != null) {
            existing.setImage(product.getImage());
        }
        
        if (product.getDescription() != null) {
            existing.setDescription(product.getDescription());
        }
        
        if (product.getPrice() > 0) {
            existing.setPrice(product.getPrice());
        }
        
        // Update product type fields
        if (product.getProductType() != null) {
            existing.setProductType(product.getProductType());
            
            // If product type is spare part, validate and update related fields
            if ("spare part".equals(product.getProductType())) {
                if (product.getBrand() != null && !product.getBrand().trim().isEmpty()) {
                    existing.setBrand(product.getBrand());
                } else if (existing.getBrand() == null || existing.getBrand().trim().isEmpty()) {
                    throw new IllegalArgumentException("Brand is required for spare parts");
                }
                
                if (product.getPartType() != null && !product.getPartType().trim().isEmpty()) {
                    existing.setPartType(product.getPartType());
                } else if (existing.getPartType() == null || existing.getPartType().trim().isEmpty()) {
                    throw new IllegalArgumentException("Part type is required for spare parts");
                }
                
                if (product.getBikeModel() != null && !product.getBikeModel().trim().isEmpty()) {
                    // Format bike model
                    String bikeModel = product.getBikeModel().toUpperCase().replace(" ", "-");
                    existing.setBikeModel(bikeModel);
                } else if (existing.getBikeModel() == null || existing.getBikeModel().trim().isEmpty()) {
                    throw new IllegalArgumentException("Bike model is required for spare parts");
                }
            }
        } else {
            // Handle spare part fields if product type isn't provided
            if ("spare part".equals(existing.getProductType())) {
                if (product.getBrand() != null) {
                    if (product.getBrand().trim().isEmpty()) {
                        throw new IllegalArgumentException("Brand cannot be empty for spare parts");
                    }
                    existing.setBrand(product.getBrand());
                }
                
                if (product.getPartType() != null) {
                    if (product.getPartType().trim().isEmpty()) {
                        throw new IllegalArgumentException("Part type cannot be empty for spare parts");
                    }
                    existing.setPartType(product.getPartType());
                }
                
                if (product.getBikeModel() != null) {
                    if (product.getBikeModel().trim().isEmpty()) {
                        throw new IllegalArgumentException("Bike model cannot be empty for spare parts");
                    }
                    // Format bike model
                    String bikeModel = product.getBikeModel().toUpperCase().replace(" ", "-");
                    existing.setBikeModel(bikeModel);
                }
            }
        }
        
        // Set the user relationship back
        existing.setUser(user);
        
        return productRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteProduct(int id) {
        // Check if product exists
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Product not found with id " + id);
        }
        productRepository.deleteById(id);
    }
    
    @Override
    public boolean userOwnsProduct(int userId, int productId) {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isPresent()) {
            User user = product.get().getUser();
            return user != null && user.getId() == userId;
        }
        return false;
    }
    
 // Scheduled to run daily at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteOldProducts() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<Product> oldProducts = productRepository.findByCreatedAtBefore(cutoffDate);

        productRepository.deleteAll(oldProducts);
        System.out.println("Deleted products older than 30 days.");
    }

	@Override
	public Optional<User> getUserByUsername(String username) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public User saveUser(User user) {
		// TODO Auto-generated method stub
		return null;
	}
}