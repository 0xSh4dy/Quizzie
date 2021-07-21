import {useState,useEffect} from 'react';
import axios from 'axios';
function LoadQuestions(){

}
export default function RealQuiz(){
    const [data,setData] = useState([]);
    const course= sessionStorage.getItem("courseName");

        const body = {course:course}
        console.log(course);
        axios({
          method:"POST",
          url:"http://127.0.0.1:4000/mainScr/teacher/setQuiz/getQuestions",
          data:body
        }).then((resp)=>{console.log(resp.data);sessionStorage.removeItem("courseName")}).catch(err=>console.log(err));


    return <div>
        <h1 style={{color:"white"}}>Real Quiz</h1>
    </div>
}
