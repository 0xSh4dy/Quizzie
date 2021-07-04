import MainScreenT from "./MainScreenTeacher";
import MainScreenS from "./MainScreenStudent";
import Logout from "./Logout";
import axios from "axios";
import { useState,useEffect } from "react";
var loggedInPosition="";
var teacherLog = sessionStorage.getItem("teacherLog");

function MainScr(){
    const [gotData,setData]=useState("");
    
    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/authRenderer"
        }).then((resp)=>{
            loggedInPosition=resp.data;
            console.log(loggedInPosition);
            setData(loggedInPosition);
        }).catch(error=>console.log(error));
    },[])
    
    console.log(gotData);
    if(gotData==="student"){
        return <MainScreenS></MainScreenS>
    }
    else if(gotData==="teacher" ){
        return <MainScreenT></MainScreenT>
    }
    else{
        return <div><h1>Connection error...
        </h1>
            <Logout></Logout>
            </div>
    }
}
export default MainScr;