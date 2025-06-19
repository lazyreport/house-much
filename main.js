function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatInputValue(input) {
  // Remove all non-digit characters except decimal point
  let value = input.value.replace(/[^\d.]/g, "");

  // Ensure only one decimal point
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Format the whole number part with commas
  if (parts.length > 0) {
    const wholePart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    value = parts.length > 1 ? wholePart + "." + parts[1] : wholePart;
  }

  return value;
}

function parseFormattedNumber(formattedValue) {
  // Remove commas and convert to number
  return parseFloat(formattedValue.replace(/,/g, "")) || 0;
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
  if (!propertyValueInput.value || !currentFundsInput.value) {
    output.textContent = "";
    return;
  }
  const propertyValue = parseFormattedNumber(propertyValueInput.value);
  const currentFunds = parseFormattedNumber(currentFundsInput.value);
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
  const interestRate = parseFormattedNumber(interestRateInput.value);
  if (!isNaN(interestRate)) {
    const monthlyRate = interestRate / 100 / 12;
    monthlyInterestRateOutput.textContent = monthlyRate.toFixed(6);
  } else {
    monthlyInterestRateOutput.textContent = "";
  }
}

function calculateLtvAmount() {
  const propertyValueInput = document.getElementById("property-value");
  const ltvPercentageInput = document.getElementById("ltv-percentage");
  const output = document.getElementById("ltv-amount");
  if (!propertyValueInput.value || !ltvPercentageInput.value) {
    output.textContent = "";
    return;
  }
  const propertyValue = parseFormattedNumber(propertyValueInput.value);
  const ltvPercentage = parseFormattedNumber(ltvPercentageInput.value);
  if (!isNaN(propertyValue) && !isNaN(ltvPercentage)) {
    const ltvAmount = propertyValue * (ltvPercentage / 100);
    output.textContent = formatNumberWithCommas(ltvAmount.toFixed(0));
  } else {
    output.textContent = "";
  }
}

