package lk.ac.vau.Model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Product {
	@Id
	private int id;
    private String name;
    private double price;
    private String description;
    private int stock;
    @ManyToOne
    private Seller seller;
    @ManyToOne
    private Categorey categorey;
    @OneToMany(mappedBy = "product")
    private List<OrderItem>orderItems;
    
    public Product() {
    	
    }

	public Product(int id, String name, double price, String description, int stock, Seller seller, Categorey categorey,
			List<OrderItem> orderItems) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.description = description;
		this.stock = stock;
		this.seller = seller;
		this.categorey = categorey;
		this.orderItems = orderItems;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public Seller getSeller() {
		return seller;
	}

	public void setSeller(Seller seller) {
		this.seller = seller;
	}

	public Categorey getCategorey() {
		return categorey;
	}

	public void setCategorey(Categorey categorey) {
		this.categorey = categorey;
	}

	public List<OrderItem> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItem> orderItems) {
		this.orderItems = orderItems;
	}
}
