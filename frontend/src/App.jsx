
import { useState } from "react";
import "./App.css";

function App() {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("3 Days");
  const [budget, setBudget] = useState("₹10,000 - ₹20,000");

  const destinations = [
    {
      name: "Coorg",
      state: "Karnataka",
      description: "Explore coffee plantations and misty hills.",
      image:
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
    },
    {
      name: "Munnar",
      state: "Kerala",
      description: "Discover beautiful tea gardens and mountains.",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    },
    {
      name: "Jaipur",
      state: "Rajasthan",
      description: "Experience royal palaces and rich culture.",
      image:
        "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800",
    },
   {
   name: "Hampi",
    state: "Karnataka",
    description: "Explore ancient temples and historic ruins.",
    image:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Virupaksha%20temple%20among%20the%20ruins%20in%20Hampi.JPG?width=800",
  },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!destination.trim()) {
      alert("Please enter a destination!");
      return;
    }

    alert(
      `Your trip request:\nDestination: ${destination}\nDuration: ${duration}\nBudget: ${budget}`
    );
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="#" className="logo">
          <span className="logo-icon">✈</span>
          Travel<span>Genie</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#destinations">Explore</a>
          <a href="#planner">AI Trip Planner</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">YOUR PERSONAL AI TRAVEL COMPANION</p>

          <h1>
            Discover Your Next
            <br />
            <span>Adventure</span>
          </h1>

          <p className="hero-description">
            Explore amazing destinations, discover hidden gems and create
            personalized travel itineraries with the power of AI.
          </p>

          <div className="hero-buttons">
            <a href="#planner" className="primary-btn">
              Plan My Trip <span>→</span>
            </a>
            <a href="#destinations" className="secondary-btn">
              Explore Destinations
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <h3>100+</h3>
              <p>Destinations</p>
            </div>
            <div>
              <h3>AI Powered</h3>
              <p>Trip Planning</p>
            </div>
            <div>
              <h3>24/7</h3>
              <p>Travel Assistant</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRIP PLANNER */}
      <section className="planner-section" id="planner">
        <div className="section-heading">
          <p className="eyebrow">START YOUR JOURNEY</p>
          <h2>Where do you want to go?</h2>
          <p>Tell us your preferences and let AI plan your perfect trip.</p>
        </div>

        <form className="planner-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              placeholder="Where do you want to travel?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>1 Day</option>
              <option>2 Days</option>
              <option>3 Days</option>
              <option>5 Days</option>
              <option>7 Days</option>
              <option>10 Days</option>
            </select>
          </div>

          <div className="form-group">
            <label>Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option>Below ₹5,000</option>
              <option>₹5,000 - ₹10,000</option>
              <option>₹10,000 - ₹20,000</option>
              <option>₹20,000 - ₹50,000</option>
              <option>Above ₹50,000</option>
            </select>
          </div>

          <button type="submit" className="primary-btn search-btn">
            Generate Trip →
          </button>
        </form>
      </section>

      {/* DESTINATIONS */}
      <section className="destinations-section" id="destinations">
        <div className="section-heading">
          <p className="eyebrow">EXPLORE INDIA</p>
          <h2>Popular Destinations</h2>
          <p>Find inspiration for your next unforgettable journey.</p>
        </div>

        <div className="destination-grid">
          {destinations.map((place) => (
            <article className="destination-card" key={place.name}>
              <img src={place.image} alt={place.name} />

              <div className="destination-info">
                <p>{place.state}, India</p>
                <h3>{place.name}</h3>
                <p className="destination-description">
                  {place.description}
                </p>
                <button
                  className="explore-btn"
                  onClick={() => setDestination(place.name)}
                >
                  Explore Destination →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* AI FEATURE SECTION */}
      <section className="ai-section" id="about">
        <div className="ai-content">
          <p className="eyebrow">TRAVEL SMARTER WITH AI</p>
          <h2>Your Journey, Planned by Intelligence.</h2>
          <p>
            From personalized itineraries to hidden attractions and budget
            estimates, TravelGenie helps you plan your journey with less effort
            and more discovery.
          </p>

          <a href="#planner" className="primary-btn">
            Start Planning →
          </a>
        </div>

        <div className="ai-features">
          <div className="feature-card">
            <span>✦</span>
            <h3>AI Trip Planner</h3>
            <p>Create personalized day-wise travel itineraries.</p>
          </div>

          <div className="feature-card">
            <span>⌖</span>
            <h3>Hidden Gems</h3>
            <p>Discover interesting places beyond popular attractions.</p>
          </div>

          <div className="feature-card">
            <span>₹</span>
            <h3>Smart Budget</h3>
            <p>Organize your travel expenses and budget.</p>
          </div>

          <div className="feature-card">
            <span>☁</span>
            <h3>Travel Assistant</h3>
            <p>Get AI-powered answers to your travel questions.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#home" className="logo">
          ✈ Travel<span>Genie</span>
        </a>
        <p>Explore more. Travel smarter. Discover India.</p>
        <p className="copyright">
          © 2026 TravelGenie AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
