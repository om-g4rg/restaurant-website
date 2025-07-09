window.onload = function () {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateInput = document.getElementById("date");
  dateInput.min = formatDate(today);
  dateInput.max = formatDate(nextMonth);
};


document.getElementById("proceedButton").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const guests = document.getElementById("Guests").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  // Simple validation
  if (!name || !phone || phone.length !== 10 ||!guests||!date ||!time ) {
    alert("Please fill all fields correctly.");
    return;
  }
  const newReservation={
      name,
      phone,
      guests,
      date,
      time
    }
// -----------------------------------------------------------------------------------------------
    let guestAmount= Math.round(guests/5)*5000;
    if(guestAmount<1){
        guestAmount= 5000;
    }
// ----------------------------------------------------------------------------------------     
  // Proceed to payment here...
  const options = {
    key: "rzp_test_3ACg221LR9sCJL", // Replace with your Razorpay Test Key ID
    amount: guestAmount, // Amount in paisa (₹50.00)
    currency: "INR",
    name: "Your Restaurant Name",
    description: "Reservation Payment",
    handler: async function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // Save reservation to your database here using fetch() or AJAX
        try{
            const response = await fetch(`http://localhost:8000/add-reservation`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(newReservation)
            })
            const result= await response.json();
            alert(result.Message);

        }
        catch(err){
            console.error("Error:", err);
            alert("error accoured");
        }
    },
    prefill: {
        name: name,
        contact: phone
    },
    theme: {
        color: "#3399cc"
    }
};

const rzp1 = new Razorpay(options);
rzp1.open();
});


document.getElementById("checkReservationBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const guests = document.getElementById("Guests").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name || !phone || phone.length !== 10 || !guests || !date || !time) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    const query = new URLSearchParams({
      name,
      phone,
      guests,
      date,
      time,
    });

    const response = await fetch(`http://localhost:8000/check-reservation?${query.toString()}`);
    const data = await response.json();

    if (response.ok && data.exists) {
      alert("✅ Reservation Found:\n\n" +
        `Name: ${data.reservation.name}\n` +
        `Phone: ${data.reservation.phone}\n` +
        `Guests: ${data.reservation.guests}\n` +
        `Date: ${data.reservation.date}\n` +
        `Time: ${data.reservation.time}`
      );
    } else {
      alert("❌ No reservation found with the provided details.");
    }
  } catch (err) {
    console.error("Error checking reservation:", err);
    alert("Something went wrong while checking the reservation.");
  }
});


document.getElementById("cancelReservationBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const guests = document.getElementById("Guests").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name || !phone || phone.length !== 10 || !guests || !date || !time) {
    alert("Please fill all fields correctly.");
    return;
  }

  const confirmDelete = confirm(
    "⚠️ Are you sure you want to delete your reservation?\n\nNote: Some cancellation charges might apply."
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:8000/delete-reservation`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone, guests, date, time })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("✅ Reservation successfully canceled.");
    } else {
      alert("❌ No matching reservation found to cancel.");
    }
  } catch (err) {
    console.error("Error deleting reservation:", err);
    alert("Something went wrong while cancelling the reservation.");
  }
});

