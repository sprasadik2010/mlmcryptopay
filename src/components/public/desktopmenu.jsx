
{/* Desktop Menu */}

import { Link } from "react-router-dom";
export default function DeskTopMenu(){
    return(
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className="hover:text-blue-500">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-500">About</Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-blue-500">Services</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-500">Contact</Link>
          </li>
        </ul>
    );
}