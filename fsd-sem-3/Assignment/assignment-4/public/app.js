const form = document.getElementById("requestForm");
const container = document.getElementById("requestsContainer");

const totalRequests = document.getElementById("totalRequests");
const highRequests = document.getElementById("highRequests");
const activeRequests = document.getElementById("activeRequests");
const requestCount = document.getElementById("requestCount");

let editingId = null;


// GET ALL REQUESTS
async function getRequests() {

    const response = await fetch("/api/requests");

    const requests = await response.json();

    displayRequests(requests);
}


// DISPLAY REQUESTS
function displayRequests(requests) {

    container.innerHTML = "";

    totalRequests.textContent = requests.length;

    highRequests.textContent =
        requests.filter(r => r.priority === "High").length;

    activeRequests.textContent = requests.length;

    requestCount.textContent =
        `${requests.length} request${requests.length !== 1 ? "s" : ""}`;

    if (requests.length === 0) {

        container.innerHTML = `
            <div class="request-card">
                <p>No requests submitted yet.</p>
            </div>
        `;

        return;
    }


    requests.forEach(request => {

        const card = document.createElement("div");

        card.className = "request-card";

        card.innerHTML = `

            <div class="request-top">

                <h3>${request.category}</h3>

                <span class="priority ${request.priority}">
                    ${request.priority}
                </span>

            </div>

            <p>
                <strong>${request.studentName}</strong>
                · ${request.email}
            </p>

            <p>
                ${request.description}
            </p>

            <div class="request-actions">

                <button
                    class="edit-btn"
                    onclick="editRequest(${request.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteRequest(${request.id})">
                    Delete
                </button>

            </div>
        `;

        container.appendChild(card);

    });
}


// CREATE / UPDATE
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {

        studentName:
            document.getElementById("studentName").value,

        email:
            document.getElementById("email").value,

        category:
            document.getElementById("category").value,

        description:
            document.getElementById("description").value,

        priority:
            document.getElementById("priority").value
    };


    let url = "/api/requests";

    let method = "POST";


    if (editingId !== null) {

        url = `/api/requests/${editingId}`;

        method = "PUT";
    }


    const response = await fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    });


    if (response.ok) {

        form.reset();

        editingId = null;

        document.getElementById("submitBtn").textContent =
            "Submit Request →";

        getRequests();
    }

});


// EDIT
async function editRequest(id) {

    const response =
        await fetch(`/api/requests/${id}`);

    const request =
        await response.json();


    document.getElementById("studentName").value =
        request.studentName;

    document.getElementById("email").value =
        request.email;

    document.getElementById("category").value =
        request.category;

    document.getElementById("description").value =
        request.description;

    document.getElementById("priority").value =
        request.priority;


    editingId = id;

    document.getElementById("submitBtn").textContent =
        "Update Request →";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// DELETE
async function deleteRequest(id) {

    if (!confirm("Delete this request?")) {
        return;
    }


    const response =
        await fetch(`/api/requests/${id}`, {
            method: "DELETE"
        });


    if (response.ok) {
        getRequests();
    }
}


// INITIAL LOAD
getRequests();