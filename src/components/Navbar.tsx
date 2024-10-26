import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            AI Meal Planner
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link href="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/meal-plan" className="hover:text-blue-200">
                Meal Plan
              </Link>
            </li>
            <li>
              <Link href="/recipes" className="hover:text-blue-200">
                Recipes
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-blue-200">
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
