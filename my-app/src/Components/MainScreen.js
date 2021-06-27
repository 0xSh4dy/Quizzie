const loggedInUsername = localStorage.getItem("loggedInUsername");
function MainScreenHead(){
    return <h1 id="MainScreenHeadh1" style={{textAlign:"center",fontFamily:""}}>Welcome, {loggedInUsername}</h1>
}
function MainScreen(){
    
    function MainScreenItems(){
        return <div className="MainScreenItems">
            <button>Start a new course</button>
            <button>Current Courses</button>
        </div>
    }
    function Logout(){
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem(loggedInUsername);
        window.location.reload();
    }
    return <div>
        <MainScreenHead></MainScreenHead>
        <MainScreenItems></MainScreenItems>
        <button onClick={Logout}>Logout</button>
    </div>
}
export default MainScreen;