function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateMortgageDurationMonths() {
  const yearsInput = document.getElementById("duration-years");
  const monthsOutput = document.getElementById("duration-months");
  const years = parseInt(yearsInput.value, 10);
  if (!isNaN(years)) {
    monthsOutput.textContent = years * 12;
  } else {
    monthsOutput.textContent = "";
  }
}

function calculateAmountNeededForMortgage() {
  const propertyValueInput = document.getElementById("property-value");
  const currentFundsInput = document.getElementById("current-funds");
  const output = document.getElementById("amount-needed-mortgage");
  const propertyValue = parseFloat(propertyValueInput.value);
  const currentFunds = parseFloat(currentFundsInput.value);
  if (!isNaN(propertyValue) && !isNaN(currentFunds)) {
    const needed = propertyValue - currentFunds;
    output.textContent = formatNumberWithCommas(needed);
  } else {
    output.textContent = "";
  }
}

function calculateMonthlyInterestRate() {
  const interestRateInput = document.getElementById("interest-rate");
  const monthlyInterestRateOutput = document.getElementById(
    "monthly-interest-rate"
  );
  const interestRate = parseFloat(interestRateInput.value);
  if (!isNaN(interestRate)) {
    const monthlyRate = interestRate / 100 / 12;
    monthlyInterestRateOutput.textContent = monthlyRate.toFixed(6);
  } else {
    monthlyInterestRateOutput.textContent = "";
  }
}

function calculateLtvAmount() {
  const propertyValue = parseFloat(
    document.getElementById("property-value").value
  );
  const ltvPercentage = parseFloat(
    document.getElementById("ltv-percentage").value
  );
  const output = document.getElementById("ltv-amount");
  if (!isNaN(propertyValue) && !isNaN(ltvPercentage)) {
    const ltvAmount = propertyValue * (ltvPercentage / 100);
    output.textContent = formatNumberWithCommas(ltvAmount.toFixed(0));
  } else {
    output.textContent = "";
  }
}

function calculateDsrAmount() {
  const interestRate = parseFloat(
    document.getElementById("interest-rate").value
  );
  const durationYears = parseInt(
    document.getElementById("duration-years").value,
    10
  );
  let annualIncome;
  const annualIncomeElem = document.getElementById("annual-income");
  if (annualIncomeElem.tagName === "INPUT") {
    annualIncome = parseFloat(annualIncomeElem.value);
  } else {
    annualIncome = parseFloat(annualIncomeElem.textContent.replace(/,/g, ""));
  }
  const dsrPercentage = parseFloat(
    document.getElementById("dsr-percentage").value
  );
  const output = document.getElementById("dsr-amount");
  if (
    !isNaN(interestRate) &&
    !isNaN(durationYears) &&
    !isNaN(annualIncome) &&
    !isNaN(dsrPercentage)
  ) {
    const rate = interestRate / 100 / 12;
    const nper = durationYears * 12;
    const pmt = -((annualIncome * (dsrPercentage / 100)) / 12);
    let pv;
    if (rate === 0) {
      pv = pmt * nper;
    } else {
      pv = (pmt * (1 - Math.pow(1 + rate, -nper))) / rate;
    }
    output.textContent = formatNumberWithCommas(Math.abs(pv).toFixed(0));
  } else {
    output.textContent = "";
  }
}

function calculateActualMortgageCap() {
  const ltvAmount = parseFloat(
    document.getElementById("ltv-amount").textContent.replace(/,/g, "")
  );
  const dsrAmount = parseFloat(
    document.getElementById("dsr-amount").textContent.replace(/,/g, "")
  );
  const output = document.getElementById("actual-mortgage-cap");
  if (!isNaN(ltvAmount) && !isNaN(dsrAmount)) {
    const actualCap = Math.min(ltvAmount, dsrAmount);
    output.textContent = formatNumberWithCommas(actualCap.toFixed(0));
  } else {
    output.textContent = "";
  }
}

