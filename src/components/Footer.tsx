import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 md:gap-12">

          {/* Brand & About */}
          <div className="col-span-2 sm:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="EcoCoin Market Logo" className="h-10 w-auto" />
              <h3 className="text-2xl font-bold text-white tracking-tight">
                <span className="text-primary">EcoCoin</span> Market
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium coconut coir products for gardening, construction, and sustainable living.
              Connecting you with quality, eco-friendly solutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Storefront", path: "/storefront" },
                { name: "Products", path: "/products" },
                { name: "Sellers", path: "/seller/login" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-sm hover:text-primary transition-colors duration-200"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Information</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "About Us", path: "/about" },
                { name: "Help Center", path: "#" },
                { name: "Terms of Service", path: "#" },
                { name: "Privacy Policy", path: "#" },
                { name: "Returns & Refunds", path: "#" },
                { name: "Shipping Info", path: "#" },
              ].map((item, index) => (
                <li key={index}>
                  {item.path.startsWith("/") ? (
                    <Link to={item.path} className="hover:text-primary transition-colors duration-200">
                      {item.name}
                    </Link>
                  ) : (
                    <a href={item.path} className="hover:text-primary transition-colors duration-200">
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 shrink-0" size={18} />
                <p>Cavite, Philippines</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary shrink-0" size={18} />
                <a href="mailto:Brainworks@gmail.com" className="hover:text-primary transition-colors">
                  Brainworks@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={18} />
                <span className="hover:text-primary transition-colors">+09502518065</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} EcoCoin Market. All rights reserved.</p>
          <p>For educational purposes only, and no copyright infringement is intended.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
