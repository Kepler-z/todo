// Ищем элемент на странице, чтобы компилятор сперва нашел все элементы, а потом уже работал
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList'); //Список задач, 
const emptyList = document.querySelector('#emptyList');
const taskTitle = document.querySelector('.task-title'); 


let tasks = [];

if(localStorage.getItem('tasks'))
{
     const dataFromLC = localStorage.getItem('tasks');
     tasks = JSON.parse(dataFromLC);
     
     tasks.forEach(arrayElement => {
          insertTemplate (arrayElement); //вставляем разметку для каждого элемента массива (arrayElement)
     });
}

checkEmptyList();

form.addEventListener('submit', addTask); 
tasksList.addEventListener ('click', deleteTask); 
tasksList.addEventListener('click', taskDone); 


// функции
function addTask (event) {
     event.preventDefault(); //предотвращающает перезагрузку страницы.  

     const taskText = taskInput.value; //достаем текст из taskInput и помещаем в константу taskText
     
     const newTask = {
          id: Date.now(),
          text: taskText,
          done: false,
     };
     tasks.push(newTask); 
     
     insertTemplate (newTask); //вставляем разметку (в index.html) для оббъекта newTask
 
     taskInput.value = ""; //после добавления - placeholder очищается,
     taskInput.focus();  //фокус остаётся в окне, а не на кнопке "добавить"

     checkEmptyList();
     SaveToLocalStorage(); // сохраняем в LocalStorage изменения в массиве (добавление нового элемента)
}

function deleteTask(event)
{
     const button_del = event.target; 

     if (button_del.dataset.action === "delete")
     {
      const parentElement = event.target.closest('li') //ищет самый близкий элемент (по принципу от того элемента, в который он вложен), подходящий по селектору
      const id = parentElement.id;
      
      const index = tasks.findIndex(function(arrayElement) {
          if (arrayElement.id == id)
          {
               return true;
          }
      })
      tasks.splice(index, 1);      

      parentElement.remove();
     }
     checkEmptyList();
     SaveToLocalStorage(); // сохраняем в LocalStorage изменения в массиве (удаление элемента)
}

function taskDone(event)
{
     const button_done = event.target;

     if (button_done.dataset.action === 'done') // Проверяем там ли мы кликнули
     {
          const parentElement = button_done.closest('li');
          const id = parentElement.id;
          
          const index = tasks.findIndex(function(arrayElement) {
               if (arrayElement.id == id)
               return true;
          })
          const task = tasks[index];
          task.done = !task.done;

          const taskTitle = parentElement.querySelector('span');
          taskTitle.classList.toggle('task-title--done');


     }
     SaveToLocalStorage(); // сохраняем в LocalStorage изменения в массиве (где у объекта изменили свойство done) 
}

function  checkEmptyList()
{
     if (tasks.length === 0)
     {   
          const emptyListHTML= `<li id="emptyList" class="list-group-item empty-list">
                    <img src="./img/tumblewed.svg" alt="Empty" width="64" class="mt-3">
                    <div class="empty-list__title">Список дел пуст</div>
               </li>`;
               tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
     }
    if (tasks.length >0)
    {
     const emptyListEl = document.querySelector('#emptyList');
     emptyListEl ? emptyListEl.remove(): null; 
    }
     
}

function SaveToLocalStorage()
{
     localStorage.setItem('tasks', JSON.stringify(tasks));
}


function insertTemplate (task)
{
     const cssClass = task.done? 'task-title task-title--done' : 'task-title';


     //Создаем шаблон html разметки для добавления задач (новых или тех, которые взяли из LocalStorage):
     const taskAdditionHTML = `				
     <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item"> 
         <span class="${cssClass}">${task.text}</span>
          <div class="task-item__buttons">
           <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
           </button>
           <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
           </button>
          </div>
     </li>`;
 
     //Добавляем задачу в отображение на страницу
     tasksList.insertAdjacentHTML("beforeend", taskAdditionHTML);
}