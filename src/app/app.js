import { User } from './models/user.js';
import { Todo } from './models/todo.js';

export class App {
    run() {
        //Sélecteurs
        //todo
        const todoInput = document.querySelector(".todo-input");
        const todoButton = document.querySelector(".todo-button");
        const todoList = document.querySelector(".todo-list");
        //filter todo
        const filterOption = document.querySelector(".filter-todo");
        //user
        const userInput = document.querySelector(".user-input");
        const addUserButton = document.querySelector(".user-button");
        const usersList = document.querySelector(".users-list");
        //category
        const categoryInput = document.querySelector(".category-input");
        const addCategoryButton = document.querySelector(".category-button");
        const categoriesList = document.querySelector(".categories-list");

        //Écouteurs
        document.addEventListener("DOMContentLoaded", getData);    //"DOMContentLoaded" -> au chargement de la page
        todoButton.addEventListener("click", addTodo);
        todoList.addEventListener("click", deleteCheck);
        usersList.addEventListener("click", deleteCheck);
        filterOption.addEventListener("input", filterTodo);
        addUserButton.addEventListener("click", addNewUser);
        addCategoryButton.addEventListener("click", addNewCategory);


        // ----------- Tâches ---------------------------

        function addTodo(event) {

            //neutralise le rechargement de page.
            event.preventDefault();

            if (todoInput.value) {

                //Créer l'objet todo
                const newTodo = new Todo(todoInput.value, false);
                console.log("Nouvelle tâche: " + newTodo.title);

                //générer la <div>
                const todoDiv = document.createElement("div");
                todoDiv.classList.add("todo");

                //générer le <li>
                const liTodo = document.createElement("li");
                liTodo.innerText = newTodo.title;
                liTodo.classList.add("todo-item");
                todoDiv.appendChild(liTodo);

                //Ajouter la todo dans le stockage local
                saveLocalTodos(todoInput.value);

                //bouton valider
                const completedButton = document.createElement("button");
                completedButton.innerHTML = '<i class="fas fa-check"></i>';
                completedButton.classList.add("complete-btn");
                todoDiv.appendChild(completedButton);

                //bouton supprimer
                const trashButton = document.createElement("button");
                trashButton.innerHTML = '<i class="fas fa-trash"></i>';
                trashButton.classList.add("trash-btn");
                todoDiv.appendChild(trashButton);

                //Ajouter à la liste de tâches
                todoList.appendChild(todoDiv);
                todoInput.value = "";

            }

        }


        function deleteCheck(e) {

            const item = e.target;

            //Si bouton supprimer tâche
            if (item.classList[0] === "trash-btn") {
                const todo = item.parentElement;

                //animation en CSS sur la classe .fall. On attend la fin de l'animation pour supprimer la tâche. 
                todo.classList.add("fall");
                removeLocalTodos(todo);
                todo.addEventListener("transitionend", function () {
                    todo.remove();
                });
            }

            //Si bouton valider tâche
            if (item.classList[0] === "complete-btn") {
                item.parentElement.classList.toggle("completed");   //toggle = basculer la classe
            }

            //Si bouton supprimer utilisateur
            if (item.classList[0] === "user-trash-btn") {
                const user = item.parentElement;

                user.classList.add("fall");
                removeLocalUsers(user);
                user.addEventListener("transitionend", function () {
                    user.remove();
                });
            }

        }


        function filterTodo(e) {
            const todos = todoList.childNodes;

            console.log(todos);
            console.log(e.target.value);

            todos.forEach(function (todo) {

                switch (e.target.value) {
                    case "all":
                        todo.style.display = "flex";
                        break;
                    case "completed":
                        if (todo.classList.contains("completed")) {
                            todo.style.display = "flex";
                        } else {
                            todo.style.display = "none";
                        }
                        break;
                    case "uncompleted":
                        if (!todo.classList.contains("completed")) {
                            todo.style.display = "flex";
                        } else {
                            todo.style.display = "none";
                        }
                        break;
                }
            })

        }


        function saveLocalTodos(todo) {
            //Contrôle des items existants
            let todos;
            if (localStorage.getItem("todos") === null) {
                todos = [];
            } else {
                todos = JSON.parse(localStorage.getItem("todos"));
            }
            todos.push(todo);
            localStorage.setItem("todos", JSON.stringify(todos));
        }


        function getData() {
            let todos;
            if (localStorage.getItem("todos") === null) {
                todos = [];
            } else {
                todos = JSON.parse(localStorage.getItem("todos"));
            }
            todos.forEach(function (todo) {
                //Todo DIV
                const todoDiv = document.createElement("div");
                todoDiv.classList.add("todo");
                //Créer le Li
                const newTodo = document.createElement("li");
                newTodo.innerText = todo;
                newTodo.classList.add("todo-item");
                todoDiv.appendChild(newTodo);
                //Bouton Check
                const completedButton = document.createElement("button");
                completedButton.innerHTML = '<i class="fas fa-check"></i>';
                completedButton.classList.add("complete-btn");
                todoDiv.appendChild(completedButton);
                //Bouton Supprimer
                const trashButton = document.createElement("button");
                trashButton.innerHTML = '<i class="fas fa-trash"></i>';
                trashButton.classList.add("trash-btn");
                todoDiv.appendChild(trashButton);
                //Ajouter la tâche à la liste
                todoList.appendChild(todoDiv);
            });

            let users;
            if (localStorage.getItem("users") === null) {
                users = [];
            } else {
                users = JSON.parse(localStorage.getItem("users"));
            }
            users.forEach(function (user) {
                //Div
                const userDiv = document.createElement("div");
                userDiv.classList.add("user");
                //Li
                const newUser = document.createElement("li");
                newUser.innerText = user;
                newUser.classList.add("user-item");
                userDiv.appendChild(newUser);
                //Bouton Supprimer
                const userTrashButton = document.createElement("button");
                userTrashButton.innerHTML = '<i class="fas fa-trash"></i>';
                userTrashButton.classList.add("user-trash-btn");
                userDiv.appendChild(userTrashButton);
                //Ajouter utilisateur à la liste
                usersList.appendChild(userDiv);
            });
        }


        function removeLocalTodos(todo) {
            let todos;
            if (localStorage.getItem("todos") === null) {
                todos = [];
            } else {
                todos = JSON.parse(localStorage.getItem("todos"));
            }
            const todoIndex = todo.children[0].innerText;
            todos.splice(todos.indexOf(todoIndex), 1);  //splice pour modifier le tableau
            localStorage.setItem("todos", JSON.stringify(todos));
        }


        // ----------- Utilisateurs ---------------------------

        function addNewUser(event) {
            //neutralise le rechargement de page.
            event.preventDefault();

            if (userInput.value) {

                //Créer l'objet User
                const newUser = new User(userInput.value, []);
                console.log("Nouvel utilisateur : " + newUser.name);

                //générer <div class="user">
                const userDiv = document.createElement("div");
                userDiv.classList.add("user");

                //générer <li class"user-item">
                const liUser = document.createElement("li");
                liUser.innerText = userInput.value;
                liUser.classList.add("user-item");
                userDiv.appendChild(liUser);    //li enfant de div

                //Enregistrer l'utilisateur dans le stockage local
                saveLocalUsers(newUser.name);

                //Bouton supprimer
                const trashButton = document.createElement("button");
                trashButton.innerHTML = '<i class="fas fa-trash"></i>';
                trashButton.classList.add("user-trash-btn");
                userDiv.appendChild(trashButton);

                //Ajouter à la liste d'utilisateurs
                usersList.appendChild(userDiv);

                //Réinitialiser le champs
                userInput.value = "";

            }

        }

        function saveLocalUsers(user) {

            //Contrôle des items existants
            let users;
            if (localStorage.getItem("users") === null) {
                users = [];
            } else {
                users = JSON.parse(localStorage.getItem("users"));
            }
            users.push(user);
            localStorage.setItem("users", JSON.stringify(users));
        }


        function removeLocalUsers(user) {

            let users;
            if (localStorage.getItem("users") === null) {
                users = [];
            } else {
                users = JSON.parse(localStorage.getItem("users"));
            }
            const userIndex = user.children[0].innerText;
            users.splice(users.indexOf(userIndex), 1);  //splice pour modifier le tableau
            localStorage.setItem("users", JSON.stringify(users));
        }


        // ----------- CATEGORIES ---------------------------

        function addNewCategory(event) {

            //neutralise le rechargement de page.
            event.preventDefault();

        }
    }
}