package lk.ac.vau.Model;

public class Error {
	private int code;
	private String status;
	private String message;
	
	public Error() {
		
	}

	public Error(int code, String status, String message) {
		super();
		this.code = code;
		this.status = status;
		this.message = message;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
}
