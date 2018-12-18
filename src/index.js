document.addEventListener("DOMContentLoaded", () => {
  // locate dogForm
  let dogForm = document.querySelector("#dog-form");
  // locate dog table
  let tableBody = document.querySelector("#table-body");

  // load logs from API and append to DOM
  fetch("http://localhost:3000/dogs")
    .then(response => response.json())
    .then(dogs => showDogs(dogs));

  // add submit event handler to update dog
  dogForm.addEventListener("submit", event => {
    event.preventDefault();
    const dogName = document.querySelector("#dogNameInput").value;
    const dogBreed = document.querySelector("#dogBreedInput").value;
    const dogSex = document.querySelector("#dogSexInput").value;
    const dogId = event.target.dataset.id;

    const dogRow = document.querySelector(`button[data-id="${dogId}"]`)
      .parentNode.parentNode;
    // send PATCH request to API
    fetch(`http://localhost:3000/dogs/${dogId}`, {
      method: "PATCH",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        name: dogName,
        breed: dogBreed,
        sex: dogSex
      })
    }).then(response => {
      if (response.ok) {
        dogRow.children[0].innerText = dogName;
        dogRow.children[1].innerText = dogBreed;
        dogRow.children[2].innerText = dogSex;
      }
    });
  });

  // add click event handler that prepares form to be submitted
  tableBody.addEventListener("click", event => {
    if (event.target.type === "button") {
      // change hidden input in dog form to ID of dog we want to edit
      let dogId = event.target.getAttribute("data-id");

      let currentRow = event.target.parentNode.parentNode.children;

      dogForm.children[0].value = currentRow[0].innerText;
      dogForm.children[1].value = currentRow[1].innerText;
      dogForm.children[2].value = currentRow[2].innerText;

      dogForm.dataset.id = dogId;
    }
  });
}); // end of DOM content loaded callback

// helper methods:
function showDogs(dogs) {
  let tableBody = document.querySelector("#table-body");
  dogs.forEach(function(dog) {
    const trDog = document.createElement("tr");
    trDog.innerHTML = `<td>${dog.name}</td> <td>${dog.breed}</td> <td>${
      dog.sex
    }</td>
    <td>
      <button type="button" data-id="${dog.id}">Edit</button>
    </td>`;

    tableBody.appendChild(trDog);
  });
}
