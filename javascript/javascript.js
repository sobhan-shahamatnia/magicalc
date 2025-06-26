const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const historyToggle = document.getElementById('history-toggle');
const mobileHistoryOverlay = document.getElementById('mobile-history-overlay');
const mobileHistoryList = document.getElementById('mobile-history-list');
const closeHistory = document.getElementById('close-history');
const mobileClearHistory = document.getElementById('mobile-clear-history');

let currentInput = '';
let calculationHistory = [];
let calculationCompleted = false;

if (localStorage.getItem('calculatorHistory')) {
    calculationHistory = JSON.parse(localStorage.getItem('calculatorHistory'));
    updateHistoryDisplay();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === 'C') {
            currentInput = '';
            display.value = '';
            calculationCompleted = false;
        } else if (value === '⌫') {
            currentInput = currentInput.slice(0, -1);
            display.value = currentInput;
            calculationCompleted = false;
        } else if (value === '=') {
            try {
                const result = eval(currentInput);
                const calculation = `${currentInput} = ${result}`;
                const now = new Date();
                const datetime = now.toLocaleString();
                const historyEntry = {
                    calculation: calculation,
                    datetime: datetime
                };
                
                calculationHistory.unshift(historyEntry);
                if (calculationHistory.length > 10) {
                    calculationHistory.pop();
                }
                localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
                updateHistoryDisplay();
                
                currentInput = result.toString();
                display.value = currentInput;
                calculationCompleted = true;
            } catch {
                display.value = 'Error';
                currentInput = '';
                calculationCompleted = false;
            }
        } else if (value === '.') {
            if (calculationCompleted) {
                currentInput = '0.';
                calculationCompleted = false;
            } else {
                const parts = currentInput.split(/[-+*/]/);
                const lastPart = parts[parts.length - 1];
                if (!lastPart.includes('.')) {
                    currentInput += value;
                }
            }
            display.value = currentInput;
        } else if (value === '%') {
            const parts = currentInput.split(/([-+*/])/);
            for (let i = parts.length - 1; i >= 0; i--) {
                if (!isNaN(parts[i]) && parts[i] !== '') {
                    parts[i] = (parseFloat(parts[i]) / 100).toString();
                    break;
                }
            }
            currentInput = parts.join('');
            display.value = currentInput;
            calculationCompleted = false;
        } else {
            if (calculationCompleted && !isNaN(value)) {
                currentInput = value;
                calculationCompleted = false;
            } else {
                currentInput += value;
            }
            display.value = currentInput;
        }
    });
});

clearHistoryBtn.addEventListener('click', () => {
    calculationHistory = [];
    localStorage.removeItem('calculatorHistory');
    updateHistoryDisplay();
});

historyToggle.addEventListener('click', () => {
    mobileHistoryOverlay.style.display = 'flex';
});

closeHistory.addEventListener('click', () => {
    mobileHistoryOverlay.style.display = 'none';
});

mobileClearHistory.addEventListener('click', () => {
    calculationHistory = [];
    localStorage.removeItem('calculatorHistory');
    updateHistoryDisplay();
    mobileHistoryOverlay.style.display = 'none';
});

mobileHistoryOverlay.addEventListener('click', (e) => {
    if (e.target === mobileHistoryOverlay) {
        mobileHistoryOverlay.style.display = 'none';
    }
});

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    mobileHistoryList.innerHTML = '';
    
    calculationHistory.forEach((entry, index) => {
        const historyItem = document.createElement('div');
        historyItem.innerHTML = `<div class="calculation">${entry.calculation}</div><div class="datetime">${entry.datetime}</div>`;
        historyItem.style.cursor = 'pointer';
        historyItem.addEventListener('click', () => {
            const result = entry.calculation.split(' = ')[1];
            currentInput = result;
            display.value = currentInput;
        });
        historyList.appendChild(historyItem);
        
        const mobileHistoryItem = document.createElement('div');
        mobileHistoryItem.innerHTML = `<div class="calculation">${entry.calculation}</div><div class="datetime">${entry.datetime}</div>`;
        mobileHistoryItem.addEventListener('click', () => {
            const result = entry.calculation.split(' = ')[1];
            currentInput = result;
            display.value = currentInput;
            mobileHistoryOverlay.style.display = 'none';
        });
        mobileHistoryList.appendChild(mobileHistoryItem);
    });
} 