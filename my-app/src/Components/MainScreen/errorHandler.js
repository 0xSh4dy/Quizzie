
function ErrorHandlerButton(){
    function ErrorHandler(){
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("position");
        sessionStorage.removeItem("loggedInUsername");
        window.location.reload();
    }
    return <div>
        
        <h1>Oops,some error occured. Login again</h1>
        <button onClick={ErrorHandler}>Logout</button>
    </div>
}
export default ErrorHandlerButton;