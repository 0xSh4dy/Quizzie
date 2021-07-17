import Navbar from "./Navbar";
import Hamburger from "./Hamburger";
const loggedInUsername = sessionStorage.getItem("loggedInUsername");


function MainScreenS(){
    
    function MainScreenSItems(){
        return <div className="MainScreenItems">
            <button>Scheduled Tests</button>
            <button>Current Courses</button>
        </div>
    }
    
    return <div>
        <Hamburger></Hamburger>
        <Navbar></Navbar>
        <MainScreenSItems></MainScreenSItems>
    </div>
}
export default MainScreenS;