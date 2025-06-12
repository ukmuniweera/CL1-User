package lk.ac.vau.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
@Entity
public class Customer extends User {
    private String creditCardNo;
    private String shippingAddress;
    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private List<CustomerOrder>orders;
    
    public Customer() {
    	
    }
	public Customer(String creditCardNo, String shippingAddress, List<CustomerOrder> orders,String id, String name, String email, String address) {
		super(id, name, email, address);
		this.creditCardNo = creditCardNo;
		this.shippingAddress = shippingAddress;
		this.orders = orders;
	}
	public String getCreditCardNo() {
		return creditCardNo;
	}
	public void setCreditCardNo(String creditCardNo) {
		this.creditCardNo = creditCardNo;
	}
	public String getShippingAddress() {
		return shippingAddress;
	}
	public void setShippingAddress(String shippingAddress) {
		this.shippingAddress = shippingAddress;
	}
	public List<CustomerOrder> getOrders() {
		return orders;
	}
	public void setOrders(List<CustomerOrder> orders) {
		this.orders = orders;
	}
}
