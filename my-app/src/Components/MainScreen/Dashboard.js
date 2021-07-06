import { useState,useEffect } from "react";
import axios from "axios";
import StudentDashBoard from './StudentDashboard';
let a =1;
function MyCourses(props){
    return <li key={a++}>{props}</li>
}
function EventDashboard(){
    return (
        <h1>Event Dashboard</h1>
    )
}
function Head(){
    return <h1>Upcoming tests..</h1>
}

function RenderQuizData(props){
    return <div className="renderQuizData">
    
    <li>{props.date}</li>
    <li>{props.time}</li>
    <li>{props.course}</li>
    <li></li>
    </div>
}
function Dashboard(){
    const [gotCourseData,setCourseData]=useState(false);
    const [dat,setDat] = useState([]);
    const [position,setPosition] = useState("");
    const [studQuiz,setStudQuiz] = useState([]);
    const [dataNotFound,setDataNotFound] = useState("Loading...");

    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/studentboard"
        }).then((resp)=>{
            setPosition(resp.data);
        })
        .catch(err=>console.log(err));
    },[])
    
    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/courses"
        }).then((results)=>{
            if(results.data!="No"){
            setDat(results.data);
            
            setCourseData(true);
        }
        else if(results.data==="No"){
            axios({
                method:"GET",
                url:"http://127.0.0.1:4000/mainScr/teacher/quizDat"
            }).then((respon)=>{
                let datq = respon.data;
                let len1=  datq.length;
                let datArray = [];
                console.log(respon.data);
                    let datq1 = datq.map(dat=>JSON.parse(dat));
                    const newArr = [...datq1];
                    setStudQuiz(newArr);
                
            }).catch(error=>console.log(error));
        }
        }).catch(err=>console.log(err));

       
    },[]);
    if(gotCourseData===true&&position==="teacher"){
        const dat1 = [...dat];
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
    }
    else if(position==="student"){
        let startTime = new Date();
        startTime = startTime.getTime();
        
        if(studQuiz.length===0){
            setTimeout(()=>{
                let curTime = new Date();
                curTime = curTime.getTime();
                setDataNotFound("No test scheduled right now");
            },5000);
            return <h1>{dataNotFound}</h1>
        }
        
        console.log(studQuiz);
        let myarr = [...studQuiz];
        console.log(myarr[0].date);
        return <div>
        <Head></Head>
        {myarr.map(RenderQuizData)}
        
        </div>
    }
    else{
        return <h1>Loading...</h1>
    }
    
}
export default Dashboard;