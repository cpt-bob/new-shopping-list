import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

// Initialize Firebase with Realtime Database URL
const firebaseConfig = {
  apiKey: "AIzaSyBpKsDGhucKO_QbNgjXG3vX1vuduYl8xy4",
  authDomain: "shopping-list-e939f.firebaseapp.com",
  databaseURL: "https://shopping-list-e939f-default-rtdb.firebaseio.com/",
  projectId: "shopping-list-e939f",
  storageBucket: "shopping-list-e939f.appspot.com",
};

// Setup Firebase constants
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const database = getDatabase(firebaseApp);
const shoppingListRef = ref(database, "shoppingList");

// Setup JS constants
const itemBox = document.getElementById("item-box");
const quantityBox = document.getElementById("quantity-box");
const listContainer = document.getElementById("list-container");

// get userName from login for use in other functions and check for userdoc
const getUserName = async (email, password) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    try {
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userName = userData.user;
        return userName;
      } else {
        throw new Error("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching the username:", error);
      throw error;
    }
  } catch (error) {
    console.error("Login error", error.message);
    throw error;
  }
};

// Handle login using credentials
const login = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  getUserName(email, password)
    .then((userName) => {
      if (userName) {
        handleLogin(userName);
      } else {
        alert("Unknown User");
      }
    })
    .catch((error) => {
      alert("Login failed. Please check your credentials.");
    });
};

// handle changes to the HTML on login
const handleLogin = (userName) => {
  const loginBox = document.getElementById("login-box");
  const user = document.getElementById("user-name");
  const login = document.getElementById("login-link");
  const logout = document.getElementById("logout-link");

  console.log("Logged in as:", userName);
  user.innerHTML = `${userName}`;
  user.classList.add("show");

  loginBox.classList.toggle("show");
  logout.classList.toggle("show");
  login.classList.toggle("hide");
};

// Event listener for login button
document.querySelector(".js-login-button").addEventListener("click", () => {
  login();
});

// handle logout of user
const logout = () => {
  const login = document.getElementById("login-link");
  const logout = document.getElementById("logout-link");
  const user = document.getElementById("user-name");

  user.innerHTML = "";
  user.classList.toggle("show");

  logout.classList.toggle("show");
  login.classList.toggle("hide");

  const auth = getAuth();
  auth
    .signOut()
    .then(() => {
      console.log("User successfully signed out");
    })
    .catch((error) => {
      console.error("Error signing out:", error.message);
    });
};

// event listener for the login popup
document.querySelector(".js-login-link").addEventListener("click", () => {
  const loginBox = document.getElementById("login-box");
  const email = document.getElementById("email");
  loginBox.classList.toggle("show");
  email.focus();
});

// event listener for the logout link
document.querySelector(".js-logout-link").addEventListener("click", () => {
  logout();
});

const createShoppingListElement = (item, quantity, userName) => {
  const li = document.createElement("li");

  const itemElement = document.createElement("span");
  itemElement.classList.add("item");
  itemElement.textContent = item;
  li.appendChild(itemElement);

  const quantityElement = document.createElement("span");
  quantityElement.classList.add("quantity");
  quantityElement.textContent = quantity;
  li.appendChild(quantityElement);

  const userElement = document.createElement("span");
  userElement.classList.add("user");
  userElement.textContent = userName;
  li.appendChild(userElement);

  const closeElement = document.createElement("span");
  closeElement.classList.add("close");
  closeElement.innerHTML = "&#215;";
  li.appendChild(closeElement);

  return li;
};

function addToList() {
  const userName = getUserName();

  if (itemBox.value === "" || quantityBox.value === "") {
    alert("Please enter the missing item or quantity");
    return;
  }

  const shoppingElement = createShoppingListElement(
    itemBox.value,
    quantityBox.value,
    userName
  );

  listContainer.appendChild(shoppingElement);

  saveData(itemBox.value, quantityBox.value, userName);

  itemBox.value = "";
  quantityBox.value = "";
  itemBox.focus();
}

