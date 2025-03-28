{/* Login Button */}
import { Link } from "react-router-dom";
export default function LogoutButton(){
    return(
        <Link to="/" className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500">
          Logout
        </Link>
    );
}