package lk.ac.vau.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
@Entity
public class Categorey {
	@Id
	private int id;
	private String name;
	@OneToMany(mappedBy = "categorey")
	@JsonIgnore
	private List<Product>products;
	
	public Categorey() {
		
	}

	public Categorey(int id, String name, List<Product> products) {
		this.id = id;
		this.name = name;
		this.products = products;
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

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

}
