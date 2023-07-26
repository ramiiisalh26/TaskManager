const router = require("../routes/tasks");

const taskInput = document.querySelector('.task-input input'),
      taskBox   = document.querySelector('.task-box'),
      filters   = document.querySelectorAll('.filters span'),
      clearBtn  = document.querySelector('.clear-btn');

let editId;
let isEditedTask = false;
let updataId;
let todos =[{}];
let addNew;
console.log(todos);
filters.forEach(btn =>{
    btn.addEventListener("click", () =>{
        document.querySelector('span.active').classList.remove('active');
        btn.classList.add("active");
        showTodo(btn.id);
    })
})

function showTodo(filter){
    let li = "";
    if(todos){
        todos.forEach((todo, id) => {
            //console.log(todo.id);
            let isCompleted = todo.status == "completed" ? "checked" : "";
            //console.log(isCompleted);
            if(filter == todo.status || filter == "All"){
                li += `<li class="task">
                    <label for=${id}>
                        <input onclick="updateStatus(this,'${todo.id}',${id})" type="checkbox" id=${id} ${isCompleted}>
                        <p class="${isCompleted}">${todo.title}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                        <ul class="task-menu">
                            <li onclick="editTask(${id},'${todo.title}')"><i class="fa-solid fa-pen"></i>Edit</li>
                            <li onclick="deleteTask(${id}, '${filter}')"><i class="fa-solid fa-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You dont have any task here</span>`;
}

//showTodo("All");

function showMenu(selectTask){
    //getting tak menu div
    let taskMenu = selectTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e=> {
        //removing show class from the task menu on the document click
        //tagName refer to "<i></i>"
        if(e.target.tagName != "I" || e.target != selectTask){
            taskMenu.classList.remove("show");
        }   
    })
    
}

function editTask(id,todoName){
    taskInput.value = todoName;
    editId = id;
    isEditedTask = true;
}

function deleteTask(deleteId, filter){
    isEditTask = false;
    let id = todos[deleteId].id;
    Data("DELETE",`http://68.66.226.118:3000/api/v1/tasks/${id}`)
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list",JSON.stringify(todos));
    showTodo(filter);
}

clearBtn.addEventListener("click", () => {
    isEditTask = false;
    Data("DELETE",`http://68.66.226.118:3000/api/v1/tasks`)
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list",JSON.stringify(todos));
    showTodo();
});

const Data = (method,apiLink) => {
    return new Promise((resolve, reject)=>{
        let myRequest = new XMLHttpRequest();
        myRequest.onload = function () {
            if(this.readyState === 4 && this.status === 200){
                resolve(JSON.parse(this.responseText));
                //console.log(this.responseText);
            }else{
                reject(Error("err"));
            }
        };
        
        myRequest.open(method, apiLink);
        if(method === "GET"){
            myRequest.send();    
        }
        if(method === "PUT"){
            myRequest.setRequestHeader("content-Type","application/json");
            myRequest.send(JSON.stringify(todos[updataId]));
        }
        if(method === "POST"){
            myRequest.setRequestHeader("content-Type","application/json");
            myRequest.send(JSON.stringify(addNew));
        }
        if(method === "PATCH"){
            myRequest.setRequestHeader("content-Type","application/json");
            myRequest.send(JSON.stringify(addNew));
        }
        if(method === "DELETE") myRequest.send();
    });

};
taskInput.addEventListener("enter", ev => {
    let userTask = taskInput.value.trim();
    if(ev.key == 'Enter' && userTask){

        if(!isEditedTask){ // if isEditedTask isnt true 
            if(!todos){
                todos = [{}];
            }
            addNew = {title: userTask,status: "pending"};
            Data("POST",`http://68.66.226.118:3000/api/v1/tasks`).then((resolve) => {return addNew;})
        }else{
            isEditedTask = false;
            todos[editId].title = userTask;
            addNew = {title: userTask};
            Data("PATCH",`http://68.66.226.118:3000/api/v1/tasks/${todos[editId].id}`).then((result) => {return userTask;})
        }

        taskInput.value = "";
        showTodo(document.querySelector("span.active").id);
        todos.push(addNew);
        localStorage.setItem("todo-list",JSON.stringify(todos));
    }
    showTodo("All");
});

function updateStatus(selectTask,id,idN){
    let taskName = selectTask.parentElement.lastElementChild;
    if(selectTask.checked){
        taskName.classList.add("checked");
        updataId = idN;
        todos[idN].status = "completed";
    }else{
        taskName.classList.remove("checked");
        updataId = idN;
        todos[idN].status = "pending";
    }
    
    Data("PUT",`http://68.66.226.118:3000/api/v1/tasks/${id}`).then(
            (result) => {
                return todos;
            },
            
    )
    localStorage.setItem("todo-list",JSON.stringify(todos));
}

Data("GET",`getAllTasks`,true).then(
    (result) => {
        todos = result;
        showTodo("All");
        return todos;
    }
).catch((rej)=> console.log(rej));
