const API_KEY = "2a9f95c6a7da43fb14917bbd";  // Replace with your API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.getElementById("swap-btn");  // Arrow button to swap currencies

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to swap currencies
const swapCurrencies = () => {
  // Get current values of from and to currencies
  let tempFromValue = fromCurr.value;
  let tempToValue = toCurr.value;

  // Swap the values
  fromCurr.value = tempToValue;
  toCurr.value = tempFromValue;

  // Swap the flags as well
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Update the exchange rate after swapping
  updateExchangeRate();
};

// Event listener for the swap button
swapBtn.addEventListener("click", swapCurrencies);

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Update the URL to use the "from" currency as the base
  const URL = `${BASE_URL}${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Error fetching data");

    let data = await response.json();
    let rate = data.conversion_rates[toCurr.value];  // Get the rate for the "to" currency

    if (!rate) {
      msg.innerText = "Exchange rate unavailable";
      return;
    }

    let finalAmount = (rate * parseInt(amount.value)).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    msg.innerText = "Failed to fetch exchange rate";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
