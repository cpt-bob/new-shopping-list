const itemBox = document.getElementById("item-box");
const quantityBox = document.getElementById("quantity-box");
const listContainer = document.getElementById("list-container");

let userName;

function login() {
  const email = document.getElementById("email").value;
  if (email === "cpt.bob@gmail.com") {
    userName = "CptBob";
  } else {
    userName = null;
  }
  return userName;
}

function handleLogin(userName) {
  const loginBox = document.getElementById("login-box");
  const login = document.getElementById("login-link");
  const logout = document.getElementById("logout-link");
  const user = document.getElementById("user-name");

  if (userName) {
    console.log(userName);
    user.innerHTML = `${userName}`;
    loginBox.classList.toggle("show");
    logout.classList.toggle("show");
    login.classList.toggle("hide");
    user.classList.toggle("show");
  } else {
    alert("Unkown User");
  }
}

document.querySelector(".js-login-button").addEventListener("click", () => {
  let currentUser = login();
  handleLogin(currentUser);
});

document.querySelector(".js-login-link").addEventListener("click", () => {
  const loginBox = document.getElementById("login-box");
  const email = document.getElementById("email");
  loginBox.classList.toggle("show");
  email.focus();
});

document
  .querySelector(".js-logout-link")
  .addEventListener("click", (userName) => {
    const login = document.getElementById("login-link");
    const logout = document.getElementById("logout-link");
    const user = document.getElementById("user-name");
    user.innerHTML = "";
    userName = "";
    logout.classList.toggle("show");
    login.classList.toggle("hide");
    user.classList.toggle("show");
  });

function addTask() {
  if (itemBox.value === "" || quantityBox.value === "") {
    alert("Please enter the missing item or quantity");
    return;
  } else {
    let li = document.createElement("li");
    let item = document.createElement("item");
    item.innerHTML = itemBox.value;
    item.classList.add("item");
    li.appendChild(item);
    listContainer.appendChild(li);
    let quantity = document.createElement("quantity");
    quantity.innerHTML = quantityBox.value;
    quantity.classList.add("quantity");
    li.appendChild(quantity);
    let user = document.createElement("user");
    user.innerHTML = `${userName}`;
    user.classList.add("user");
    li.appendChild(user);
    let close = document.createElement("close");
    close.innerHTML = "&#215;";
    close.classList.add("close");
    li.appendChild(close);
  }
  itemBox.value = "";
  quantityBox.value = "";
  itemBox.focus();
  saveData();
}

document.querySelector(".js-add-button").addEventListener("click", () => {
  addTask();
});

listContainer.addEventListener(
  "click",
  function (event) {
    if (
      event.target.tagName === "LI" ||
      event.target.classList.contains("item") ||
      event.target.classList.contains("quantity") ||
      event.target.classList.contains("user")
    ) {
      const li = event.target.closest("li");
      if (li) {
        li.classList.toggle("checked");
        saveData();
      }
    } else if (event.target.tagName === "CLOSE") {
      event.target.parentElement.remove();
      saveData();
    }
  },
  false
);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTaskList() {
  listContainer.innerHTML = localStorage.getItem("data");
}

showTaskList();

document.body.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    itemBox.value !== "" &&
    quantityBox.value !== ""
  ) {
    addTask();
  }
});
