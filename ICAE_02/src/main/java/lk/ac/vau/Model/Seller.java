package lk.ac.vau.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
@Entity
public class Seller extends User{
    private String companyName;
    private String contactInfo;
    @OneToMany(mappedBy = "seller")
    @JsonIgnore
    private List<Product>products;
    
    public Seller() {
    	
    }

	public Seller(String companyName, String contactInfo, List<Product> products,String id, String name, String email, String address) {
		super(id, name, email, address);
		this.companyName = companyName;
		this.contactInfo = contactInfo;
		this.products = products;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getContactInfo() {
		return contactInfo;
	}

	public void setContactInfo(String contactInfo) {
		this.contactInfo = contactInfo;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}
}
