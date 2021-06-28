import Navbar from "./Navbar";

function MainScreenT(){
    
    function MainScreenTItems(){
        return <div className="MainScreenItems">
            <button>Start a new course</button>
            <button>Current Courses</button>
        </div>
    }
   
    return <div>
        <Navbar></Navbar>
        <MainScreenTItems></MainScreenTItems>
    </div>
}
export default MainScreenT;