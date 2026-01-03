import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logoremove.png";

const navItems = [
  { name: "HOME", path: "/" },
  { name: "COMPANY", path: "/about" },

  {
    name: "SERVICES",
    link: [
      { name: "Software Solutions", path: "/softwaresolutions" },
      { name: "Terms & Conditions", path: "/termsandCondition" },
    ],
  },

  {
    name: "EVENTS",
    link: [
      { name: "Gallery", path: "/gallery" },
      { name: "7Days-Ai-challange", path: "/7Days-AI-innovation" },
      { name: "Young Innovator", path: "/7Days-AI-innovation" },
    ],
  },
  {
    name: "CAREER",
    link: [{ name: "Internship Offered", path: "/courses" },
       { name: "Verify Certificate", path: "/verifyCertificate" },
    ],
  },
   { name: "CONTACT", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const getLinkClasses = (path) =>
    `text-base font-semibold transition duration-200 ease-in-out pt-1 ${
      location.pathname === path
        ? "text-blue-700 border-b-2 border-blue-700"
        : "text-gray-900 hover:text-blue-600 hover:border-b-2 hover:border-blue-400"
    }`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50">
      <div
        className={`transition-all duration-300 ${
          isScrolled ? "backdrop-blur-md bg-white/30 shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-9xl mx-auto p-3 md:p-5">
          <div className="flex justify-between items-center h-16 max-w-6xl">
            {/* LOGO */}
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                className="w-[130px] md:w-[150px] object-contain"
              />
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.name} className="relative flex items-center">
                  {item.path ? (
                    <Link to={item.path} className={getLinkClasses(item.path)}>
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center gap-1 text-base font-semibold text-gray-900 hover:text-blue-600 transition"
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`text-blue-500 transition-transform duration-300 ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}

                  {/* DROPDOWN */}
                  {item.link && (
                    <div
                      className={`absolute top-full left-0 mt-2 w-56 rounded-xl bg-white/90 backdrop-blur-md shadow-xl border
                        transform transition-all duration-300 ease-out
                        ${
                          openDropdown === item.name
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
                        }`}
                    >
                      {item.link.map((sub, index) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-600 hover:text-white transition
                            ${index === 0 ? "rounded-t-xl" : ""}
                            ${index === item.link.length - 1 ? "rounded-b-xl" : ""}`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md bg-white shadow"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`transition-all duration-300 backdrop-blur-md bg-white/30 shadow-md overflow-hidden ${
            isOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="px-3 py-4 space-y-3">
            {navItems.flatMap((item) =>
              item.path ? (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={toggleMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-center transition
                    ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-blue-600 hover:bg-blue-700 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ) : (
                item.link.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-center transition
                      ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "text-blue-600 hover:bg-blue-700 hover:text-white"
                      }`
                    }
                  >
                    {sub.name}
                  </NavLink>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
