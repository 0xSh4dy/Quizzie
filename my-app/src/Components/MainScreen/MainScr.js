import MainScreenT from "./MainScreenTeacher";
import MainScreenS from "./MainScreenStudent";
import Logout from "./Logout";
import axios from "axios";
import { useState } from "react";
var loggedInPosition="";
var teacherLog = sessionStorage.getItem("teacherLog");

function MainScr(){
    const [gotData,setData]=useState("");
    function authRender(){
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/authRenderer"
        }).then((resp)=>{
            loggedInPosition=resp.data;
            console.log(loggedInPosition);
            setData(loggedInPosition);
        }).catch(error=>console.log(error));
    }
    authRender();
    console.log(gotData);
    if(gotData==="student"){
        return <MainScreenS></MainScreenS>
    }
    else if(gotData==="teacher" || teacherLog==="Yes"){
        return <MainScreenT></MainScreenT>
    }
    return <div>
        <h1>Oops, something went wrong</h1>
        <Logout></Logout>
    </div>
}
export default MainScr;