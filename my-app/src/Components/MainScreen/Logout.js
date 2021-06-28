function Logout(){
    function logOt(){
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("position");
    localStorage.removeItem("loggednInUsername");
    window.location.reload();
}
    return <button onClick={logOt}>Logout</button>
}
export default Logout;