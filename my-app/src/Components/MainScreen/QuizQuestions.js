import { useState,useEffect } from "react";
import axios from "axios";
import QuizSettingPage from './QuizSettingPage';
import {BrowserRouter as Router, Route, Switch,Link} from 'react-router-dom';

var x =1;

function goback(){
    window.location.reload();
}
function QuizData(props){
    const [gotData,setData] = useState(false);
    const [courseQuizData,setCourseQuizData] = useState([]);
    const [courseBtnClick,setCourseBtnClick] = useState("");
    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/setQuiz"
        }).then((resp)=>{
            setData(true);
            setCourseQuizData([...resp.data]);
            
        
        }).catch(err=>console.log(err));
    },[]);
    function CourseQuizData(props){
        return <button key={x++} onClick={()=>{setCourseBtnClick(props);console.log(props)}}>{props}</button>
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