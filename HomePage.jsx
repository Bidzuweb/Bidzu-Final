// BidZu Homepage with Firebase Auth, Checkout, Listings via Firestore, and Realtime Bid Placeholder
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDL-a1HCJ4J9f6u9XpmxVX22QYfHfr6jJE",
  authDomain: "bidzu-web-app.firebaseapp.com",
  projectId: "bidzu-web-app",
  storageBucket: "bidzu-web-app.appspot.com",
  messagingSenderId: "395074035545",
  appId: "1:395074035545:web:3180ecff55195f948f9748",
  measurementId: "G-TC0H1RFNZB"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function LoginSignupForm({ onClose, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const handleSubmit = async () => {
    try {
      const userCredential = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      onClose();
    } catch (err) {
      alert("Auth error: " + err.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✕</button>
        <h2 className="text-lg font-semibold mb-2">{isSignup ? "Sign Up" : "Login"}</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full p-2 border mb-2" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border mb-4" />
        <button onClick={handleSubmit} className="w-full bg-indigo-600 text-white py-2 rounded">{isSignup ? "Register" : "Login"}</button>
        <p className="text-xs mt-2 text-center cursor-pointer text-blue-600" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}

function CheckoutSummary({ item, userState, onClose }) {
  const platformFee = 0.03;
  const taxRate = {
    VA: 5.3, CA: 7.25, TX: 6.25, NY: 4, FL: 6, default: 5
  };
  const price = item.price || 100;
  const tax = (price * (taxRate[userState] || taxRate.default)) / 100;
  const fee = price * platformFee;
  const total = price + tax + fee;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2">✕</button>
        <h2 className="text-xl font-bold mb-4">Checkout Summary</h2>
        <p>Item: <strong>{item?.title}</strong></p>
        <p>Price: ${price.toFixed(2)}</p>
        <p>Platform Fee (3%): ${fee.toFixed(2)}</p>
        <p>{userState} Tax: ${tax.toFixed(2)}</p>
        <hr className="my-2" />
        <p className="font-bold">Total: ${total.toFixed(2)}</p>
        <button className="mt-4 w-full bg-green-600 text-white py-2 rounded">Place Order</button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [userState, setUserState] = useState("VA");
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const snapshot = await getDocs(collection(db, "listings"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    };
    fetchListings();
  }, []);

  const carouselImages = [
    "https://source.unsplash.com/featured/?electronics",
    "https://source.unsplash.com/featured/?car",
    "https://source.unsplash.com/featured/?fashion"
  ];
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Helmet>
        <title>BidZu - Marketplace</title>
        <meta name="description" content="BidZu - Buy, sell or bid with 3% fee." />
      </Helmet>

      {showLogin && <LoginSignupForm onClose={() => setShowLogin(false)} setUser={setUser} />}
      {checkoutItem && <CheckoutSummary item={checkoutItem} userState={userState} onClose={() => setCheckoutItem(null)} />}

      <header className="bg-indigo-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">BidZu</h1>
            {user ? <span className="text-sm">Welcome, {user.email}</span> : <button onClick={() => setShowLogin(true)} className="bg-white text-indigo-700 px-4 py-1 rounded">Login</button>}
          </div>
          <p className="text-sm mt-2">Only 3% fee. State tax applied.</p>
          <select value={userState} onChange={e => setUserState(e.target.value)} className="mt-2 p-1 rounded text-black">
            {Object.keys({ VA:1, CA:1, TX:1, NY:1, FL:1 }).map(st => (
              <option key={st}>{st}</option>
            ))}
          </select>
        </div>
      </header>

      <section className="bg-white py-4">
        <div className="max-w-4xl mx-auto">
          <Slider {...sliderSettings}>
            {carouselImages.map((img, i) => (
              <img key={i} src={img} className="w-full h-64 object-cover rounded-xl" />
            ))}
          </Slider>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Featured Listings</h2>
        {listings.length === 0 ? (
          <p className="text-center text-gray-500">No listings available. Please add products in Firebase.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(item => (
              <div key={item.id} className="p-4 bg-white border rounded shadow">
                <img src={item.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"} alt={item.title} className="w-full h-48 object-cover rounded mb-2" />
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-1">Price: ${item.price || 100}</p>
                <p className="text-xs text-gray-500 mb-2">3% fee + {userState} tax</p>
                <button onClick={() => setCheckoutItem(item)} className="bg-indigo-600 text-white px-3 py-1 rounded">Buy Now</button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white text-center py-4">
        BidZu © {new Date().getFullYear()}
      </footer>
    </div>
  );
}