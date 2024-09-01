document.addEventListener('DOMContentLoaded',() => {
  let button = document.querySelector('.menu-btn');
  let menu = document.querySelector('.menu');
  let li = document.querySelectorAll('header .menu li');
    
  button.addEventListener('click',() => {
   if(!menu.style.width || menu.style.width == "0px") {
     menu.style.width = "180px";
   } else {
     menu.style.width = "0px"
   }
  })
  
  window.addEventListener('click', function(event) {
    let el = menu;
    let btn = button
    
    // Check if the click was outside the menu element and button
    if (!el.contains(event.target) && !btn.contains(event.target)) {
        el.style.width = "0px";
   }
   });
   
        // Determine which link is active and reset the list accordingly
    if (document.location.href.endsWith("/about")) {
        resetList(1); // Assuming the first <li> corresponds to "#about"
    } else if (document.location.href.endsWith("/contact")) {
        resetList(2); // Assuming the second <li> corresponds to "#contact"
    } else {
        resetList(0); // Default case or for other links
    }
    
  function resetList(index) {
        li.forEach(item => {
            item.style.fontWeight = "normal"; // Reset font weight for all items
        });
        if (li[index]) {
            li[index].style.fontWeight = "bold"; // Apply bold to the specified item
        }
    }
    
});