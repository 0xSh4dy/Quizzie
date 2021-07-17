import { useState,useEffect } from "react";
import axios from "axios";
import QuizSettingPage from './QuizSettingPage';
import {BrowserRouter as Router, Route, Switch,Link} from 'react-router-dom';

var x =1;

function goback(){
    window.location.reload();
}

var modeQuiz = "";
function QuizData(props){
    const [gotData,setData] = useState(false);
    const [courseQuizData,setCourseQuizData] = useState([]);
    const [courseBtnClick,setCourseBtnClick] = useState("");
    const [quizWithQuestionsSet,setQuizWithQuestionsSet] = useState([]);
    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/setQuiz"
        }).then((resp)=>{
            setData(true);
            let questionsAlreadySet = resp.data.questionsSetQuiz;
            let quizAlrSet = resp.data.alreadySetQuiz;
            setCourseQuizData([...resp.data.alreadySetQuiz]);
            setQuizWithQuestionsSet([...resp.data.questionsSetQuiz]);
            for(let i=0;i<questionsAlreadySet.length;i++){
                let datx = questionsAlreadySet[i];
                quizAlrSet = quizAlrSet.filter((item)=>{
                    return item!=datx;
                })
            }
            setCourseQuizData([...quizAlrSet]);
        }).catch(err=>console.log(err));
    },[]);
    
    function CourseQuizData(props){
        return <button key={x++} onClick={()=>{setCourseBtnClick(props);
            console.log(props);
            modeQuiz=props;
            sessionStorage.setItem("courseClick",props);}}>{props}</button>
    }
    if(courseBtnClick.length===0){
        
    
    if(gotData===false){
        return <h3>Loading...</h3>
    }
    else{
        return <div className="quizSetCourses">
        <h3>Quiz scheduled for the following courses. Click on the respective button to set questions</h3>
        <button id="goback" onClick={goback}>Go back</button>
        {courseQuizData.length===0?<h3>No quiz scheduled right now.</h3>:courseQuizData.map(CourseQuizData)}
        
       </div>
    }
}
else{
    return <div className="quizSettingPage"><QuizSettingPage dat={courseBtnClick}></QuizSettingPage></div>
}
}
export default QuizData;