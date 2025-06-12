----------------------------------------------
                    ICAE 02
----------------------------------------------

// src/main/resources/application.properties

spring.application.name=ICAE02(2024)
spring.datasource.url=jdbc:mysql://localhost:3306/Palmyra
spring.datasource.username=root
spring.datasource.password=     # Leave blank or put your MySQL password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update

// src/lk/ac/vau/model/User.java
package lk.ac.vau.Model;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String address;

    public User() {}

    public User(String id, String name, String email, String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}

// src/lk/ac/vau/Repo/ProductRepo.java
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

    // Search by seller's manufacturing district
    @Query("SELECT p FROM Product p WHERE p.seller.district = :district")
    List<Product> findByManufacturingDistrict(@Param("district") String district);
}

// src/lk/ac/vau/Service/ProductService.java
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

    // Get products by category ID
    public List<Product> filterProducts(int id) {
        return repo.filterByCat(id);
    }

    // Get products by district
    public List<Product> searchByDistrict(String district) {
        return repo.findByManufacturingDistrict(district);
    }

    // Find product by ID
    public Optional<Product> findProductById(int id) {
        return repo.findById(id);
    }
}

// File: src/lk/ac/vau/controller/ProductController.java
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
@RequestMapping("/pro") // Base URL path for all product-related APIs
public class ProductController {

    @Autowired
    private ProductService service;

    // 1. Filter products by category ID
    @GetMapping("/{id}")
    public ResponseEntity<List<Product>> filterByCat(@PathVariable("id") int id) {
        // Get filtered product list from service
        List<Product> products = service.filterProducts(id);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // 2. Search products by seller's district
    @GetMapping("/district/{district}")
    public ResponseEntity<List<Product>> searchByDistrict(@PathVariable("district") String district) {
        List<Product> products = service.searchByDistrict(district);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // 3. Place an order with multiple products
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> orderData) {
        try {
            // Extract customer ID
            String customerId = (String) orderData.get("customerId");

            // Extract product items from the order
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemsList = (List<Map<String, Object>>) orderData.get("items");

            // Basic validation
            if (customerId == null || itemsList == null || itemsList.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("code", 400);
                errorResponse.put("status", "BAD REQUEST");
                errorResponse.put("message", "Missing required data");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            // Check stock for each product
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

                // Check product existence
                Optional<Product> productOpt = service.findProductById(productId);
                if (!productOpt.isPresent()) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("code", 404);
                    errorResponse.put("status", "NOT FOUND");
                    errorResponse.put("message", "Product not found");
                    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
                }

                Product product = productOpt.get();

                // Validate stock
                if (qty > product.getStock()) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("code", 406);
                    errorResponse.put("status", "NOT Acceptable");
                    errorResponse.put("message", "Do not have enough stock! Available stock for " +
                            product.getName() + " is " + product.getStock());
                    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_ACCEPTABLE);
                }
            }

            // If all checks pass
            return new ResponseEntity<>("Your order placed", HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 406);
            errorResponse.put("status", "NOT Acceptable");
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

----------------------------------------------
                employeeapp
----------------------------------------------

// employeeapp/src/main/resources/application.properties
# Application Name
spring.application.name=employeeapp

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/employee
spring.datasource.username=root
spring.datasource.password=

# JDBC Driver
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate auto-update
spring.jpa.hibernate.ddl-auto=update

// Import necessary packages
package lk.ac.vau.fas.ict;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.dao.DuplicateKeyException;

import jakarta.persistence.*;
import java.util.*;

// ----------- MAIN CLASS -----------
@SpringBootApplication
public class EmployeeAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmployeeAppApplication.class, args);
    }
}

// ----------- MODELS -----------

@Entity
class Department {
    @Id
    private int id;
    private String name;
    private String established;

    // One-to-Many relationship with Employee
    @OneToMany(mappedBy = "department")
    private List<Employee> employees;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEstablished() { return established; }
    public void setEstablished(String established) { this.established = established; }
    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }
}

@Entity
class Employee {
    @Id
    private String empNo;
    private String name;
    private String gender;
    private double salary;

    // Many-to-One relationship with Department
    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    // Getters and Setters
    public String getEmpNo() { return empNo; }
    public void setEmpNo(String empNo) { this.empNo = empNo; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
}

// A custom response object for department + employee count
class ViewDepartment {
    private int id;
    private String name;
    private String established;
    private int empCount;

    public ViewDepartment(int id, String name, String established, int empCount) {
        this.id = id;
        this.name = name;
        this.established = established;
        this.empCount = empCount;
    }

    // Getters
    public int getId() { return id; }
    public String getName() { return name; }
    public String getEstablished() { return established; }
    public int getEmpCount() { return empCount; }
}

// For sending error responses
class ErrorResponce {
    private int code;
    private String message;

    public ErrorResponce(int code, String message) {
        this.code = code;
        this.message = message;
    }

