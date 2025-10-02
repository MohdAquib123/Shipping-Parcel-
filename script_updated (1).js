
function validateField(id, errorId) {
  const input = document.getElementById(id);
  if (input.value.trim() === "") {
    document.getElementById(errorId).textContent = "This field must be filled";
    return false;
  } else {
    document.getElementById(errorId).textContent = "";
    return true;
  }
}

// Attach live validation to required fields
["weight","value","length","width","height"].forEach(field => {
  const input = document.getElementById(field);
  input.addEventListener("blur", () => validateField(field, field + "Error"));
  input.addEventListener("input", () => validateField(field, field + "Error"));
});

document.getElementById("estimateBtn").addEventListener("click", () => {
  let isValid = true;

  // Validate all fields before calculation
  ["weight","value","length","width","height"].forEach(field => {
    if (!validateField(field, field + "Error")) isValid = false;
  });

  if (!isValid) return; // stop if validation fails

  const weight = parseFloat(document.getElementById("weight").value) || 0;
  const value = parseFloat(document.getElementById("value").value) || 0;
  const length = parseFloat(document.getElementById("length").value) || 0;
  const width = parseFloat(document.getElementById("width").value) || 0;
  const height = parseFloat(document.getElementById("height").value) || 0;

  const service = document.getElementById("service").value;
  const fromRegion = document.getElementById("fromRegion").value;
  const toRegion = document.getElementById("toRegion").value;

  const volume = (length * width * height) / 5000;
  const chargeableWeight = Math.max(weight, volume);

  let baseRate = 50;
  if (service === "express") baseRate = 80;
  if (service === "overnight") baseRate = 120;

  let regionFactor = 1;
  if (fromRegion !== toRegion) {
    if (toRegion === "regional") regionFactor = 1.2;
    if (toRegion === "national") regionFactor = 1.5;
    if (toRegion === "international") regionFactor = 3.0;
  }

  const shippingCost = (chargeableWeight * baseRate * regionFactor).toFixed(2);
  const insurance = (value * 0.02).toFixed(2);

  const resultBox = document.getElementById("resultBox");
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <div class="row"><strong>Chargeable Weight:</strong><span>${chargeableWeight.toFixed(2)} kg</span></div>
    <div class="row"><strong>Service:</strong><span>${service}</span></div>
    <div class="row"><strong>From:</strong><span>${fromRegion}</span></div>
    <div class="row"><strong>To:</strong><span>${toRegion}</span></div>
    <div class="row"><strong>Shipping Cost:</strong><span>₹${shippingCost}</span></div>
    <div class="row"><strong>Insurance (2%):</strong><span>₹${insurance}</span></div>
    <div class="row"><strong>Total:</strong><span>₹${(parseFloat(shippingCost) + parseFloat(insurance)).toFixed(2)}</span></div>
  `;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("calcForm").reset();
  document.getElementById("resultBox").style.display = "none";
  document.querySelectorAll(".error").forEach(e => e.textContent = ""); // clear errors
});

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});
