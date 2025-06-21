export const API_URL = "http://localhost:8080/product";

export const BRANDS = [
  "Yamaha",
  "Honda",
  "Kawasaki",
  "Suzuki",
  "KTM",
  "Husqvarna",
];

export const PART_TYPES = [
  "Engine Part",
  "Body Part",
  "Electric Part",
  "Suspension",
  "Brakes",
  "Drivetrain",
  "Wheels And Tires",
  "Exhaust System",
  "Air Intake",
  "Cooling System",
  "Fuel System",
  "Controls And Handlebars",
  "Frame And Chassis",
  "Lighting",
  "Protection Accessories",
];

export const PRICE_RANGES = [
  { label: "Any Price", value: "" },
  { label: "Under Rs.5,000", value: "0-5000" },
  { label: "Rs.5,000 - Rs.10,000", value: "5000-10000" },
  { label: "Rs.10,000 - Rs.20,000", value: "10000-20000" },
  { label: "Rs.20,000 - Rs.50,000", value: "20000-50000" },
  { label: "Over Rs.50,000", value: "50000-999999" },
];

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
