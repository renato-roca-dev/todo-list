function clock() {
    var data = new Date();
    var hr = formatTime(data.getHours());
    var min = formatTime(data.getMinutes());
    var totalTime = `${hr}:${min}`
    var time = window.document.getElementById("todo-header-time");
    time.innerHTML = totalTime;
}
function formatTime(time) {
    if (time < 10) {
        return '0' + time;
    }
    return time;
}
setInterval(clock, 500);

var todoForm = document.getElementById("todo-form") 
var btnShowForm = document.getElementById("btn-show-form")
var formInput = document.getElementById("item-input");
function showForm() {
    todoForm.style.display = "flex";
    btnShowForm.style.display = "none";
    formInput.focus();
}

;(function () {
    "use strict"
    const itemInput = document.getElementById("item-input");
    const addItem = document.getElementById("todo-form");
    const ul = document.getElementById("todo-list");
    const lis = ul.getElementsByTagName("li");

let arrTasks = getSavedData()

function getSavedData(){
    let tasksData = localStorage.getItem("tasks");
    tasksData = JSON.parse(tasksData);
    return tasksData && tasksData.length ? tasksData : [
        {
        name: "Exemplo 1",
        createdAt: Date.now(),
        completed: false
        }
    ]
}

function setNewData(){
    localStorage.setItem("tasks", JSON.stringify(arrTasks));
}

setNewData();

function generateLiTask(obj) {
    const p = document.createElement("p");
    const li = document.createElement("li");
    const checkButton = document.createElement("button");
    const editDelBtnDiv = document.createElement("div");
    const editButton = document.createElement("i");
    const delButton = document.createElement("i");

    li.className = "todo-item";

    checkButton.className = "btn-task-check";
    checkButton.innerHTML = `
    <div class="btn-task-checked ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></div>`;
    checkButton.setAttribute("data-action", "checkButton");
    li.appendChild(checkButton)

    p.className = `text-task ${obj.completed ? "text-task-checked" : ""}`;
    p.textContent = obj.name;
    li.appendChild(p);

    editDelBtnDiv.className = "todo-item-edit-delete";
    li.appendChild(editDelBtnDiv);

    editButton.className = `fa-solid fa-pen-to-square fa-icon ${obj.completed ? "fa-icon-checked" : ""}`;
    editButton.setAttribute("data-action", "editButton")
    editDelBtnDiv.appendChild(editButton);

    const editContainer = document.createElement("div");
    editContainer.className="editContainer";
    const editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.className = "editInput";
    editInput.value = obj.name;
    editContainer.appendChild(editInput);
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "buttonContainer";
    editContainer.appendChild(buttonContainer)
    const editButtonContainer = document.createElement("button");
    editButtonContainer.className = "editBtn";
    editButtonContainer.textContent = "Alterar";
    editButtonContainer.setAttribute("data-action", "editButtonContainer")
    buttonContainer.appendChild(editButtonContainer);
    const cancelButtonContainer = document.createElement("button");
    cancelButtonContainer.className = "cancelBtn";
    cancelButtonContainer.textContent = "Cancelar";
    cancelButtonContainer.setAttribute("data-action", "cancelButtonContainer")
    buttonContainer.appendChild(cancelButtonContainer);

    li.appendChild(editContainer);

    delButton.className = `fa-solid fa-trash-can fa-icon ${obj.completed ? "fa-icon-checked" : ""}`;
    delButton.setAttribute("data-action", "delButton")
    editDelBtnDiv.appendChild(delButton);

    return li;
}

function renderTasks() {
    ul.innerHTML = "";
    arrTasks.forEach(taskObj => {
        ul.appendChild(generateLiTask(taskObj));
    });
}

function addTask(task) {
    arrTasks.push({
    name: task,
    createdAt: Date.now(),
    completed: false
    });

    setNewData();
}

function clickedUl(e){
    const dataAction = e.target.getAttribute("data-action");
    console.log(e.target);

    if(!dataAction) return;

    let currentLi = e.target;
    while(currentLi.nodeName !== "LI"){
        currentLi = currentLi.parentElement;
    }
    const currentLiIndex = [...lis].indexOf(currentLi);

    const actions = {
        editButton: function(){
            const editContainer = currentLi.querySelector(".editContainer");

            [...ul.querySelectorAll(".editContainer")].forEach(container => {
                container.removeAttribute("style");
            });

            editContainer.style.display = "block";
        },
        delButton: function(){
            arrTasks.splice(currentLiIndex, 1);
            renderTasks();
            setNewData();
        },
        editButtonContainer: function(){
            const val = currentLi.querySelector(".editInput").value;
            arrTasks[currentLiIndex].name = val;
            renderTasks();
            setNewData();
        },
        cancelButtonContainer: function(){
            currentLi.querySelector(".editContainer").removeAttribute("style");
            currentLi.querySelector(".editInput").value = arrTasks[currentLiIndex].name;
        },
        checkButton: function(){
            arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed;

            renderTasks();
            setNewData();
        }
    }

    if(actions[dataAction]){
        actions[dataAction]()
    }
}

addItem.addEventListener("submit", function (e) {
    e.preventDefault();
    addTask(itemInput.value);
    renderTasks();
    itemInput.value = "";
    itemInput.focus();
    todoForm.style.display = "none";
    btnShowForm.style.display = "block";
});
    ul.addEventListener("click", clickedUl);
    renderTasks();
})()