function calculateDsrAmount() {
  const interestRate = parseFormattedNumber(
    document.getElementById("interest-rate").value
  );
  const durationYears = parseInt(
    document.getElementById("duration-years").value,
    10
  );
  let annualIncome;
  const annualIncomeElem = document.getElementById("annual-income");
  if (annualIncomeElem.tagName === "INPUT") {
    annualIncome = parseFormattedNumber(annualIncomeElem.value);
  } else {
    annualIncome = parseFloat(annualIncomeElem.textContent.replace(/,/g, ""));
  }
  const dsrPercentage = parseFormattedNumber(
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
  const amountNeeded = parseFormattedNumber(
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
    monthlyIncome = parseFormattedNumber(
      document.getElementById("monthly-income").value
    );
  } else {
    const annualInput = document.getElementById("annual-income");
    monthlyIncome = annualInput.value
      ? parseFormattedNumber(annualInput.value) / 12
      : 0;
  }
  const output = document.getElementById("payment-to-income-ratio");

  // Remove old CSS classes
  output.classList.remove(
    "highlight-green",
    "highlight-yellow",
    "highlight-red"
  );

  // Remove Tailwind classes
  output.classList.remove(
    "bg-green-100",
    "border-green-300",
    "text-green-800",
    "bg-yellow-100",
    "border-yellow-300",
    "text-yellow-800",
    "bg-red-100",
    "border-red-300",
    "text-red-800"
  );

  if (!isNaN(monthlyPayment) && !isNaN(monthlyIncome) && monthlyIncome !== 0) {
    const ratio = (monthlyPayment / monthlyIncome) * 100;
    output.textContent = ratio.toFixed(2) + "%";

    // Apply Tailwind CSS classes based on ratio
    if (ratio < 20) {
      output.classList.add(
        "bg-green-100",
        "border-green-300",
        "text-green-800"
      );
    } else if (ratio < 35) {
      output.classList.add(
        "bg-yellow-100",
        "border-yellow-300",
        "text-yellow-800"
      );
    } else {
      output.classList.add("bg-red-100", "border-red-300", "text-red-800");
    }
  } else {
    output.textContent = "";
  }
}

function updateIncomeValues() {
  const monthlyRadio = document.getElementById("income-monthly-radio");
  const monthlyInput = document.getElementById("monthly-income");
  const annualInput = document.getElementById("annual-income");
  const monthlyOutput = document.getElementById("monthly-income");
  const annualOutput = document.getElementById("annual-income");

  if (monthlyRadio.checked) {
    // Monthly is input, annual is output
    if (monthlyInput && annualOutput) {
      annualOutput.textContent = monthlyInput.value
        ? formatNumberWithCommas(
            (parseFormattedNumber(monthlyInput.value) * 12).toFixed(0)
          )
        : "";
    }
  } else {
    // Annual is input, monthly is output
    if (annualInput && monthlyOutput) {
      monthlyOutput.textContent = annualInput.value
        ? formatNumberWithCommas(
            (parseFormattedNumber(annualInput.value) / 12).toFixed(0)
          )
        : "";
    }
  }
}

function updateIncomeInputs() {
  const monthlyRadio = document.getElementById("income-monthly-radio");
  const annualRadio = document.getElementById("income-annual-radio");
  const monthlyContainer = document.getElementById("monthly-income-container");
  const annualContainer = document.getElementById("annual-income-container");

  // Store current values and focus state
  const monthlyValue = document.getElementById("monthly-income")?.value || "";
  const annualValue = document.getElementById("annual-income")?.value || "";
  const activeElement = document.activeElement;
  const isMonthlyFocused = activeElement?.id === "monthly-income";
  const isAnnualFocused = activeElement?.id === "annual-income";

  if (monthlyRadio.checked) {
    // Monthly is input, annual is output
    monthlyContainer.innerHTML =
      '<input type="text" id="monthly-income" class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" aria-label="월 수익 (세후)" />';
    annualContainer.innerHTML =
      '<output id="annual-income" class="block w-full h-10 px-3 py-2 pr-10 bg-gray-100 border border-gray-300 rounded-md text-gray-900 font-medium"></output>';

    const monthlyInput = document.getElementById("monthly-income");
    const annualOutput = document.getElementById("annual-income");

    monthlyInput.value = monthlyValue;
    annualOutput.textContent = monthlyValue
      ? formatNumberWithCommas(
          (parseFormattedNumber(monthlyValue) * 12).toFixed(0)
        )
      : "";

    if (isMonthlyFocused) {
      monthlyInput.focus();
      const length = monthlyInput.value.length;
      monthlyInput.setSelectionRange(length, length);
    }

    monthlyInput.addEventListener("input", function () {
      this.value = formatInputValue(this);
      window._monthlyIncomeValue = this.value;
      updateIncomeValues();
      updateAllOutputs();
    });
  } else {
    // Annual is input, monthly is output
    monthlyContainer.innerHTML =
      '<output id="monthly-income" class="block w-full h-10 px-3 py-2 pr-10 bg-gray-100 border border-gray-300 rounded-md text-gray-900 font-medium"></output>';
    annualContainer.innerHTML =
      '<input type="text" id="annual-income" class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" aria-label="연 수익 (세후)" />';

    const monthlyOutput = document.getElementById("monthly-income");
    const annualInput = document.getElementById("annual-income");

    annualInput.value = annualValue;
    monthlyOutput.textContent = annualValue
      ? formatNumberWithCommas(
          (parseFormattedNumber(annualValue) / 12).toFixed(0)
        )
      : "";

    if (isAnnualFocused) {
      annualInput.focus();
      const length = annualInput.value.length;
      annualInput.setSelectionRange(length, length);
    }

    annualInput.addEventListener("input", function () {
      this.value = formatInputValue(this);
      window._annualIncomeValue = this.value;
      updateIncomeValues();
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
  updateIncomeValues();
  calculateLtvAmount();
  calculateDsrAmount();
  calculateActualMortgageCap();
  calculateMonthlyMortgagePayment();
  calculatePaymentToIncomeRatio();
}

function calculatePropertyValueFromRatio(desiredRatio) {
  const monthlyIncome = document.getElementById("income-monthly-radio").checked
    ? parseFormattedNumber(document.getElementById("monthly-income").value)
    : parseFormattedNumber(document.getElementById("annual-income").value) / 12;
  const interestRate =
    parseFormattedNumber(document.getElementById("interest-rate").value) /
    100 /
    12;
  const durationMonths = parseInt(
    document.getElementById("duration-months").textContent,
    10
  );
  const currentFunds =
    parseFormattedNumber(document.getElementById("current-funds").value) || 0;

  if (!isNaN(monthlyIncome) && !isNaN(interestRate) && !isNaN(durationMonths)) {
    const monthlyPayment = (monthlyIncome * desiredRatio) / 100;
    let propertyValue;

    if (interestRate === 0) {
      propertyValue = monthlyPayment * durationMonths + currentFunds;
    } else {
      const loanAmount =
        (monthlyPayment * (1 - Math.pow(1 + interestRate, -durationMonths))) /
        interestRate;
      propertyValue = loanAmount + currentFunds;
    }

    return Math.max(0, propertyValue);
  }
  return 0;
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
    const element = document.getElementById(id);
    element.addEventListener("input", function () {
      this.value = formatInputValue(this);
      updateAllOutputs();
    });
  });

  document
    .getElementById("ratio-slider")
    .addEventListener("input", function () {
      const desiredRatio = parseFloat(this.value);
      const propertyValue = calculatePropertyValueFromRatio(desiredRatio);
      const propertyValueInput = document.getElementById("property-value");
      propertyValueInput.value = formatNumberWithCommas(
        Math.round(propertyValue)
      );
      document.getElementById("payment-to-income-ratio").textContent =
        desiredRatio.toFixed(1) + "%";

      // Update slider value display
      document.getElementById("slider-value").textContent =
        desiredRatio.toFixed(1) + "%";

      // Update slider gradient fill
      const percentage = (desiredRatio / 50) * 100;
      const slider = this;
      slider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;

      updateAllOutputs();
    });

  // Initial calculation on page load
  loadInputsFromLocalStorage();

  // Initialize slider gradient and value display
  const slider = document.getElementById("ratio-slider");
  const initialValue = parseFloat(slider.value);
  const percentage = (initialValue / 50) * 100;
  slider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  document.getElementById("slider-value").textContent =
    initialValue.toFixed(1) + "%";

  // Initialize income inputs with proper formatting
  updateIncomeInputs();

  // LTV radio buttons logic
  const ltvRadios = document.getElementsByName("ltv-percentage-radio");
  const ltvHidden = document.getElementById("ltv-percentage");
  function setLtvFromRadio() {
    for (const radio of ltvRadios) {
      if (radio.checked) {
        ltvHidden.value = radio.value;
        break;
      }
    }
    updateAllOutputs();
  }
  for (const radio of ltvRadios) {
    radio.addEventListener("change", setLtvFromRadio);
  }
  // Set default (70%) if none selected
  let anyChecked = false;
  for (const radio of ltvRadios) {
    if (radio.checked) anyChecked = true;
  }
  if (!anyChecked) {
    ltvRadios[1].checked = true; // 70% default
    ltvHidden.value = ltvRadios[1].value;
  }

  // DSR radio buttons logic
  const dsrRadios = document.getElementsByName("dsr-percentage-radio");
  const dsrHidden = document.getElementById("dsr-percentage");
  function setDsrFromRadio() {
    for (const radio of dsrRadios) {
      if (radio.checked) {
        dsrHidden.value = radio.value;
        break;
      }
    }
    updateAllOutputs();
  }
  for (const radio of dsrRadios) {
    radio.addEventListener("change", setDsrFromRadio);
  }
  // Set default (40%) if none selected
  let dsrAnyChecked = false;
  for (const radio of dsrRadios) {
    if (radio.checked) dsrAnyChecked = true;
  }
  if (!dsrAnyChecked) {
    dsrRadios[0].checked = true; // 40% default
    dsrHidden.value = dsrRadios[0].value;
  }

  updateAllOutputs();
});
