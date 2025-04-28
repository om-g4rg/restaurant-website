document.getElementById("proceedButton").addEventListener("click", async function() {

  const reservationData = {
      name: document.getElementById("name").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      guests: document.getElementById("guests").value,
  };

  // Send reservation data to backend to create a payment order
  const response = await fetch('/create-payment-order', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
  });

  const data = await response.json();

  // Check if the order creation was successful
  if (data.success) {
      // Show the QR code for payment
      document.getElementById("paymentQR").style.display = "block";
      document.getElementById("qrCodeImage").src = data.qrCodeUrl; // URL for the payment QR code

  } else {
      alert("There was an error creating your payment. Please try again.");
  }
});
