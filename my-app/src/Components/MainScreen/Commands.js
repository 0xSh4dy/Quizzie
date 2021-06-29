function Commands(){
    return <div className="commands">
        <h1>This is the commands page</h1>
        <div className="commandsList">
            <h2>List of available commands are:</h2>
            <li><strong>render nameOfPage </strong>&nbsp; To render a page. For example: <strong>&nbsp; render dashboard</strong></li>
            <li><strong>help </strong>&nbsp; View the help menu. For example:  <strong>&nbsp; help</strong></li>
            <li><strong>show commands </strong>&nbsp; To view all the commands in the terminal</li>
            <li><strong>show courses </strong>&nbsp; To view courses you've made/participated</li>
            <li><strong>create-course courseName</strong>&nbsp; Create a new course(for teachers only). For example: &nbsp;<strong> create-course English</strong></li>
            <li><strong>delete-course courseName</strong>&nbsp; Delete an available course(for teaches only) For example: &nbsp;<strong> delete-course Chemistry</strong></li>
            <li><strong>join-course courseName -emostp teacherEmail</strong>&nbsp; Join a course with provided course-name and email of the teacher (for students only). For example: &nbsp;<strong>join-course English -emotp demo@kmail.com</strong></li>
        </div>

    </div>
}
export default Commands;