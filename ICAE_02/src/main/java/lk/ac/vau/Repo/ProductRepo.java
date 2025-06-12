package lk.ac.vau.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import lk.ac.vau.Model.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

    // Filter products by category ID
    @Query("SELECT p FROM Categorey c JOIN c.products p WHERE c.id = ?1")
    List<Product> filterByCat(int cid);

    // Search products by manufacturing district
    @Query("SELECT p FROM Product p WHERE p.seller.district = :district")
    List<Product> findByManufacturingDistrict(@Param("district") String district);
}
