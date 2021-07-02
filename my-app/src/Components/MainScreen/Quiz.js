import { useEffect,useState } from "react";
import { useHistory } from "react-router";
import axios from 'axios';
let b=1;


function Quiz(){
    function SendConfigData(event){
        alert(event.target);
        const history = useHistory();
        console.log(event.target[0].value);
        history.push("/terminal");
    }

    
    const [buttonData,setButtonData] = useState([]);
    const [requestNow,requestComplete] = useState(false);
    const [configureQuiz,setConfigureQuiz] = useState(false);
    function displayBtns(){
        setConfigureQuiz(true);
    }
    function ButtonCourses(prop){
        return <li key={b++}><button  style={{color:"red"}} onClick={displayBtns}>{prop}</button>  </li>
        }

    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/courses"
        }).then((results)=>{
            setButtonData(results.data);
            requestComplete(true);
        }).catch(err=>console.log(err));
    },[]);
    if(requestNow===true){
        const dat2 = [...buttonData];
        console.log("huh");
        console.log(configureQuiz);
        if(configureQuiz===false){
        return (
            <div className="quizDash">
                <h2>Select course</h2>
                {dat2.map(ButtonCourses)}
            </div>
        )
    }
         else{
        return <div className="quizConfig">
        <h3>Configuration</h3>
        <form onSubmit={SendConfigData}>
            <div>
            <label>Date and time:</label> <input type="datetime-local" required></input>
            </div>
            <div>
            <label>Duration(minutes):</label> <input id="inputNumConf" type="number" min="0" max="300" placeholder="Enter duration(in minutes)" required></input>
</div>
     <input id="submitQuizConf" type="submit" value="Done!"></input>
        </form>
    </div>
    }
    }
    else{
        return <h1>Loading...</h1>
    }
  
}
export default Quiz;