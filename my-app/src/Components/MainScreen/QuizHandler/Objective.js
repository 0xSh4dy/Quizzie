import React from "react";
import ReactDOM from 'react-dom';
import MainScreenTeacher from '../MainScreenTeacher';
import { useState } from "react";
import axios from "axios";
import modeQuiz from './QuizQuestions';
let quizQuestionData = [];

function Objective(){
    const [qsNum,setQsNum] = useState(1);
    const [quest,setQuest] = useState("");
    const [opt1,setOpt1] = useState("");
    const [opt2,setOpt2] = useState("");
    const [opt3,setOpt3] = useState("");
    const [opt4,setOpt4] = useState("");
    const [ans,setAns] = useState("");
    const [result,setResult] = useState([]);
    const [submitted,setSubmitted]= useState(false);
    function handleClick(event){
        setQuest(event.target.value);
    }
    function StoreData(){
    const value = sessionStorage.getItem("courseClick");
        
        const myData = {course:value,question:quest,option1:opt1,option2:opt2,option3:opt3,option4:opt4,answer:ans};
        setResult(result=>[...result,myData]);
        setQuest("");
        setOpt1("");
        setOpt2("");
        setOpt3("");
        setOpt4("");
        setAns("");
        setQsNum(qsNum+1);
        quizQuestionData.push(myData);
    }
    
    function SubmitQuestions(){
        axios({
            method:"POST",
            url:"http://127.0.0.1:4000/mainScr/teacher/setQuiz/setQuestions",
            data:quizQuestionData
          }).then((resp)=>{
            setSubmitted(true);
            sessionStorage.removeItem("courseClick");
            alert("Questions set!");
            window.location.reload();
          })
          .catch(err=>console.log(err));
          
        }
    return <div><h1 className="headCenter">Objective</h1>
    <div className="quizQuesInput">
    <div className="quizQuesAside">
        <div>
        <p>Qs {qsNum}: &nbsp;{quest}</p>
        <p>Opt1:&nbsp; {opt1}</p>
        <p>Opt2: &nbsp; {opt2}</p>
        <p>Opt3: &nbsp; {opt3}</p>
        <p>Opt4: &nbsp; {opt4}</p>
        </div>
    </div>
    
    <input type="text" placeholder="Enter a question" value={quest} onChange={handleClick}></input>
    <input type="text" placeholder="Enter option 1" value={opt1} onChange={(e)=>{setOpt1(e.target.value)}}></input>
    <input type="text" placeholder="Enter option 2" value={opt2} onChange={(e)=>{setOpt2(e.target.value)}}></input>
    <input type="text" placeholder="Enter option 3" value={opt3} onChange={(e)=>{setOpt3(e.target.value)}}></input>
    <input type="text" placeholder="Enter option 4" value={opt4} onChange={(e)=>{setOpt4(e.target.value)}}></input>
    <input type="text" placeholder="Enter correct answer" value={ans} onChange={(e)=>{setAns(e.target.value)}}></input>
    <button className="plusButton" onClick={StoreData}>+</button>
    </div>
    <div className="objectiveBtns">
    <button id="submitQs" onClick={SubmitQuestions}>Submit</button>
    <button id="moveback" onClick={()=>{window.location.reload()}}>GoBack</button>
    </div>
    </div>
}
export default Objective;