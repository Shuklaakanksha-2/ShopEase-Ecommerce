
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shopease-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('shopease-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Fetch products from API
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem('shopease-cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    localStorage.setItem('shopease-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add to cart
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Increase quantity
  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Wishlist toggle
  const toggleWishlist = (product) => {
    setWishlist(prev =>
      prev.some(item => item.id === product.id)
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product]
    );
  };

  // Search and category filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === 'all' || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * 85 * item.quantity, 0
  );

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">ShopEase.</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#cart">My Cart</a>
          <a href="#wishlist">Wishlist</a>
        </div>

        <div className="nav-icons">
          🛒 Cart ({totalItems})
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Discover Your Style</h1>
          <p>Find the best products at amazing prices.</p>

          <button onClick={() =>
            document.getElementById('products').scrollIntoView({
              behavior: 'smooth'
            })
          }>
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" id="products">
        <h2>Our Products</h2>
        <p>Explore our latest collection</p>

        {/* Search and Filter */}
        <div className="filter-section">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewellery</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
          </select>
        </div>

        {/* Product List */}
        {loading ? (
          <h3>Loading Products...</h3>
        ) : filteredProducts.length === 0 ? (
          <h3>No products found!</h3>
        ) : (
          <div className="product-container">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>

                <img
                  src={product.image}
                  alt={product.title}
                  className="product-img"
                />

                <h3>{product.title}</h3>

                <p>₹{(product.price * 85).toFixed(0)}</p>

                <button onClick={() => addToCart(product)}>
                  Add to Cart
                </button>

                <button
                  className="wishlist-btn"
                  onClick={() => toggleWishlist(product)}
                >
                  {wishlist.some(item => item.id === product.id)
                    ? '❤️ Remove Wishlist'
                    : '♡ Add Wishlist'}
                </button>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shopping Cart */}
      <section className="cart-section" id="cart">
        <h2>My Shopping Cart 🛒</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty. Start shopping!</p>
        ) : (
          <>
            {cart.map(item => (
              <div className="cart-item" key={item.id}>

                <img src={item.image} alt={item.title} />

                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p>₹{(item.price * 85).toFixed(0)}</p>

                  <div className="quantity">
                    <button onClick={() => decreaseQty(item.id)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQty(item.id)}>
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))}

            <div className="cart-total">
              <h3>Total: ₹{totalPrice.toFixed(2)}</h3>

              <button onClick={() => alert('Checkout coming soon!')}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </section>

      {/* Wishlist */}
      <section className="wishlist-section" id="wishlist">
        <h2>My Wishlist ❤️</h2>

        {wishlist.length === 0 ? (
          <p>No favourite products yet!</p>
        ) : (
          <div className="product-container">
            {wishlist.map(product => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-img"
                />

                <h3>{product.title}</h3>
                <p>₹{(product.price * 85).toFixed(0)}</p>

                <button onClick={() => addToCart(product)}>
                  Add to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => toggleWishlist(product)}
                >
                  Remove Wishlist
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <h2>ShopEase.</h2>
        <p>Your favourite online shopping destination.</p>
        <p>© 2026 ShopEase. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;
