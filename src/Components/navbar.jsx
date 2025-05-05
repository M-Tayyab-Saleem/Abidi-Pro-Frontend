import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom"; 
import {
  BellIcon,
  Cog6ToothIcon,
  UsersIcon,
  UserGroupIcon,
  FolderIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    applyTheme(savedTheme);

    if (savedTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    if (selectedTheme === "light") root.classList.add("theme-light");
    else if (selectedTheme === "dark") root.classList.add("theme-dark");
    else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.add(prefersDark ? "theme-dark" : "theme-light");
    }
  };

  const navLinks = [
    { name: "People", to: "/people", icon: UsersIcon },
    { name: "Team", to: "/team", icon: UserGroupIcon },
    { name: "Projects", to: "/projects", icon: FolderIcon },
    { name: "Calendar", to: "/calendar", icon: CalendarDaysIcon },
  ];

  return (
    <>
      <nav className="shadow-lg bg-primary text-text transition-colors duration-300 relative z-50">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between py-4">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <svg
                  className={`${mobileMenuOpen ? "hidden" : "block"} size-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <svg
                  className={`${mobileMenuOpen ? "block" : "hidden"} size-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
            </div>

            {/* Main Nav */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                {navLinks.map(({ name, to, icon: Icon }) => (
                  <NavLink
                  key={name}
                  to={to}
                  className={({ isActive }) =>
                    // Keep "People" link active if any subroute under "/people" is active
                    name === "People"
                      ? currentPath.startsWith("/people") || isActive
                        ? "relative group p-2 rounded-md bg-teal-700"
                        : "relative group p-2 rounded-md hover:bg-teal-700"
                      : isActive
                      ? "relative group p-2 rounded-md bg-teal-700"
                      : "relative group p-2 rounded-md hover:bg-teal-700"
                  }
                >
                    <Icon className="w-6 h-6 text-white" />
                    <span
                      className="absolute left-1/2 top-full mt-2 -translate-x-1/2 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out rounded px-3 py-1 text-xs shadow-lg z-10"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text)",
                      }}
                    >
                      {name}
                    </span>
                  </NavLink>
                ))}
                </div>
              </div>

              {/* Search */}
              <div className="hidden sm:block">
                <div className="items-center mx-4 relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="rounded-full px-4 py-1.5 pr-16 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-md w-60 lg:w-80 transition-all duration-300"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-white text-teal-700 px-3 py-1 text-sm font-semibold rounded-full shadow hover:bg-teal-90 transition-all duration-200"
                  >
                    Go
                  </button>
                </div>
              </div>

              {/* Notification */}
              <div className="relative ml-4">
                <button className="relative p-1 text-white rounded-md hover:bg-secondary">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                  <span
                    className={`absolute -top-0 -right-0 h-2 w-2 rounded-full ${
                      hasNotifications ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Settings (hidden on small) */}
              <div className="relative ml-4 hidden sm:block">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="p-1 text-white rounded-md hover:bg-secondary"
                >
                  <span className="sr-only">Open settings</span>
                  <Cog6ToothIcon className="w-6 h-6" />
                </button>
                {settingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 z-50 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-2">
                    <button
                      onClick={() => {
                        navigate("/theme-selector");
                        setSettingsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Theme Selector
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative ml-3">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="size-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    alt="User"
                  />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 bg-primary text-white">
            {navLinks.map(({ name, to, icon: Icon }) => (
              <Link
                key={name}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 ${
                  currentPath === to ? "bg-secondary" : "hover:bg-secondary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </Link>
            ))}
            <div className="relative ml-4">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-1 text-white rounded-md hover:bg-teal-700"
              >
                <span className="sr-only">Open settings</span>
                <Cog6ToothIcon className="w-6 h-6" />
              </button>
              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-40 z-50 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-2">
                  <button
                    onClick={() => {
                      navigate("/theme-selector");
                      setSettingsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Theme Selector
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
