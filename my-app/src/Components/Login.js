import {useState} from 'react';
import axios from 'axios';
import MainScr from './MainScreen/MainScr';
const isLoggedIn = sessionStorage.getItem("isLoggedIn");
function Login(){
    const [clickLogin,setClickLogin] = useState(false);
    const [clickRegister,setClickRegister] = useState(false);
    const [submittedRegister,setSubmittedRegister] = useState(false);
    var submittedSignin = false;
    function handleSubmitRegister(event){
        let posData = String(event.target[3].value);
        posData=posData.toLowerCase();
        if(posData==="teacher"){
            sessionStorage.setItem("teacherLog","Yes");
        }
        event.preventDefault();
        if(posData==="student"||posData==="teacher"){
            sessionStorage.setItem("logEmail",event.target[2].value)
        let body = {
            name:event.target[0].value,
            password:event.target[1].value,
            email:event.target[2].value,
            position:posData
        }
        axios({
            method: 'POST',
            url: 'http://127.0.0.1:4000/mainScr/register',
            data: body
        }).then((respo)=> {
            console.log(respo);
            console.log("Astha");
            setSubmittedRegister(true);
            sessionStorage.setItem("isLoggedIn","true");
            
        })
        .catch(function (error) {
            console.log(error);
        });
        sessionStorage.setItem("loggedInUsername",event.target[0].value);
        sessionStorage.setItem("position",posData);
        
    }
    else{
        alert("Position can either be student or teacher");
    }
    }
    function handleSubmitSignin(event){
        event.preventDefault();
        sessionStorage.setItem("logEmail",event.target[2].value);
        let body = {
            name:event.target[0].value,
            password:event.target[1].value,
            email:event.target[2].value
        }
        axios({
            method:'post',
            url:'http://127.0.0.1:4000/mainScr/signin',
            data:body
        }).then((response)=>{
            let resp = response.data;
            console.log(resp);
            if(resp.authPosition==="Invalid email"){
                alert("Invalid email provided");
            }
            else if(resp.auth==="Yes"){
                submittedSignin=true;
                sessionStorage.setItem("isLoggedIn","true");
                sessionStorage.setItem("loggedInUsername",event.target[0].value);
                window.location.reload();
            }
            else if(resp.auth==="No"){
                alert("Invalid credentials provided");
            }
        }).catch((error)=>{
            console.log(error);
        })

    }
    function Register(){
       
        return <form onSubmit={handleSubmitRegister}>
            <input className="loginp" type="text" name="name" placeholder="Enter your name" autoComplete="off" required></input>
            <input className="loginp" type="password" name="password" placeholder="Enter a password" required></input>
            <input className="loginp" type="email" name="email" placeholder="Enter your email" autoComplete="off" required></input>
            <input className="loginp" type="text" name="position" placeholder="Teacher or Student?" autoComplete="off" required></input>
            <input id="submit" type="submit" value="Register"></input>
        </form>
    }
    function Signin(){
        return <form onSubmit={handleSubmitSignin} >
            <input className="loginp" type="text" name="name" placeholder="Enter your name" autoComplete="off" required></input>
            <input className="loginp" type="password" name="password" placeholder="Enter a password" required></input>
            <input className="loginp" type="email" name="email" placeholder="Enter your email" autoComplete="off" required></input>
            <input id="submit" type="submit" value="Signin"></input>
    
        </form>
    }
    
    function handleClickLogin(){
        setClickRegister(false);
        if(clickLogin===true ){
            setClickLogin(false);
           
        }
        else{
            setClickLogin(true);
        }
    }
    function handleClickRegister(){
        setClickLogin(false);
        if(clickRegister===false){
            setClickRegister(true);
        }
        else{
            setClickRegister(false);
        }
    }
    function Buttons(){
        return <div className="buttons">
            <div className="buttonsTop">
            <button  onClick={handleClickLogin}>Signin</button>
            <button onClick={handleClickRegister}>Register</button>
            <h1>Quizzie: The new experience while giving tests</h1>
            <h2>Smooth experience, no problems while reloading!</h2>
            </div>
           
        </div>
    }
    return <div>
       
        {isLoggedIn==="true"||submittedRegister===true||submittedSignin===true?<MainScr></MainScr>:<Buttons></Buttons>}
        {clickLogin===true&&submittedRegister===false?<Signin></Signin>:null}
        {clickRegister===true&&submittedRegister===false?<Register></Register>:null}
    </div>
}
export default Login;
