import { db } from "./firebase-config.js";

import {
collection,
getDocs,
doc,
deleteDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

async function loadAppointments() {

const container =
document.getElementById(
"appointments-container"
);

if (!container) return;

container.innerHTML = "";

const querySnapshot =
await getDocs(
collection(
db,
"Appointments"
)
);

querySnapshot.forEach(
(docSnap) => {

  const data =
    docSnap.data();

  const id =
    docSnap.id;

  const div =
    document.createElement(
      "div"
    );

  div.innerHTML = `
    <p><b>Name :</b>
    ${data.name || ""}</p>

    <button id="approve-${id}">
    Approve
    </button>

    <button id="reject-${id}">
    Reject
    </button>

    <button id="delete-${id}">
    Delete
    </button>

    <hr>
  `;

  container.appendChild(
    div
  );

  document.getElementById(
    `approve-${id}`
  ).onclick =
  () =>
  updateStatus(
    id,
    "verified"
  );

  document.getElementById(
    `reject-${id}`
  ).onclick =
  () =>
  updateStatus(
    id,
    "rejected"
  );

  document.getElementById(
    `delete-${id}`
  ).onclick =
  () =>
  deleteAppointment(
    id
  );

}

);

}

async function updateStatus(
id,
status
) {

await updateDoc(
doc(
db,
"Appointments",
id
),
{
status: status
}
);

alert(
"Status Updated"
);

loadAppointments();

}

async function deleteAppointment(
id
) {

if (
confirm(
"Are you sure?"
)
) {

await deleteDoc(
  doc(
    db,
    "Appointments",
    id
  )
);

alert(
  "Deleted Successfully"
);

loadAppointments();

}

}

loadAppointments();
