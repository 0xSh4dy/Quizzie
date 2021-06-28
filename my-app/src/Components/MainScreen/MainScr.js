import MainScreenT from "./MainScreenTeacher";
import MainScreenS from "./MainScreenStudent";
import Logout from "./Logout";
import axios from "axios";
import { useState } from "react";
var loggedInPosition="";
// Do disallow students to change the local storage data

function MainScr(){
    const [gotData,setData]=useState("");
    function authRender(){
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/authRenderer"
        }).then((resp)=>{
            loggedInPosition=resp.data;
            setData(loggedInPosition);
        }).catch(error=>console.log(error));
    }
    authRender();
    if(gotData==="student"){
        return <MainScreenS></MainScreenS>
    }
    else if(gotData==="teacher"){
        return <MainScreenT></MainScreenT>
    }
    return <div>
        <h1>Oops, something went wrong</h1>
        <Logout></Logout>
    </div>
}
export default MainScr;