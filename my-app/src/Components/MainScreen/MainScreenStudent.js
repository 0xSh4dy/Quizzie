import Navbar from "./Navbar";
const loggedInUsername = localStorage.getItem("loggedInUsername");


function MainScreenS(){
    
    function MainScreenSItems(){
        return <div className="MainScreenItems">
            <button>Scheduled Tests</button>
            <button>Current Courses</button>
        </div>
    }
    
    return <div>
        <Navbar></Navbar>
        <MainScreenSItems></MainScreenSItems>
    </div>
}
export default MainScreenS;