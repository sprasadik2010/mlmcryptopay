
{/* Navbar */}
import SocialMediaLinks from "../public/socialmedialinks";
import DeskTopMenu from "../public/desktopmenu";
import MobileMenu from "../public/mobilemenu";
import LogoutButton from "./logoutbtton";
export default function UserNavBar(){
    return(
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">MyWebsite</h1>
        <DeskTopMenu/>
        <SocialMediaLinks/>
        <LogoutButton/>
        <MobileMenu/>
      </div>
    </nav>
    )
}