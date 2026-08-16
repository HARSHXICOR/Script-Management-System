import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-teal-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <ImageWithFallback
                src="/src/imports/ChatGPT_Image_May_31__2026__09_56_13_PM.png"
                alt="xitixr"
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 transition-colors ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-blue-900/10 to-teal-900/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <ImageWithFallback
                src="/src/imports/ChatGPT_Image_May_31__2026__09_56_13_PM.png"
                alt="xitixr"
                className="h-8 w-auto mb-4"
              />
              <p className="text-gray-400 text-sm max-w-md">
                Premium website platform for creators, influencers, and content makers.
                Build your personal brand and grow your influence.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                {navLinks.slice(0, 4).map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4">Connect</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Instagram
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Twitter
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  LinkedIn
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  YouTube
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            <p>© 2026 xitixr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