function calculateMonthlyMortgagePayment() {
  const monthlyInterestRate = parseFloat(
    document.getElementById("monthly-interest-rate").textContent
  );
  const durationMonths = parseInt(
    document.getElementById("duration-months").textContent,
    10
  );
  const amountNeeded = parseFloat(
    document
      .getElementById("amount-needed-mortgage")
      .textContent.replace(/,/g, "")
  );
  const output = document.getElementById("monthly-mortgage-payment");
  if (
    !isNaN(monthlyInterestRate) &&
    !isNaN(durationMonths) &&
    !isNaN(amountNeeded)
  ) {
    const pv = amountNeeded;
    const rate = monthlyInterestRate;
    const nper = durationMonths;
    let payment;
    if (rate === 0) {
      payment = pv / nper;
    } else {
      payment = (pv * rate) / (1 - Math.pow(1 + rate, -nper));
    }
    output.textContent = formatNumberWithCommas(Math.abs(payment).toFixed());
  } else {
    output.textContent = "";
  }
}

function calculatePaymentToIncomeRatio() {
  const monthlyPayment = parseFloat(
    document
      .getElementById("monthly-mortgage-payment")
      .textContent.replace(/,/g, "")
  );
  let monthlyIncome;
  if (document.getElementById("income-monthly-radio").checked) {
    monthlyIncome = parseFloat(document.getElementById("monthly-income").value);
  } else {
    const annualInput = document.getElementById("annual-income");
    monthlyIncome = annualInput.value ? parseFloat(annualInput.value) / 12 : 0;
  }
  const output = document.getElementById("payment-to-income-ratio");
  output.classList.remove(
    "highlight-green",
    "highlight-yellow",
    "highlight-red"
  );
  if (!isNaN(monthlyPayment) && !isNaN(monthlyIncome) && monthlyIncome !== 0) {
    const ratio = (monthlyPayment / monthlyIncome) * 100;
    output.textContent = ratio.toFixed(2) + "%";
    if (ratio < 20) {
      output.classList.add("highlight-green");
    } else if (ratio < 30) {
      output.classList.add("highlight-yellow");
    } else {
      output.classList.add("highlight-red");
    }
  } else {
    output.textContent = "";
  }
}

function updateIncomeInputs() {
  const monthlyRadio = document.getElementById("income-monthly-radio");
  const annualRadio = document.getElementById("income-annual-radio");
  const monthlyContainer = document.getElementById("monthly-income-container");
  const annualContainer = document.getElementById("annual-income-container");
  if (monthlyRadio.checked) {
    // Monthly is input, annual is output
    monthlyContainer.innerHTML = '<input type="number" id="monthly-income" />';
    annualContainer.innerHTML = '<output id="annual-income"></output>';
  } else {
    // Annual is input, monthly is output
    monthlyContainer.innerHTML = '<output id="monthly-income"></output>';
    annualContainer.innerHTML = '<input type="number" id="annual-income" />';
  }
  // Restore values and listeners
  if (monthlyRadio.checked) {
    const monthlyInput = document.getElementById("monthly-income");
    const annualOutput = document.getElementById("annual-income");
    monthlyInput.value = window._monthlyIncomeValue || "";
    annualOutput.textContent = monthlyInput.value
      ? formatNumberWithCommas((parseFloat(monthlyInput.value) * 12).toFixed(0))
      : "";
    monthlyInput.addEventListener("input", function () {
      window._monthlyIncomeValue = monthlyInput.value;
      annualOutput.textContent = monthlyInput.value
        ? formatNumberWithCommas(
            (parseFloat(monthlyInput.value) * 12).toFixed(0)
          )
        : "";
      updateAllOutputs();
    });
  } else {
    const monthlyOutput = document.getElementById("monthly-income");
    const annualInput = document.getElementById("annual-income");
    annualInput.value = window._annualIncomeValue || "";
    monthlyOutput.textContent = annualInput.value
      ? formatNumberWithCommas((parseFloat(annualInput.value) / 12).toFixed(0))
      : "";
    annualInput.addEventListener("input", function () {
      window._annualIncomeValue = annualInput.value;
      monthlyOutput.textContent = annualInput.value
        ? formatNumberWithCommas(
            (parseFloat(annualInput.value) / 12).toFixed(0)
          )
        : "";
      updateAllOutputs();
    });
  }
}

