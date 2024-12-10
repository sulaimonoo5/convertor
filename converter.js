const apiKey = 'your-api-key'; // Замените на ваш API ключ
const apiUrl = `https://api.exchangerate-api.com/v4/latest/USD`; // Пример для использования API Exchangerate-API

let currentSelect = '';

// Функция для загрузки валют
async function loadCurrencies() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.rates) {
            const currencies = Object.keys(data.rates); // Все доступные валюты
            populateCurrencySelector(currencies);
        } else {
            alert("Error: Unable to load currencies.");
        }
    } catch (error) {
        alert("Error fetching data. Please try again later.");
        console.error(error);
    }
}

// Функция для заполнения выпадающих списков валют
function populateCurrencySelector(currencies) {
    const fromCurrencySelect = document.querySelector('#fromCurrency');
    const toCurrencySelect = document.querySelector('#toCurrency');

    currencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        fromCurrencySelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        toCurrencySelect.appendChild(optionTo);
    });
}

// Функция для конвертации валют
async function convertCurrency() {
    const amount = document.querySelector('#amount').value;
    const fromCurrency = document.querySelector('#fromCurrency').value;
    const toCurrency = document.querySelector('#toCurrency').value;

    const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.rates) {
            const rate = data.rates[toCurrency];
            const convertedAmount = amount * rate;
            document.querySelector('#result').textContent = `${convertedAmount.toFixed(2)} ${toCurrency}`;
        } else {
            alert("Error: Unable to retrieve exchange rates.");
        }
    } catch (error) {
        alert("Error fetching data. Please try again later.");
        console.error(error);
    }
}


function openModal(selectId) {
    currentSelect = selectId;
    document.querySelector('#currencyModal').style.display = 'block';
    populateCurrencyList();
}


function closeModal() {
    document.querySelector('#currencyModal').style.display = 'none';
}


function searchCurrency() {
    const searchTerm = document.querySelector('#currencySearch').value.toLowerCase();
    const currencyList = document.querySelector('#currencyList');
    const options = document.querySelectorAll('#fromCurrency option, #toCurrency option');

    currencyList.innerHTML = '';

    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchTerm)) {
            const li = document.createElement('li');
            li.textContent = option.textContent;
            li.onclick = () => selectCurrency(option.value);
            currencyList.appendChild(li);
        }
    });
}


function selectCurrency(currency) {
    document.getElementById(currentSelect).value = currency;
    closeModal();
}


document.querySelector('#amount').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

document.querySelector('#currencySearch').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const firstItem = document.querySelector('#currencyList li');
        if (firstItem) {
            firstItem.click(); 
        }
    }
});


window.onload = loadCurrencies;
