async function menuDisplay() {
  try {
    const response = await fetch("http://localhost:8000/get-item");
    const menuItems = await response.json();

    // Clear previous content in each section
    const categories = ["starters", "main-course", "dessert", "beverages"];
    categories.forEach(cat => {
      const container = document.getElementById(`${cat}-items`);
      if (container) container.innerHTML = "";
    });

    menuItems.forEach(item => {
      const category = item.category?.toLowerCase(); // Ensure lowercase
      const container = document.getElementById(`${category}-items`);
      if (!container) return; // Skip if category section not found

      const newItem = document.createElement("div");
      newItem.classList.add("menuItem");

      newItem.innerHTML = `
        <div class="menu-card">
          <img class="menu-image" src="${item.image}" alt="${item.name}">
          <div class="menu-details">
              <h3 class="menu-title">${item.itemName}</h3>
              <p class="menu-ingredients">${item.ingredients}</p>
              <span class="menu-price">₹${item.price}</span>
          </div>
        </div>
      `;

      container.appendChild(newItem);
    });
  } catch (err) {
    alert("Failed to load menu: " + err.message);
  }
}

window.onload = menuDisplay;
