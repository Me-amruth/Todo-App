let addBtn = document.getElementById("addBtn");
let form = document.getElementById('popupForm');

// ---------------------------------
// ---------- Popup codes ----------
// ---------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const list = document.querySelector(".lists");
    const popup = document.getElementById("popup");
    const closeBtn = document.querySelector(".close-btn");
    const closePopupBtn = document.getElementById("closePopupBtn");
    
    addBtn.addEventListener("click", () => {
        form.action = "/add";
        popup.style.display = "flex";
    });
  
    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });

    closePopupBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });

    // Close the popup if the user clicks outside of the popup content
    /*
    window.addEventListener('click', function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    });
    */

    // ----------------------------
    // ---- End of popup code -----
    // ----------------------------
    function addTask(id, title, desc) {
        const newDraggable = document.createElement("div");
        newDraggable.classList.add("container");
        newDraggable.innerHTML = `
        <div class="draggable" id="${id}">
            <div class="action edit">Edit</div>
            <dl class="item">
                <dt>${title}</dt>
                <dd>${desc}</dd>
                <h5 id="time-${id}"></h5> <!-- Unique ID for time display -->
            </dl>
            <div class="action delete">Delete</div>
        </div>
        `;
        list.appendChild(newDraggable);
    }
    
    function loadTask() {
        fetch('/view')
        .then(res => res.json())
        .then(data => {
            if (data) {
                data.forEach(task => {
                    // Add the task element to the DOM
                    addTask(task._id, task.title, task.desc);

                    // Set up an interval to update the time dynamically
                    setInterval(() => {
                        // Combine date and time into a single Date object
                        const combinedDateTime = new Date(`${task.date}T${task.time}`);

                        // Get the current date and time
                        const currentDateTime = new Date();

                        // Calculate the difference in milliseconds
                        const timeDifference = combinedDateTime - currentDateTime;

                        // Convert the difference to days, hours, minutes, and seconds
                        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                        // Construct the time string
                        const time = `${days}d ${hours}h ${minutes}m ${seconds}s`;

                        // Update the time in the existing task element
                        const timeElement = document.getElementById(`time-${task._id}`);
                        if (timeElement) {
                            timeElement.textContent = time;
                        }
                    }, 1000); // Update every second
                });
            }
        })
        .catch(error => {
            console.error('Error:', error); // Handle errors
        });
    }
    
    window.onload = loadTask;
    // Call the function to append the draggable element to the list
});
