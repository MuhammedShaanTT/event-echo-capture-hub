
import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-brand-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span className="text-xl font-bold">Event Echo</span>
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="hover:text-brand-gray transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/add-event"
              className="hover:text-brand-gray transition-colors duration-200"
            >
              Add Event
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
