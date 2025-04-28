
async function menuDisplay(){
  try{
    const response= await fetch("http://localhost:8000/get-item");
    const menuItems= await response.json();

    const container=document.querySelector(".menuContainer");
    container.innerHTML="";

    menuItems.forEach(item => {
      const newItem = document.createElement("div");
      newItem.classList.add("menuItem");

      newItem.innerHTML = `
      <div class="menu-card">
          <img class="menu-image" src="${item.image}" alt="${item.name}">
          <div class="menu-details">
              <h3 class="menu-title">${item.itemName}</h3>
              <p class="menu-ingredients">${item.ingredients}</p>
              <span class="menu-price">$${item.price}</span>
          </div>
      </div>
  `;
      container.appendChild(newItem);
    });
  }catch(err){
    alert(err);
  }
}

window.onload=menuDisplay;