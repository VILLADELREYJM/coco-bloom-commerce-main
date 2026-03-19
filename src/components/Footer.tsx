import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-footer text-footer-foreground">
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-primary-foreground font-display">EcoCoin Market</h3>
          <p className="text-sm leading-relaxed opacity-70">
            Premium coconut coir products for gardening, construction, and sustainable living.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground font-display">Quick Links</h4>
          <nav className="flex flex-col gap-2 text-sm opacity-70">
            <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <Link to="/storefront" className="hover:opacity-100 transition-opacity">Storefront</Link>
            <Link to="/products" className="hover:opacity-100 transition-opacity">Products</Link>
          </nav>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground font-display">Contact</h4>
          <div className="text-sm opacity-70 space-y-1">
            <p>Cavite, Philippines</p>
            <p>Brainworks@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-sidebar-border pt-6 text-center text-xs opacity-50">
        For educational purposes only, and no copyright infringement is intended.
      </div>
    </div>
  </footer>
);

export default Footer;
