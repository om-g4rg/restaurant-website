
const reservationSection =document.getElementById(`reservationSection`);

// --------------------------------RESERVATION DISPLAY------------------------

window.onload= adminReservationDisplay();

async function adminReservationDisplay(){
    try{
      const response= await fetch("http://localhost:8000/get-reservation");
      const menuItems= await response.json();
  
      const container=document.querySelector("#reservationContainer");
      container.innerHTML="";
  
      menuItems.forEach(item => {
        const newItem = document.createElement("div");
        newItem.classList.add("reservationItem");
  
        newItem.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.phone}</p>
        <p>${item.date}</p>
        <p>${item.time}</p>
        <span>Guests: ${item.guests}</span>
    `;
        container.appendChild(newItem);
    });
      
    }catch(err){
      alert(`Error is :${err}`);
    }
}
 