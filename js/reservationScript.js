document.getElementById("proceedButton").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  // const date = document.getElementById("date").value;
  // const time = document.getElementById("time").value;

  // Simple validation
  if (!name || !phone || phone.length !== 10) {
    alert("Please fill all fields correctly.");
    return;
  }

  // Proceed to payment here...
  const options = {
    key: "rzp_test_3ACg221LR9sCJL", // Replace with your Razorpay Test Key ID
    amount: 5000, // Amount in paisa (₹50.00)
    currency: "INR",
    name: "Your Restaurant Name",
    description: "Reservation Payment",
    handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // Save reservation to your database here using fetch() or AJAX
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


