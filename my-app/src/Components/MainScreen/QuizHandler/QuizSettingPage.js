import { useState } from "react";
import Objective from './Objective';
import Subjective from './Subjective';
import Dynamic from './Dynamic';
function QuizSettingPage(){
    const [mode,setMode] = useState("");
    function ControllerButtons(){
        return <div className="setModeBtns">
        <button onClick={()=>{setMode("objective")}}>Objective</button>
        <button onClick={()=>{setMode("subjective")}}>Subjective</button>
        <button onClick={()=>{setMode("dynamic")}}>Dynamic</button>
    </div>
    }
    if(mode==="objective"){
        return <Objective></Objective>
    }
    else if(mode==="subjective"){
        return <Subjective></Subjective>
    }
    else if(mode==="dynamic"){
        return <Dynamic></Dynamic>
    }
    else{
        return <ControllerButtons/>
    }
}
export default QuizSettingPage;