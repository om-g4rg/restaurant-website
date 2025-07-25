const menuSection = document.getElementById('menuSection');
let currentEditingItemId = null;

// Function to show the popup
document.addEventListener("DOMContentLoaded", function () {
    const addBtn = document.getElementById("addMenuBtn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            console.log("✅ Add Menu Clicked");
            document.getElementById("menuPopup").classList.remove("hidden");
        });
    }

    // Load menu items when page loads
    adminMenuDisplay();
});

// Function to close the popup
function closePopup() {
    document.getElementById("menuPopup").classList.add("hidden");
}

// ------------------Sending Data To The Server---------------------------------------
function saveBtn(){
    const itemName = document.getElementById("menuName").value;
    const price = document.getElementById("menuPrice").value;
    const ingredients = document.getElementById("menuIngredients").value;
    const image = document.getElementById("menuPhoto").files[0];
    const category = document.getElementById("menuCategory").value;
    if (!itemName || !price || !ingredients || !image) {
        alert("Please fill out all fields.");
        return;
    }

    const reader=new FileReader();
    reader.readAsDataURL(image);
    reader.onload= async function(){
        const imageFile= reader.result;

        const newItem={
            itemName,
            price: parseFloat(price),
            ingredients,
            image: imageFile,
            category
        }

        try{
            const response = await fetch(`http://localhost:8000/add-item`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(newItem)
            })
            const result= await response.json();
            alert(result.Message);
            closePopup();
            location.reload();

        }
        catch(err){
            console.error("Error:", err);
            alert("error accoured");
        }
    }

}

// ---------------------------Menu_Display---------------------------------------
window.onload= adminMenuDisplay();

async function adminMenuDisplay(){
    try{
      const response= await fetch("http://localhost:8000/get-item");
      const menuItems= await response.json();
  
      const container=document.querySelector("#menuContainer");
      container.innerHTML="";
  
      menuItems.forEach(item => {
        const newItem = document.createElement("div");
        newItem.classList.add("menuItem");
  
        newItem.innerHTML = `<div class="menu-card">
                                    <img class="menu-image" src="${item.image}" alt="${item.itemName}">
                                    <div class="menu-details">
                                    <h3 class="menu-title">${item.itemName}</h3>
                                    <p class="menu-ingredients">${item.ingredients}</p>
                                    <p class="menu-category"><strong>Category:</strong> ${item.category}</p>
                                    <span class="menu-price">₹${item.price}</span>
                                    <div class="menu-actions">
                                        <button class="edit-btn" data-id="${item._id}">Update</button>
                                        <button class="remove-btn" data-id="${item._id}">Remove</button>
                                    </div>
                                    </div>
                                </div>
                                `;
        container.appendChild(newItem);
    });
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const itemId = this.getAttribute("data-id");
                await deleteMenuItem(itemId);
            });
        });
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const itemId = this.getAttribute("data-id");
                await openEditPopup(itemId);
            });
        });
      
    }catch(err){
      alert(`Error is :${err}`);
    }
}

// --------------------------delete menu item-------------------------------------
async function deleteMenuItem(itemId){
    try{
      const response= await fetch(`http://localhost:8000/delete-menu-item/${itemId}`,{
        method:"DELETE"
    });

    const result = await response.json();
    alert(result.message);

    adminMenuDisplay();

    }catch(err){
        alert(`error: ${err}`)
    }
}


// --------------------------open edit popup-------------------------------
async function openEditPopup(itemId) {
    currentEditingItemId = itemId;

    // Fetch existing data of the item
    fetch(`http://localhost:8000/get-item/${itemId}`)
        .then(response => response.json())
        .then(item => {
            document.getElementById("editName").value = item.itemName;
            document.getElementById("editIngredients").value = item.ingredients;
            document.getElementById("editPrice").value = item.price;
            document.getElementById("editCategory").value = item.category

        });

    document.getElementById("editPopup").style.display = "block";
}


// -------------------------------close edit popup-----------------------------
function closeEditPopup() {
    document.getElementById("editPopup").style.display = "none";
}


// ----------------save edit items--------------------

async function saveEditedItem(){
    if (!currentEditingItemId) {
        alert("No item selected for editing.");
        return;
    }

    let imageFile = document.getElementById("editImageFile").files[0];

    const itemId= currentEditingItemId;
    const updatedData={
        itemName: document.getElementById("editName").value,
        ingredients:document.getElementById("editIngredients").value,
        price:document.getElementById("editPrice").value,
        image:null,
        category:document.getElementById("editCategory").value,

    }

    // --------------------------------------------

    async function updateIt(){
        try{
            const response = await fetch(`http://localhost:8000/edit-menu-item/${itemId}`, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(updatedData)
        })
    
        closeEditPopup()
        currentEditingItemId = null;
        adminMenuDisplay();
        }catch(err){
            alert(`error : ${err}`);
        }
    }
    // --------------------------------------------------

    if (imageFile) { 
        const reader= new FileReader();

        reader.onloadend=()=>{
        updatedData.image= reader.result;

        updateIt();
    }   
        reader.readAsDataURL(imageFile);
        document.getElementById("editImageFile").value= null;

    } else {
        const response = await fetch(`http://localhost:8000/get-item/${itemId}`);
        const item = await response.json();
        updatedData.image = item.image;

        updateIt();
    }
}