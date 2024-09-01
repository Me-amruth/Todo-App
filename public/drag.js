document.addEventListener("DOMContentLoaded", () => {
    // Initial container setup
    const list = document.querySelector(".lists");

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let draggable;

    list.addEventListener("mousedown", startDrag);
    list.addEventListener("touchstart", startDrag);
    list.addEventListener("mousemove", drag);
    list.addEventListener("touchmove", drag);
    list.addEventListener("mouseup", endDrag);
    list.addEventListener("mouseleave", endDrag);
    list.addEventListener("touchend", endDrag);

    function startDrag(event) {
        const target = event.target.closest(".draggable");
        if (target) {
            draggable = target;
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            draggable.style.transition = "none";
        }
    }

    function drag(event) {
        if (!isDragging || !draggable) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;

        if (currentTranslate < -50) {
            draggable.querySelector(".edit").style.right = "0";
        } else {
            draggable.querySelector(".edit").style.right = "-50px";
        }

        if (currentTranslate > 50) {
            draggable.querySelector(".delete").style.left = "0";
        } else {
            draggable.querySelector(".delete").style.left = "-50px";
        }
    }

    function endDrag() {
        if (!isDragging || !draggable) return;
        cancelAnimationFrame(animationID);
        isDragging = false;

        if (currentTranslate < -150) {
            promptEdit();
        } else if (currentTranslate > 150) {
            deleteItem();
        }

        setPositionByIndex();
        draggable.style.transition = "transform 0.5s ease-in-out";
        draggable = null;
    }

    function getPositionX(event) {
        return event.type.includes("mouse")
            ? event.pageX
            : event.touches[0].clientX;
    }

    function animation() {
        if (draggable) {
            draggable.style.transform = `translateX(${currentTranslate}px)`;
            if (isDragging) requestAnimationFrame(animation);
        }
    }

    function setPositionByIndex() {
        if (draggable) {
            currentTranslate = 0;
            prevTranslate = currentTranslate;
            draggable.style.transform = `translateX(${currentTranslate}px)`;
            draggable.querySelector(".edit").style.right = "-50px";
            draggable.querySelector(".delete").style.left = "-50px";
        }
    }
    function promptEdit() {
        const popup = document.getElementById("popup");
        const form = document.getElementById("popupForm");
        const titleInput = form.querySelector('input[type="text"]');
        const descriptionTextarea = form.querySelector("textarea");
        const dateInput = form.querySelector('input[type="date"]');
        const timeInput = form.querySelector('input[type="time"]');

        if (draggable) {
            // Get data from the draggable element
            const item = draggable.querySelector(".item");
            const title = item.querySelector("dt").textContent;
            const description = item.querySelector("dd").textContent;
            const endDate = item.querySelector("h5").textContent.split(" ")[2]; // Example extraction
            const endTime = item.querySelector("h5").textContent.split(" ")[4]; // Example extraction
            titleInput.value = title;
            descriptionTextarea.value = description;
            dateInput.value = endDate;
            timeInput.value = endTime;
            // Show the popup
            form.action = '/edit?id='+draggable.id;
            popup.style.display = "flex";
        }
    }

    function deleteItem() {
        if (draggable) {
            fetch(`/delete?id=${draggable.id}`, {
                method: "DELETE", // Specify the request method
                headers: {
                    "Content-Type": "application/json" // Set the content type header if needed
                }
            })
                .then(response => {
                    response.text();
                    document.location.href = "/";
                })
                .then(data => {
                    // Handle the response data if needed
                    alert("Data deleted");
                    draggable.remove();
                })
                .catch(error => {
                    console.error("Error:", error); // Handle errors
                });
        }
    }
});
