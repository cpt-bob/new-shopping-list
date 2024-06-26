const itemBox = document.getElementById("item-box");
const quantityBox = document.getElementById("quantity-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (itemBox.value === "") {
    alert("Please enter an item to buy");
  } else if (quantityBox.value === "") {
    alert("Please enter a quantity to buy");
  } else {
    let li = document.createElement("li");
    li.innerHTML = itemBox.value;
    listContainer.appendChild(li);
    let quantity = document.createElement("quantity");
    quantity.innerHTML = quantityBox.value;
    li.appendChild(quantity);
    let close = document.createElement("close");
    close.innerHTML = "&#215;";
    li.appendChild(close);
  }
  itemBox.value = "";
  quantityBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (event) {
    if (event.target.tagName === "LI") {
      event.target.classList.toggle("checked");
      saveData();
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
  if (event.key === "Enter") {
    addTask();
  }
});
