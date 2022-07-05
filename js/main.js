let api = "http://localhost:8000/contacts";
let inp1 = document.querySelector(".inp-1");
let inp2 = document.querySelector(".inp-2");
let inp3 = document.querySelector(".inp-3");
let inp4 = document.querySelector(".inp-4");
let inp5 = document.querySelector(".inp-5");
let addBtn = document.querySelector(".btn-add");

addBtn.addEventListener("click", () => {
  const newContact = {
    firstName: inp1.value,
    lastName: inp2.value,
    phone: inp3.value,
    kpiWeek: inp4.value,
    kpiMonth: inp5.value,
  };
  let checkResult = checkInputs(newContact);
  if (checkResult) {
    console.log("check");
    showAlert("Заполните поля!", "red", "white");
    return;
  }
  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  }).then(() => {
    inp1.value = "";
    inp2.value = "";
    inp3.value = "";
    inp4.value = "";
    inp5.value = "";
    showAlert("Успешно добавлено!", "blue", "white");
    getContacts();
  });
});
function checkInputs(obj) {
  console.log(obj);
  for (let i in obj) {
    if (!obj[i].trim()) {
      return true;
    }
  }
  return false;
}
let ul = document.querySelector(".list-group");
let modal = document.querySelector(".my-modal");
let closeModal = document.querySelector(".close-modal");
let editInp1 = document.querySelector(".edit-inp-1");
let editInp2 = document.querySelector(".edit-inp-2");
let editInp3 = document.querySelector(".edit-inp-3");
let editInp4 = document.querySelector(".edit-inp-4");
let editInp5 = document.querySelector(".edit-inp-5");
let btnSave = document.querySelector(".btn-save");

let searchWord = "";
let countPerPage = 3;
let currentPage = 1;
let pagesCount = 1;

const getContacts = () => {
  fetch(`${api}?q=${searchWord}`)
    .then((res) => {
      return res.json();
    })
    .then((contacts) => {
      ul.innerHTML = "";
      pagesCount = Math.ceil(contacts.length / countPerPage);
      pagination();
      console.log(contacts);
      let newContacts = contacts.splice(
        (currentPage - 1) * countPerPage,
        countPerPage
      );
      newContacts.forEach((item) => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        const img2 = document.createElement("img");
        const div = document.createElement("div");
        img.setAttribute("src", "./images/del.png");
        img2.setAttribute("src", "./images/text.png");
        li.classList.add("list-group-item");
        li.innerHTML = `
        <h5>${item.firstName}  ${item.lastName} <br/>
        <a href="tel:${item.phone}">${item.phone}</a><br/>
        <span class="kpi-color">KPI week: ${item.kpiWeek}%<br/>  KPI month: ${item.kpiMonth}%</span>
        </h5>
        `;
        div.append(img2, img);
        li.append(div);
        ul.append(li);
        img.addEventListener("click", () => {
          fetch(`${api}/${item.id}`, {
            method: "DELETE",
          }).then(() => {
            showAlert("Успешно удалено", "green", "white");
            getContacts();
          });
        });
        img2.addEventListener("click", () => {
          modal.style.display = "flex";
          editInp1.value = item.firstName;
          editInp2.value = item.lastName;
          editInp3.value = item.phone;
          editInp4.value = item.kpiWeek;
          editInp5.value = item.kpiMonth;
          btnSave.setAttribute("id", item.id);
        });
      });
    });
};
getContacts();
function showAlert(text, bgColor, color) {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: bgColor,
      color: color,
    },
  }).showToast();
}
let liveSearchInp = document.querySelector(".live-search-inp");
liveSearchInp.addEventListener("input", (event) => {
  searchWord = event.target.value;
  currentPage = 1;
  getContacts();
});
btnSave.addEventListener("click", (event) => {
  const editedContact = {
    firstName: editInp1.value,
    lastName: editInp2.value,
    phone: editInp3.value,
    kpiWeek: editInp4.value,
    kpiMonth: editInp5.value,
  };
  fetch(`${api}/${event.target.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editedContact),
  }).then(() => {
    modal.style.display = "none";
    getContacts();
  });
});
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
let ulPagination = document.querySelector(".pagination");
const pagination = () => {
  ulPagination.innerHTML = `<button class="next">Next</button>`;
  for (let i = 1; i <= pagesCount; i++) {
    let li = document.createElement("li");
    li.classList.add("page-link");
    li.innerText = i;
    ulPagination.append(li);
    li.addEventListener("click", () => {
      currentPage = i;
      getContacts();
    });
  }
};
