

const Footer = () => {
  return (
    <footer className="footer">

      {/* TOP DECORATION */}
      <div className="footer-ornament">
        <span></span>
        <div>✦</div>
        <span></span>
      </div>

      {/* BRAND */}
      <div className="footer-brand">
        <h2>Sapta Vachan</h2>

        <p className="footer-tagline">
          Seven vows. One lifetime.
        </p>

        <p className="footer-description">
          Meaningful connections for people who believe
          in finding a partner for a lifetime.
        </p>
      </div>


      {/* LINKS */}
      <div className="footer-links">

        <div className="footer-column">
          <h3>Explore</h3>

          <a href="/">Home</a>
          <a href="/">Find Matches</a>
          <a href="/">Success Stories</a>
          <a href="/">About Us</a>
        </div>


        <div className="footer-column">
          <h3>Services</h3>

          <a href="/">Create Profile</a>
          <a href="/">Premium</a>
          <a href="/">Interests</a>
          <a href="/">Messages</a>
        </div>


        <div className="footer-column">
          <h3>Support</h3>

          <a href="/">Help Center</a>
          <a href="/">Safety & Security</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms & Conditions</a>
        </div>


        <div className="footer-column contact-column">
          <h3>Connect With Us</h3>

          <p>Have questions?</p>

          <a href="mailto:hello@saptavachan.com">
            hello@saptavachan.com
          </a>

          <div className="social-icons">
            <a href="/">IG</a>
            <a href="/">FB</a>
            <a href="/">YT</a>
          </div>
        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © 2026 Sapta Vachan. All rights reserved.
        </p>

        <p>
          Made for meaningful beginnings ♡
        </p>

      </div>

    </footer>
  );
};

export default Footer;
