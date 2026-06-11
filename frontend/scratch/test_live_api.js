async function testLive() {
  console.log("Calling live API...");
  try {
    const res = await fetch("https://soimoc-landingpage.vercel.app/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "SOIMOCVIP15",
        cartItems: []
      })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testLive();
