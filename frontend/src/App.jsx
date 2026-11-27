
import { useState, useEffect } from "react";
import "./App.css";
import AttractionsMap from "./components/AttractionsMap";

function App() {
  // Trip planner states
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("3 Days");
  const [budget, setBudget] = useState("₹10,000 - ₹20,000");
  const [tripDate, setTripDate] = useState("");
  const [travellers, setTravellers] = useState("2");
  const [interests, setInterests] = useState([]);

  // Destination states
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDestinations, setTotalDestinations] = useState(0);

  // Selected destination for map
  const [selectedMapDestination, setSelectedMapDestination] = useState({
    name: "Mysuru",
    latitude: 12.2958,
    longitude: 76.6394,
  });

  const limit = 6;

  // Fetch destinations from backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (selectedState) {
          params.append("state", selectedState);
        }

        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        params.append("page", page);
        params.append("limit", limit);

        const response = await fetch(
          `http://localhost:8000/api/destinations?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }

        const result = await response.json();

        setDestinations(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalDestinations(result.total || 0);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Unable to load destinations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [search, selectedState, selectedCategory, page]);

  // Handle interest selection
  const handleInterestChange = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  // Handle trip planner submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!destination.trim()) {
      alert("Please enter a destination!");
      return;
    }

    if (!tripDate) {
      alert("Please select your travel date!");
      return;
    }

    if (interests.length === 0) {
      alert("Please select at least one interest!");
      return;
    }

    alert(`
Your Trip Details:

Destination: ${destination}
Travel Date: ${tripDate}
Duration: ${duration}
Travellers: ${travellers}
Budget: ${budget}
Interests: ${interests.join(", ")}
    `);
  };

  // Clear all Explore filters
  const clearFilters = () => {
    setSearch("");
    setSelectedState("");
    setSelectedCategory("");
    setPage(1);
  };

  // Reset pagination when searching
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  // Reset pagination when changing state
  const handleStateChange = (value) => {
    setSelectedState(value);
    setPage(1);
  };

  // Reset pagination when changing category
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1);
  };

  // Select destination and update map
  const handleExploreDestination = (place) => {
    const coordinates = place.location?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      !Number.isFinite(coordinates[0]) ||
      !Number.isFinite(coordinates[1])
    ) {
      alert("Coordinates are unavailable for this destination.");
      return;
    }

    setDestination(place.name);

    // GeoJSON coordinates: [longitude, latitude]
    setSelectedMapDestination({
      name: place.name,
      longitude: coordinates[0],
      latitude: coordinates[1],
    });

    // Scroll to map
    document
      .getElementById("map")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="#home" className="logo">
          <span className="logo-icon">✈</span>
          Travel<span>Genie</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#destinations">Explore</a>
          <a href="#planner">AI Trip Planner</a>
          <a href="#map">Nearby Attractions</a>
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
          <p className="eyebrow">
            YOUR PERSONAL AI TRAVEL COMPANION
          </p>

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
      <form
        className="planner-form"
        id="planner"
        onSubmit={handleSubmit}
      >
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
          <label>Travel Date</label>

          <input
            type="date"
            value={tripDate}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={(e) => setTripDate(e.target.value)}
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
          <label>Travellers</label>

          <select
            value={travellers}
            onChange={(e) => setTravellers(e.target.value)}
          >
            <option value="1">1 Traveller</option>
            <option value="2">2 Travellers</option>
            <option value="3">3 Travellers</option>
            <option value="4">4 Travellers</option>
            <option value="5">5 Travellers</option>
            <option value="6">6 Travellers</option>
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

        <div className="form-group interests-group">
          <label>What interests you?</label>

          <div className="interest-options">
            {[
              "Adventure",
              "Nature",
              "History",
              "Food",
              "Culture",
              "Relaxation",
            ].map((interest) => (
              <label className="interest-option" key={interest}>
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                />

                {interest}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="primary-btn search-btn"
        >
          Generate Trip →
        </button>
      </form>

      {/* DESTINATIONS / EXPLORE SECTION */}
      <section
        className="destinations-section"
        id="destinations"
      >
        <div className="section-heading">
          <p className="eyebrow">EXPLORE INDIA</p>

          <h2>Popular Destinations</h2>

          <p>
            Find inspiration for your next unforgettable journey.
          </p>
        </div>

        {/* SEARCH */}
        <div className="destination-search">
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* FILTERS */}
        <div className="destination-filters">
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <option value="">All States</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Nature">Nature</option>
            <option value="Adventure">Adventure</option>
            <option value="History">History</option>
            <option value="Food">Food</option>
            <option value="Culture">Culture</option>
            <option value="Relaxation">Relaxation</option>
          </select>

          <button
            type="button"
            className="explore-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* DESTINATION CARDS */}
        <div className="destination-grid">
          {loading ? (
            <p>Loading destinations...</p>
          ) : error ? (
            <p>{error}</p>
          ) : destinations.length === 0 ? (
            <p>No destinations found. Try different filters.</p>
          ) : (
            destinations.map((place) => (
              <article
                className="destination-card"
                key={place._id}
              >
                {/* IMAGE WITH FALLBACK */}
                <div className="destination-image-container">
                  <img
                    src={place.imageUrl || ""}
                    alt={place.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />

                  <div className="destination-image-placeholder">
                    Image unavailable
                  </div>
                </div>

                <div className="destination-info">
                  <p>{place.state}, India</p>

                  {/* CATEGORY BADGES */}
                  <div className="category-badges">
                    {place.categories?.map((category) => (
                      <span className="category-badge" key={category}>
                        {category}
                      </span>
                    ))}
                  </div>

                  <h3>{place.name}</h3>

                  <p className="destination-description">
                    {place.description ||
                      "Discover this beautiful destination."}
                  </p>

                  <button
                    type="button"
                    className="explore-btn"
                    onClick={() => handleExploreDestination(place)}
                  >
                    Explore Destination →
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {!loading && !error && destinations.length > 0 && (
          <div className="pagination">
            <p>
              Showing {destinations.length} of {totalDestinations} destinations
            </p>

            <div className="pagination-buttons">
              <button
                type="button"
                className="explore-btn"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                ← Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                className="explore-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* OPENSTREETMAP ATTRACTIONS SECTION */}
      <section className="attractions-section" id="map">
        <div className="section-heading">
          <p className="eyebrow">DISCOVER NEARBY PLACES</p>

          <h2>Explore Attractions on Map</h2>

          <p>
            Discover museums, viewpoints, historic places and other
            attractions around your destination.
          </p>

          <h3 style={{ marginTop: "20px" }}>
            Attractions near {selectedMapDestination.name}
          </h3>
        </div>

        <AttractionsMap
          latitude={selectedMapDestination.latitude}
          longitude={selectedMapDestination.longitude}
          radius={5000}
        />
      </section>

      {/* AI FEATURE SECTION */}
      <section className="ai-section" id="about">
        <div className="ai-content">
          <p className="eyebrow">
            TRAVEL SMARTER WITH AI
          </p>

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
