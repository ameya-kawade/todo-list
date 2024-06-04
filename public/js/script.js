const taskInput = document.querySelector("#task");
const dateTimeInput = document.querySelector("#datetime");
const taskBtn = document.querySelector("#add-task-btn");
const taskList = document.querySelector("#tasks-list");
const bellBtn = document.querySelector("#bell-btn");
let currDateTime = new Date();
let taskCount = 0;
const todoName = location.href.split('?')[1].split('=')[1];
let tasks = localStorage.getItem(todoName);
let notificationPermission = false;


function createNotification(task){
    let time = new Date(task['timing']) - new Date();
    console.log(time);
    if(task['status'] === false){
        if(time < Number.MAX_SAFE_INTEGER){
            if(Notification.permission === "granted"){
                console.log("Creating notification");
                setTimeout(()=>{
                    new Notification("Todo List",{
                        body:`${task['task']}\nStatus : ${(time > 0)?'pending':'overdue'}\nDate: ${task['date']}-${task['month']}-${task['year']}\nTime : ${task['hour']} : ${task['minutes']} ${task['amPm']}`,
                        icon:"./images/icon.png"
                    });
                },time);
            }
            else{
                alert("Cannot create notifications since the notification permission is denied, to get notifications please grant notification permission.")
            }
            return true;
        }
        else{
            alert("Cannot create notification, please select a date closer to current date");
        }
    }
    return false;
}

function returnTasksString(i,taskArray){
    return `<div class="tasks-design ${(taskArray[i].status)?'completed':''}" id = ${i}>
                    <div class="task-container">
                        <p>
                            <span class="font-semibold text-lg">Task:</span>
                            <p class="text-justify">
                                ${taskArray[i].task}
                            </p>
                        </p>
                        <p>
                            <span class="font-semibold text-lg">Date:</span><br>
                            ${taskArray[i].date} - ${taskArray[i].month} - ${taskArray[i].year}
                        </p>
                        <p>
                            <span class="font-semibold text-lg">Time:</span> <br>
                            ${taskArray[i].hour} : ${taskArray[i].minutes} ${taskArray[i].amPm}
                        </p>
                    </div>
                    <div class="task-btn-frame">
                        <button id = done-btn${i} class="bg-green-500 task-btn hover:bg-green-400">${(taskArray[i].status)?"Undone":"Done"}</button>
                        <button id = delete-btn${i} class="task-btn bg-red-500 hover:bg-red-400">Delete</button>
                    </div>
                </div>`;
}


const doneBtnFunc = (e)=>{
    let parent = e.target.parentNode.parentNode;
    console.log(parent);
    console.log(e);
    if(e.target.textContent === "Undone"){
        e.target.textContent = "Done"
        tasks[Number(parent.getAttribute("id"))].status = false;
    }
    else{
        e.target.textContent = "Undone";
        let idx = Number(parent.getAttribute("id"));
        tasks[idx].status = true;
    }
    parent.classList.toggle("completed");
    localStorage.setItem(todoName,JSON.stringify(tasks));
};

const deleteBtnFunc = (e)=>{
    console.log("Delete btn clicked");
    let taskId =  Number(e.target.parentNode.parentNode.getAttribute("id"));
    tasks.splice(taskId,1);
    console.log(tasks);
    document.getElementById(`${taskId}`).classList.add("animate-fade-out");
    setTimeout(()=>{
        document.getElementById(`${taskId}`).remove();
        addEventListenersToElements(tasks.length,false);
        renderTasks(tasks);
        addEventListenersToElements(tasks.length - 1, true);
        localStorage.setItem(todoName,JSON.stringify(tasks));
    },1200);
};


