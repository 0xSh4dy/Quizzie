import Navbar from "./Navbar";
import Quiz from "./Quiz";
import { useState } from "react";
function MainScreenT(){
    const [startQuiz,setStartQuiz] = useState(false);
    function modifyStartQuiz(){
        setStartQuiz(true);
    }
    function MainScreenTItems(){
        return <div className="MainScreenItems">
            <button onClick={modifyStartQuiz}>Start a quiz</button>
            <button>Current Courses</button>
        </div>
    }
   
    return <div>
        <Navbar></Navbar>
        {startQuiz===false?<MainScreenTItems/>:<Quiz></Quiz>}
    </div>
}
export default MainScreenT;