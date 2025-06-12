package lk.ac.vau.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lk.ac.vau.Model.Product;
import lk.ac.vau.Service.ProductService;

@RestController
@RequestMapping("/pro")
public class ProductController {

    @Autowired
    private ProductService service;

    // Filter products by category ID
    @GetMapping("/{id}")
    public ResponseEntity<List<Product>> filterByCat(@PathVariable("id") int id) {
        List<Product> filteredProducts = service.filterProducts(id);
        return new ResponseEntity<>(filteredProducts, HttpStatus.OK);
    }

    // Search products by seller's manufacturing district
    @GetMapping("/district/{district}")
    public ResponseEntity<List<Product>> searchByDistrict(@PathVariable("district") String district) {
        List<Product> products = service.searchByDistrict(district);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Place an order
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> orderData) {
        try {
            String customerId = (String) orderData.get("customerId");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemsList = (List<Map<String, Object>>) orderData.get("items");

            // Validate input
            if (customerId == null || itemsList == null || itemsList.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("code", 400);
                errorResponse.put("status", "BAD REQUEST");
                errorResponse.put("message", "Missing required data");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            // Validate each item
            for (Map<String, Object> itemData : itemsList) {
                Integer productId = (Integer) itemData.get("productId");
                Integer qty = (Integer) itemData.get("qty");

                if (productId == null || qty == null || qty <= 0) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("code", 400);
                    errorResponse.put("status", "BAD REQUEST");
                    errorResponse.put("message", "Invalid item data");
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }

                Optional<Product> productOpt = service.findProductById(productId);
                if (!productOpt.isPresent()) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("code", 404);
                    errorResponse.put("status", "NOT FOUND");
                    errorResponse.put("message", "Product not found");
                    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
                }

                Product product = productOpt.get();
                if (qty > product.getStock()) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("code", 406);
                    errorResponse.put("status", "NOT ACCEPTABLE");
                    errorResponse.put("message", "Not enough stock! Available stock for " +
                            product.getName() + " is " + product.getStock());
                    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_ACCEPTABLE);
                }
            }

            return new ResponseEntity<>("Your order placed", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 406);
            errorResponse.put("status", "NOT ACCEPTABLE");
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("status", "INTERNAL SERVER ERROR");
            errorResponse.put("message", "Order processing failed");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