// Function to render existing items from Firebase
const renderList = () => {
  // Listen for initial data once
  onValue(
    shoppingListRef,
    (snapshot) => {
      const data = snapshot.val();

      if (data) {
        listContainer.innerHTML = ""; // Clear existing list

        Object.keys(items).forEach((key) => {
          const listItem = data[key];
          const { item, quantity, user } = listItem;

          const listElement = createShoppingListElement(item, quantity, user);
          listContainer.appendChild(listElement);
        });
      } else {
        console.log("No items found in the database.");
      }
    },
    {
      onlyOnce: true, // Listen for initial data only once
    }
  );
};

// Call renderList when the page loads
document.addEventListener("DOMContentLoaded", () => {
  renderList();
});

// event listener to add item to the list
document.querySelector(".js-add-button").addEventListener("click", () => {
  addToList();
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
const saveData = async (item, quantity, userName) => {
  const database = getDatabase();
  const newListRef = push(ref(database, "items"));

  try {
    await set(newListRef, {
      item: item,
      quantity: quantity,
      user: userName,
    });
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Data not saved successfully. Error:", error);
  }
};

// add the ability to use the enter key to add items to the cart
document.body.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    itemBox.value !== "" &&
    quantityBox.value !== ""
  ) {
    addToList();
  }
});

// Older code left for reference.  Will clear after everything works

// function to run handlelogin function onclick and allow the logout link to be seen
// function login() {
//   handleLogin();
//   const loginBox = document.getElementById("login-box");
//   const login = document.getElementById("login-link");
//   const logout = document.getElementById("logout-link");

//   loginBox.classList.toggle("show");
//   logout.classList.toggle("show");
//   login.classList.toggle("hide");
// }

// // function to set username to null, change the user back to the login link and hide the logout link
// function logout() {
//   const login = document.getElementById("login-link");
//   const logout = document.getElementById("logout-link");
//   const user = document.getElementById("user-name");
//   user.innerHTML = "";
//   logout.classList.toggle("show");
//   login.classList.toggle("hide");
//   user.classList.toggle("show");
// }

// // function to set the username and show it in the HTML
// function handleLogin() {
//   const user = document.getElementById("user-name");

//   try {
//     const userName = await getUserName();

//     if (userName) {
//       console.log(userName);
//       user.innerHTML = `${userName}`;
//       user.classList.toggle("show");
//     } else {
//       alert("Unkown User");
//     }
//   } catch (error) {
//     alert("Login failed. Please check login credentials")
//   }
// }

// // event listeners for login/logout functions
// document.querySelector(".js-login-button").addEventListener("click", () => {
//   login();
// });

// old code left for reference. will be removed if everything works correctly

// // function to add the items to the list
// function addTask() {
//   const userName = getUserName();

//   if (itemBox.value === "" || quantityBox.value === "") {
//     alert("Please enter the missing item or quantity");
//     return;
//   }

//   // create li for future list items
//   const li = document.createElement("li");

//   // create item for the list and add
//   const item = document.createElement("span");
//   item.classList.add("item");
//   item.innerHTML = itemBox.value;
//   li.appendChild(item);

//   // create quantity for the list and add
//   const quantity = document.createElement("span");
//   quantity.classList.add("quantity");
//   quantity.innerHTML = quantityBox.value;
//   li.appendChild(quantity);

//   // create user for the list and add from login
//   const user = document.createElement("span");
//   user.classList.add("user");
//   user.innerHTML = `${userName}`;
//   li.appendChild(user);

//   // create close "X" to remove the selected li from the list
//   close = document.createElement("span");
//   close.classList.add("close");
//   close.innerHTML = "&#215;";
//   li.appendChild(close);

//   // update all items
//   listContainer.appendChild(li);

//   // save the data added
//   saveData(itemBox.value, quantityBox.value, userName);

//   // reset the inputs, return focus to the first box
//   itemBox.value = "";
//   quantityBox.value = "";
//   itemBox.focus();
// }

// old code left for reference

// // function to add items from localstorage to the list
// function showTaskList() {
//   listContainer.innerHTML = localStorage.getItem("data");
// }

// // call fuction to render the list
// showTaskList();
