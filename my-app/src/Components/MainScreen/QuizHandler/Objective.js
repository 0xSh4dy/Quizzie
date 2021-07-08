import React from "react";
import ReactDOM from 'react-dom';
import MainScreenTeacher from '../MainScreenTeacher';
import { useState } from "react";
function Objective(){
    const [quest,setQuest] = useState("");
    const [opt1,setOpt1] = useState("");
    const [opt2,setOpt2] = useState("");
    const [opt3,setOpt3] = useState("");
    const [opt4,setOpt4] = useState("");

    function handleClick(event){
        setQuest(event.target.value);
    }
    return <div><h1 className="headCenter">Objective</h1>
    <div className="quizQuesInput">
    <div className="quizQuesAside">
        <div>
        <p>Qs: &nbsp;{quest}</p>
        <p>Opt1:&nbsp; {opt1}</p>
        <p>Opt2: &nbsp; {opt2}</p>
        <p>Opt3: &nbsp; {opt3}</p>
        <p>Opt4: &nbsp; {opt4}</p>
        </div>
    </div>
    <input type="text" placeholder="Enter a question" onChange={handleClick}></input>
    <input type="text" placeholder="Enter option 1" onChange={(e)=>{setOpt1(e.target.value)}}></input>
    <input type="text" placeholder="Enter option 2" onChange={(e)=>{setOpt2(e.target.value)}}></input>
    <input type="text" placeholder="Enter option 3" onChange={(e)=>{setOpt3(e.target.value)}}></input>
    <input type="text" placeholder="Enter option 4" onChange={(e)=>{setOpt4(e.target.value)}}></input>
    <button className="plusButton">+</button>
    </div>
    <button onClick={()=>{ReactDOM.render(<div><MainScreenTeacher/></div>,document.getElementById("root"))}}>GoBack</button>
    </div>
}
export default Objective;