document.getElementById("proceedButton").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const guests = document.getElementById("Guests").value.trim();
  // const date = document.getElementById("date").value;
  // const time = document.getElementById("time").value;

  // Simple validation
  if (!name || !phone || phone.length !== 10 ||!guests) {
    alert("Please fill all fields correctly.");
    return;
  }
  const newReservation={
      name,
      phone,
      guests
    }

  // Proceed to payment here...
  const options = {
    key: "rzp_test_3ACg221LR9sCJL", // Replace with your Razorpay Test Key ID
    amount: 5000, // Amount in paisa (₹50.00)
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




