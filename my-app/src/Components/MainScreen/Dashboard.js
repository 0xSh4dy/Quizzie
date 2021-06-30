import { useState,useEffect } from "react";
import axios from "axios";
let a =1;
function MyCourses(props){
    return <li className="liLeft" key={a++}>{props}</li>
}
function Dashboard(){
    const [gotCourseData,setCourseData]=useState(false);
    const [dat,setDat] = useState([]);
    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/courses"
        }).then((results)=>{
            setDat(results.data);
            
            setCourseData(true);
        }).catch(err=>console.log(err));
    },[]);
    if(gotCourseData===true){
        const dat1 = [...dat];
        console.log(dat1);
        return <div>
            <h1>My Courses
                {console.log(dat1)}
                {dat1.map(MyCourses)}
            </h1>
            
        </div>
    }else{
        return <h1>Loading...</h1>
    }
    
}
export default Dashboard;