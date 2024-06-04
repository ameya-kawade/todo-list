function main(){
    getUserData();
    const btn = document.querySelector('#btn');
    const input = document.querySelector('#todo-name');
    btn.addEventListener('click', async(e)=>{
        
        const todoName = input.value.trim();
        if(todoName.length === 0) return

        try {
            localStorage.setItem('isChanged','true');
            const post = await fetch('/user/createTodo',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({todoName})
            });
            
            if(!post.ok) throw new Error(post.statusText);

            localStorage.setItem(todoName, JSON.stringify([]));
           
            const todosDiv = document.querySelector('#todos-container');
            todosDiv.append(createCard(todoName));

        } catch (error) {
            alert(error.message);
        }
    });
}

async function getUserData(){
    try {
        const request = await fetch('/user/getData');
        if(!request.ok){
            console.log(request.statusText);
        }
        else{
            const user = await request.json();
            render(user);
        }
    } catch (error) {
       console.log(error);
       alert('something went wrong'); 
    }  
}

function render(user){
    const userName = document.querySelector('#userName');
    const todosDiv = document.querySelector('#todos-container');

    userName.textContent = `Welcome ${user.name}`;
    const todos = user.todos;
    
    if(todos.length === 0) return;

    const docFrag = new DocumentFragment();
    for(let todo of todos){
        docFrag.appendChild(createCard(todo.name));
    }
    todosDiv.append(docFrag);

    localStorage.setItem('isChanged','false');

    saveTolocalStorage(todos)
}

function saveTolocalStorage(todos){
    for(let todo of todos){
        const tasks = todo.tasks;
        const newTasks = tasks.map((t)=>{

            const datetime = new Date(t.dueTime);
            let year = datetime.getFullYear().toString();
            let month = (datetime.getMonth() + 1).toString().padStart(2,"0");
            let date = datetime.getDate().toString().padStart(2,"0");
            let h = datetime.getHours();
            let hour = ((h) % 12 || 12).toString().padStart(2,"0");
            let amPm = (h < 12)?"am":"pm";
            let minutes = (datetime.getMinutes()).toString().padStart(2,"0");

            const obj = {
                task: t.title,
                status: t.status,
                timing: datetime,
                year,
                month,
                date,
                h,
                hour,
                amPm,
                minutes
            };

            return obj;
        }); 
        localStorage.setItem(todo.name, JSON.stringify(newTasks));
        
    }

}


function createCard(todoName){

    let card = document.createElement('div');
    card.classList.add('card');

    let p = document.createElement('p');
    p.textContent = todoName;
    card.append(p);

    let anchortag = document.createElement('a');
    anchortag.href = `/home/todo?todoName=${todoName}`;
    anchortag.target = '_blank';
    
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click',(e)=>{
        
    });
    anchortag.append(card);
    card.append(deleteBtn);

    return anchortag;
}


// before unload event
window.onbeforeunload = async function(){
    if(localStorage.getItem('isChanged') === 'false'){ 
        console.log('no changes');
        return;
    }
    let res = {};

    const todos = Object.keys(localStorage);
    console.log(todos);
    for(let key of todos){
        const tasks = JSON.parse(localStorage.getItem(key));
        // console.log(typeof tasks);

        // to prevent the isChanged boolean value
        if(!Array.isArray(tasks)) continue;
        
        const newTasks = tasks.map((t)=>{
            const obj = {
                title:t.task,
                status:t.status,
                dueTime:t.timing
            };
            return obj;
        });
        res[key] = newTasks;
    }

    console.log(res)

    const post = await fetch('/user/saveData',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(res)
    });

    console.log(post.status);
};


main()
