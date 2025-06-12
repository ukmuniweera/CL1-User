package lk.ac.vau.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lk.ac.vau.Model.Product;
import lk.ac.vau.Repo.ProductRepo;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    // Filter by category ID
    public List<Product> filterProducts(int id) {
        return repo.filterByCat(id);
    }

    // Search by district
    public List<Product> searchByDistrict(String district) {
        return repo.findByManufacturingDistrict(district);
    }

    // Find product by ID
    public Optional<Product> findProductById(int id) {
        return repo.findById(id);
    }
}
