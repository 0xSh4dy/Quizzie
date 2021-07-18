function Logout(){
    let teacherLog = sessionStorage.getItem("teacherLog");
    function logOt(){
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("position");
    sessionStorage.removeItem("loggedInUsername");
    sessionStorage.removeItem("logEmail");
    sessionStorage.removeItem("courseClick");
    if(teacherLog){
        sessionStorage.removeItem("teacherLog");
    }
    window.location.reload();
}
    return <button onClick={logOt}>Logout</button>
}
export default Logout;