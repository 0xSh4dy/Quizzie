import {useState} from 'react';
import MainScreen from './MainScreen';
import axios from 'axios';
const isLoggedIn = localStorage.getItem("isLoggedIn");

function Login(){
    const [clickLogin,setClickLogin] = useState(false);
    const [clickRegister,setClickRegister] = useState(false);
    const [submittedRegister,setSubmittedRegister] = useState(false);
    var submittedSignin = false;
    function handleSubmitRegister(event){
        let posData = String(event.target[3].value);
        posData=posData.toLowerCase();
        event.preventDefault();
        if(posData==="student"||posData==="teacher"){
        let body = {
            name:event.target[0].value,
            password:event.target[1].value,
            email:event.target[2].value,
            position:posData
        }
        axios({
            method: 'post',
            url: 'http://127.0.0.1:4000/register',
            data: body
        }).then(function (response) {
            console.log(response);
            setSubmittedRegister(true);
            
        })
        .catch(function (error) {
            console.log(error);
        });
        localStorage.setItem("isLoggedIn","true");
        localStorage.setItem("loggedInUsername",event.target[0].value);
        window.location.reload();
    }
    else{
        alert("Position can either be student or teacher");
    }
    }
    function handleSubmitSignin(event){
        event.preventDefault();
        let body = {
            name:event.target[0].value,
            password:event.target[1].value,
            email:event.target[2].value
        }
        axios({
            method:'post',
            url:'http://127.0.0.1:4000/signin',
            data:body
        }).then((response)=>{
            let resp = String(response.data);
            if(resp==="Yes"){
                submittedSignin=true;
                localStorage.setItem("isLoggedIn","true");
                localStorage.setItem("loggedInUsername",event.target[0].value);
                window.location.reload();
            }
            else if(resp==="No"){
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
        {isLoggedIn==="true"||submittedRegister===true||submittedSignin===true?<MainScreen></MainScreen>:<Buttons></Buttons>}
        {clickLogin===true&&submittedRegister===false?<Signin></Signin>:null}
        {clickRegister===true&&submittedRegister===false?<Register></Register>:null}
    </div>
}
export default Login;
