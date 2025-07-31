import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [bids, setBids] = useState({});
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  const [category, setCategory] = useState("All");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [idImage, setIdImage] = useState(null);
  const categories = ["All", "Electronics", "Furniture", "Fashion", "Gaming", "Photography", "Autos", "Parts", "Motorcycles", "Admin"];

  useEffect(() => {
    setListings([
      { id: "10", title: "Gaming Laptop", price: 999, description: "High-end laptop for gaming and editing", image: "https://via.placeholder.com/300x200?text=Gaming+Laptop", type: "auction", category: "Electronics", seller: "user@demo.com", endsAt: Date.now() + 60000 },
      { id: "admin-panel", title: "Admin Panel Access", description: "Manage user verifications and listing disputes.", image: "https://via.placeholder.com/300x200?text=Admin", type: "fixed", price: 0, category: "Admin", seller: "admin@bidzu.com" },
      { id: "0", title: "Sample Listing", price: 10, description: "Demo item.", image: "https://via.placeholder.com/300x200?text=Demo", type: "fixed", category: "Electronics", seller: "demo@bidzu.com" },
      { id: "1", title: "Wireless Headphones", price: 45, description: "High-quality over-ear headphones with noise cancellation.", image: "https://via.placeholder.com/300x200?text=Headphones", type: "fixed", category: "Electronics" },
      { id: "2", title: "Vintage Coffee Table", price: 80, description: "Solid wood coffee table in great condition.", image: "https://via.placeholder.com/300x200?text=Coffee+Table", type: "auction", category: "Furniture" },
      { id: "3", title: "Apple MacBook Pro 14\" M1", price: 1150, description: "Excellent condition, barely used, with original charger.", image: "https://via.placeholder.com/300x200?text=MacBook+Pro", type: "fixed", category: "Electronics" },
      { id: "4", title: "Designer Handbag", price: 230, description: "Authentic leather handbag, gently used.", image: "https://via.placeholder.com/300x200?text=Handbag", type: "auction", category: "Fashion" },
      { id: "5", title: "Gaming Chair", price: 140, description: "Ergonomic chair for PC/console gamers, includes lumbar support.", image: "https://via.placeholder.com/300x200?text=Gaming+Chair", type: "fixed", category: "Gaming" },
      { id: "6", title: "Canon DSLR Camera", price: 325, description: "Canon Rebel T7 with 18-55mm lens, great for photography beginners.", image: "https://via.placeholder.com/300x200?text=Camera", type: "auction", category: "Photography" },
      { id: "7", title: "Toyota Camry 2015", price: 8500, description: "Clean title, excellent condition, 120k miles.", image: "https://via.placeholder.com/300x200?text=Toyota+Camry", type: "auction", category: "Autos" },
      { id: "8", title: "Motorcycle Helmet", price: 65, description: "DOT approved full-face helmet, size L.", image: "https://via.placeholder.com/300x200?text=Helmet", type: "fixed", category: "Motorcycles" },
      { id: "9", title: "Car Tires - Set of 4", price: 280, description: "Used tires with good tread left, 18-inch size.", image: "https://via.placeholder.com/300x200?text=Car+Tires", type: "fixed", category: "Parts" }
    ]);
  }, []);

  const handleBuyNow = async (item) => {
    const response = await fetch("https://your-backend-domain.com/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: item.id,
        buyerId: "user456",
        amount: item.price
      })
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  };

  const filteredListings = category === "All" ? listings : listings.filter(item => item.category === category);

  return (
    <div> {/* Interface omitted here to keep export concise */} </div>
  );
}
