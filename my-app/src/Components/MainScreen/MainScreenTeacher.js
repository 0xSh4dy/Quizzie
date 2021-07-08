import Navbar from "./Navbar";
import Quiz from "./Quiz";
import { useState } from "react";
import QuizData from "./QuizQuestions";
function MainScreenT(){
    const [startQuiz,setStartQuiz] = useState(false);
    const [quizQuest,setQuizQuest] = useState(false);
    function modifyStartQuiz(){
        setStartQuiz(true);
    }
    function SetQuizQuest(){
        setQuizQuest(true);
    }
    function MainScreenTItems(){
        return <div className="MainScreenItems">
            <button onClick={modifyStartQuiz}>Start a quiz</button>
            <button>Current Courses</button>
            <button onClick={SetQuizQuest}>Set Questions</button>
        </div>
    }
   
    // return <div>
    //     <Navbar></Navbar>
    //     {startQuiz===false?<MainScreenTItems/>:<Quiz></Quiz>}
    //     {quizQuest===true?</QuizData>}
    // </div>
    
    if(quizQuest===true){
        return <div className="quizQuestions">
        <Navbar></Navbar>
        <QuizData></QuizData>
        </div>
    }
    else if(startQuiz===false){
        return <div> <Navbar></Navbar><MainScreenTItems></MainScreenTItems></div>
    }
    else if(startQuiz===true){
        return <div>
        <Navbar></Navbar>
        
        <Quiz></Quiz>
        </div>
    }
    
}
export default MainScreenT;