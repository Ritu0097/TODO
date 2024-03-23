function submitTask() {
    const itemName = document.getElementById("item").value;
    const deadline = document.getElementById("date").value;
    const priority = document.getElementById("priority").value;

    if (itemName.trim()===''||deadline ===''||priority==='-Choose Option-') {
        alert('Please fill out all fields.');
        return;
    }
    const task = {
        name: itemName,
        date: deadline,
        priority: priority,
        completed: false
    };
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById("item").value = '';
    document.getElementById("date").value = '';
    document.getElementById("priority").selectedIndex = 0;
    renderTasks();
}

function renderTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    document.querySelector('.today-tasks').innerHTML = '';
    document.querySelector('.future-tasks').innerHTML = '';
    document.querySelector('.completed-tasks').innerHTML = '';

    let todayId = 1;
    let futureId = 1;
    let completedId = 1;

    tasks.forEach((task, index) => {
        const taskId = index + 1;
        const taskHTML = `
            <tr class="${getTaskClass(task)}">
                <td>${taskId}</td>
                <td>${task.name}</td>
                <td>${task.date}</td>
                <td>${task.priority}</td>
                <td><button onclick="deleteTask(${index})">Delete</button></td>
                <td><button onclick="completeTask(${index})">Complete</button></td>
            </tr>
        `;
        if (task.completed) {
            document.querySelector('.completed-tasks').innerHTML += taskHTML;
            document.querySelector('.completed-tasks tr:last-child').setAttribute('data-id', completedId++);
        } else if (isToday(new Date(task.date))) {
            document.querySelector('.today-tasks').innerHTML += taskHTML;
            document.querySelector('.today-tasks tr:last-child').setAttribute('data-id', todayId++);
        }
        else if (isFuture(new Date(task.date)) || new Date(task.date) < new Date()) {
            document.querySelector('.future-tasks').innerHTML += taskHTML;
            document.querySelector('.future-tasks tr:last-child').setAttribute('data-id', futureId++);
        }
    });
}

function getTaskClass(task) {
    if (!task.completed && new Date(task.date) < new Date()) {
        return 'overdue-task';
    }
    return '';
}

function completeTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = true;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1); // Remove the task at the specified index
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function isToday(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
}

function isFuture(date) {
    return date > new Date();
}

renderTasks();