function addEventListenersToElements(length, add){
    if (add === true){
        for(let i = 0; i <= length; i++){
            let el = document.querySelector(`#done-btn${i}`);
            if(el){
                el.addEventListener("click",doneBtnFunc);
                document.querySelector(`#delete-btn${i}`).addEventListener("click",deleteBtnFunc);
            }
        }
    }
    else{
        for(let i = 0; i <= length; i++){
            let el = document.querySelector(`#done-btn${i}`);
            if (el){
                el.removeEventListener("click",doneBtnFunc);
                document.querySelector(`#delete-btn${i}`).removeEventListener("click",deleteBtnFunc);
            }
        }
    }
}

function addEventListenerToDoneBtn(element){
    element.addEventListener("click",doneBtnFunc);
    console.log("Added");
}
function addEventListenerToDeleteBtn(element){
    element.addEventListener("click",deleteBtnFunc);
    console.log("Added");
}

function returnFragment(content){
    let range = document.createRange();
    let fragment = range.createContextualFragment(content);
    return fragment;
}

function renderTasks(taskArray){
    let docfrag = new DocumentFragment();
    let l = taskArray.length;
    let i;
    for(i = 0; i < l; i++){
        let fragment = returnFragment(returnTasksString(i,taskArray));
        docfrag.append(fragment);
    }
    taskCount = i - 1;
    taskList.textContent = "";
    taskList.appendChild(docfrag);
}

function renderTask(i,taskArray){
    let docfrag = new DocumentFragment();
    docfrag.append(returnFragment(returnTasksString(i,taskArray)));
    if(docfrag.firstChild){
        let el = docfrag.firstChild;
        el.classList.add("animate-fade-in");
        setTimeout(()=>{
            el.classList.remove("animate-fade-in");
        },1100);
    }
    else{
        console.log("No first child");
    }
    taskList.append(docfrag);
}

taskBtn.addEventListener("click",()=>{
    let task = taskInput.value;
    taskInput.value = "";
    let datetime = dateTimeInput.value;
    if(task && datetime){
        datetime = new Date(datetime);
        let year = datetime.getFullYear().toString();
        let month = (datetime.getMonth() + 1).toString().padStart(2,"0");
        let date = datetime.getDate().toString().padStart(2,"0");
        let h = datetime.getHours();
        let hour = ((h) % 12 || 12).toString().padStart(2,"0");
        let amPm = (h < 12)?"am":"pm";
        let minutes = (datetime.getMinutes()).toString().padStart(2,"0");
        let taskObj = {
            "task" : task,
            "year" : year,
            "date" : date,
            "month" : month,
            "hour" : hour,
            "amPm" : amPm,
            "minutes" : minutes,
            "status": false,
            "timing":datetime
        };
        if(createNotification(taskObj)){

            tasks.push(taskObj);
            taskCount = tasks.length - 1;
            renderTask(taskCount,tasks);
            addEventListenerToDoneBtn(document.querySelector(`#done-btn${taskCount}`));
            addEventListenerToDeleteBtn(document.querySelector(`#delete-btn${taskCount}`));
            localStorage.setItem(todoName,JSON.stringify(tasks));
            console.log(datetime - new Date());
            
        }
    }
});

bellBtn.addEventListener("click",(e)=>{

    if(Notification.permission !== "granted" && Notification.permission !== "denied"){
        Notification.requestPermission().then((permission)=>{
        });
    }
    else if(Notification.permission === "granted"){
        alert("Notifications are enabled already.")
    }
    else{
        alert("Cannot send notifications since you have denied the permission to send notifications.");
    }
});


function initialization(){
    if (tasks){
        tasks = JSON.parse(tasks);
        renderTasks(tasks);
        addEventListenersToElements(tasks.length - 1,true);
        for(let task of tasks){
            createNotification(task);
        }
    }
    else{
    tasks = [];
    }

    const utcDate = new Date();
    utcDate.setUTCHours(utcDate.getUTCHours() + 5.5, utcDate.getUTCMinutes()+30, 0, 0); // Ensure 0 seconds and milliseconds for consistency
    dateTimeInput.min = utcDate.toISOString().slice(0, 16);
    dateTimeInput.value = utcDate.toISOString().slice(0, 16);
}

initialization();