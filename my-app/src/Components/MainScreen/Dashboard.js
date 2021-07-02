import { useState,useEffect } from "react";
import axios from "axios";
let a =1;
function MyCourses(props){
    return <li key={a++}>{props}</li>
}
function EventDashboard(){
    return (
        <h1>Event Dashboard</h1>
    )
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
        return <div className="dashClass">
            <h1 >My Courses</h1>
                <div className="dash">
                <div className="dash1">
                {dat1.map(MyCourses)}
                </div>
                <div className="dash2">
                <EventDashboard></EventDashboard>
                </div>
                </div>
        </div>
    }else{
        return <h1>Loading...</h1>
    }
    
}
export default Dashboard;