    // Getters
    public int getCode() { return code; }
    public String getMessage() { return message; }
}

// ----------- REPOSITORIES -----------

@Repository
interface DepartmentRepo extends JpaRepository<Department, Integer> {
    @Query("SELECT name FROM Department")
    public List<String> getDeptNames();

    @Query("SELECT d FROM Department d WHERE d.name LIKE %:name%")
    public List<Department> searchName(String name);

    @Query("SELECT count(*) FROM Department d JOIN d.employees WHERE d.id = ?1")
    public int numberOfEmp(int did);
}

@Repository
interface EmployeeRepo extends JpaRepository<Employee, String> {
    @Query("SELECT e FROM Employee e WHERE e.salary BETWEEN ?1 AND ?2")
    public List<Employee> getEmpSalary(double s1, double s2);
}

// ----------- SERVICES -----------

@Service
class DepartmentService {
    @Autowired
    private DepartmentRepo repo;

    public List<Department> getDept() {
        return repo.findAll();
    }

    public Department getDept(int id) {
        return repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Department Not found"));
    }

    public String addDept(Department department) {
        if (repo.findById(department.getId()).isPresent()) {
            throw new DuplicateKeyException("The Department id is already available");
        }
        repo.save(department);
        return "New Department added";
    }

    public List<String> getDepartmentNames() {
        List<String> names = repo.getDeptNames();
        if (names.isEmpty())
            throw new EntityNotFoundException("Department Not found");
        return names;
    }

    public List<Department> searchDepartmentByName(String name) {
        List<Department> results = repo.searchName(name);
        if (results.isEmpty())
            throw new EntityNotFoundException("Department Not found");
        return results;
    }

    public int getEmpCount(int id) {
        getDept(id); // will throw if not found
        return repo.numberOfEmp(id);
    }

    public ViewDepartment getEmpCountView(int id) {
        Department department = getDept(id);
        return new ViewDepartment(department.getId(), department.getName(),
                department.getEstablished(), getEmpCount(id));
    }
}

@Service
class EmployeeService {
    @Autowired
    private EmployeeRepo repo;

    public List<Employee> getEmp() {
        return repo.findAll();
    }

    public Employee getEmps(String id) {
        return repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Employee Not found"));
    }

    public List<Employee> getEmployeeBySalary(double s1, double s2) {
        List<Employee> results = repo.getEmpSalary(s1, s2);
        if (results.isEmpty())
            throw new EntityNotFoundException("Employee Not found");
        return results;
    }
}

// ----------- CONTROLLERS -----------

@RestController
@RequestMapping("/dept")
class DepartmentController {
    @Autowired
    public DepartmentService service;

    @GetMapping
    public ResponseEntity<List<Department>> getDept() {
        return new ResponseEntity<>(service.getDept(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDept(@PathVariable int id) {
        return new ResponseEntity<>(service.getDept(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> addDept(@RequestBody Department department) {
        return new ResponseEntity<>(service.addDept(department), HttpStatus.OK);
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getDeptNames() {
        return new ResponseEntity<>(service.getDepartmentNames(), HttpStatus.OK);
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<Department>> searchName(@PathVariable String name) {
        return new ResponseEntity<>(service.searchDepartmentByName(name), HttpStatus.OK);
    }

    @GetMapping("/empcount/{id}")
    public ResponseEntity<Integer> countEmp(@PathVariable int id) {
        return new ResponseEntity<>(service.getEmpCount(id), HttpStatus.OK);
    }

    @GetMapping("/vempcount/{id}")
    public ResponseEntity<ViewDepartment> vcountEmp(@PathVariable int id) {
        return new ResponseEntity<>(service.getEmpCountView(id), HttpStatus.OK);
    }
}

@RestController
@RequestMapping("/emp")
class EmployeeController {
    @Autowired
    public EmployeeService service;

    @GetMapping
    public ResponseEntity<List<Employee>> getEmp() {
        return new ResponseEntity<>(service.getEmp(), HttpStatus.OK);
    }

    @GetMapping("/{empNo}")
    public ResponseEntity<Employee> getEmpById(@PathVariable String empNo) {
        return new ResponseEntity<>(service.getEmps(empNo), HttpStatus.OK);
    }

    @GetMapping("/salary/{n1}/{n2}")
    public ResponseEntity<List<Employee>> findBySalaryRange(@PathVariable double n1, @PathVariable double n2) {
        return new ResponseEntity<>(service.getEmployeeBySalary(n1, n2), HttpStatus.OK);
    }
}

// ----------- GLOBAL EXCEPTION HANDLER -----------

@RestControllerAdvice
class GenericExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponce> handleEntityNotFound(EntityNotFoundException e) {
        return new ResponseEntity<>(new ErrorResponce(HttpStatus.NOT_FOUND.value(), e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ErrorResponce> handleDuplicateKey(DuplicateKeyException e) {
        return new ResponseEntity<>(new ErrorResponce(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponce> handleCommon(Exception e) {
        return new ResponseEntity<>(new ErrorResponce(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
