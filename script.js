const itemBox = document.getElementById("item-box");
const quantityBox = document.getElementById("quantity-box");
const listContainer = document.getElementById("list-container");

// get userName from login for use in other functions
const getUserName = () => {
  const email = document.getElementById("email").value;
  return email === "cpt.bob@gmail.com" ? "CptBob" : null;
};

// function to run handlelogin function onclick and allow the logout link to be seen
function login() {
  handleLogin();
  const loginBox = document.getElementById("login-box");
  const login = document.getElementById("login-link");
  const logout = document.getElementById("logout-link");
  // const userName = getUserName();

  loginBox.classList.toggle("show");
  logout.classList.toggle("show");
  login.classList.toggle("hide");
}

// function to set username to null, change the user back to the login link and hide the logout link
function logout() {
  const login = document.getElementById("login-link");
  const logout = document.getElementById("logout-link");
  const user = document.getElementById("user-name");
  user.innerHTML = "";
  logout.classList.toggle("show");
  login.classList.toggle("hide");
  user.classList.toggle("show");
}

// function to set the username and show it in the HTML
function handleLogin() {
  const user = document.getElementById("user-name");
  const userName = getUserName();

  if (userName) {
    console.log(userName);
    user.innerHTML = `${userName}`;
    user.classList.toggle("show");
  } else {
    alert("Unkown User");
  }
}

// event listeners for login/logout functions
document.querySelector(".js-login-button").addEventListener("click", () => {
  login();
});

document.querySelector(".js-login-link").addEventListener("click", () => {
  const loginBox = document.getElementById("login-box");
  const email = document.getElementById("email");
  loginBox.classList.toggle("show");
  email.focus();
});

document.querySelector(".js-logout-link").addEventListener("click", () => {
  logout();
});

// function to add the items to the list
function addTask() {
  const userName = getUserName();

  if (itemBox.value === "" || quantityBox.value === "") {
    alert("Please enter the missing item or quantity");
    return;
  }
  {
    // create li for future list items
    const li = document.createElement("li");

    // create item for the list and add
    const item = document.createElement("span");
    item.classList.add("item");
    item.innerHTML = itemBox.value;
    li.appendChild(item);

    // create quantity for the list and add
    const quantity = document.createElement("span");
    quantity.classList.add("quantity");
    quantity.innerHTML = quantityBox.value;
    li.appendChild(quantity);

    // create user for the list and add from login
    const user = document.createElement("span");
    user.classList.add("user");
    user.innerHTML = `${userName}`;
    li.appendChild(user);

    // create close "X" to remove the selected li from the list
    close = document.createElement("span");
    close.classList.add("close");
    close.innerHTML = "&#215;";
    li.appendChild(close);

    // update all items
    listContainer.appendChild(li);
  }
  // reset the inputs, return focus to the first box and run savedata function
  itemBox.value = "";
  quantityBox.value = "";
  itemBox.focus();
  saveData();
}

// event listener to add item to the list
document.querySelector(".js-add-button").addEventListener("click", () => {
  addTask();
});

// event listener to strikethrough items that are in the cart and add the ability to remove them
listContainer.addEventListener(
  "click",
  function (event) {
    // adds the ability to strikethrough no matter where you click on the list item
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
      // remove item from list on click of close x
    } else if (event.target.classList.contains("close")) {
      event.target.parentElement.remove();
      saveData();
    }
  },
  false
);

// function to save the data to local storage
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

// function to add items from localstorage to the list
function showTaskList() {
  listContainer.innerHTML = localStorage.getItem("data");
}

// call fuction to render the list
showTaskList();

// add the ability to use the enter key to add items to the cart
document.body.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    itemBox.value !== "" &&
    quantityBox.value !== ""
  ) {
    addTask();
  }
});