function saveInputsToLocalStorage() {
  const inputIds = [
    "property-value",
    "current-funds",
    "interest-rate",
    "duration-years",
    "ltv-percentage",
    "dsr-percentage",
  ];
  const data = {};
  inputIds.forEach(function (id) {
    data[id] = document.getElementById(id).value;
  });
  // Save which income type is selected and its value
  data["incomeType"] = document.getElementById("income-monthly-radio").checked
    ? "monthly"
    : "annual";
  if (data["incomeType"] === "monthly") {
    data["monthly-income"] = document.getElementById("monthly-income").value;
  } else {
    data["annual-income"] = document.getElementById("annual-income").value;
  }
  localStorage.setItem("mortgageInputs", JSON.stringify(data));
  alert("Inputs saved!");
}

function loadInputsFromLocalStorage() {
  const data = localStorage.getItem("mortgageInputs");
  if (data) {
    const inputIds = [
      "property-value",
      "current-funds",
      "interest-rate",
      "duration-years",
      "ltv-percentage",
      "dsr-percentage",
    ];
    const values = JSON.parse(data);
    inputIds.forEach(function (id) {
      if (values[id] !== undefined) {
        document.getElementById(id).value = values[id];
      }
    });
    // Restore income type and value
    if (values["incomeType"] === "monthly") {
      document.getElementById("income-monthly-radio").checked = true;
      document.getElementById("income-annual-radio").checked = false;
      updateIncomeInputs();
      if (values["monthly-income"] !== undefined) {
        document.getElementById("monthly-income").value =
          values["monthly-income"];
        window._monthlyIncomeValue = values["monthly-income"];
      }
    } else if (values["incomeType"] === "annual") {
      document.getElementById("income-monthly-radio").checked = false;
      document.getElementById("income-annual-radio").checked = true;
      updateIncomeInputs();
      if (values["annual-income"] !== undefined) {
        document.getElementById("annual-income").value =
          values["annual-income"];
        window._annualIncomeValue = values["annual-income"];
      }
    }
  }
}

function clearInputs() {
  const inputIds = [
    "property-value",
    "current-funds",
    "interest-rate",
    "duration-years",
    "monthly-income",
    "annual-income",
    "ltv-percentage",
    "dsr-percentage",
  ];
  inputIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  localStorage.removeItem("mortgageInputs");
  updateAllOutputs();
}

function updateAllOutputs() {
  calculateAmountNeededForMortgage();
  calculateMortgageDurationMonths();
  calculateMonthlyInterestRate();
  updateIncomeInputs();
  calculateLtvAmount();
  calculateDsrAmount();
  calculateActualMortgageCap();
  calculateMonthlyMortgagePayment();
  calculatePaymentToIncomeRatio();
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("save-inputs")
    .addEventListener("click", saveInputsToLocalStorage);
  document
    .getElementById("clear-inputs")
    .addEventListener("click", clearInputs);

  document
    .getElementById("income-monthly-radio")
    .addEventListener("change", function () {
      updateIncomeInputs();
      updateAllOutputs();
    });
  document
    .getElementById("income-annual-radio")
    .addEventListener("change", function () {
      updateIncomeInputs();
      updateAllOutputs();
    });

  [
    "property-value",
    "current-funds",
    "interest-rate",
    "duration-years",
    "ltv-percentage",
    "dsr-percentage",
  ].forEach(function (id) {
    document.getElementById(id).addEventListener("input", updateAllOutputs);
  });

  // Initial calculation on page load
  loadInputsFromLocalStorage();
  updateAllOutputs();
});
