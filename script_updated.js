
document.getElementById("estimateBtn").addEventListener("click", () => {
  let isValid = true;

  // Clear previous errors
  document.querySelectorAll(".error").forEach(e => e.textContent = "");

  function checkRequired(id, errorId) {
    const input = document.getElementById(id);
    if (input.value.trim() === "") {
      document.getElementById(errorId).textContent = "This field must be filled";
      isValid = false;
    }
    return parseFloat(input.value) || 0;
  }

  const weight = checkRequired("weight", "weightError");
  const value = checkRequired("value", "valueError");
  const length = checkRequired("length", "lengthError");
  const width = checkRequired("width", "widthError");
  const height = checkRequired("height", "heightError");

  if (!isValid) return; // stop if validation fails

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
