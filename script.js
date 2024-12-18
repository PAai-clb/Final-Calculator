document.addEventListener('DOMContentLoaded', function() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const years = Array.from({length: 100}, (_, i) => 1950 + i);
    const ageYears = Array.from({length: 100}, (_, i) => i);
    const ageMonths = Array.from({length: 12}, (_, i) => i);
    const ageDays = Array.from({length: 31}, (_, i) => i);

    function populateWheel(wheelId, items) {
        const wheel = document.getElementById(wheelId);
        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item;
            div.style.padding = '10px';
            wheel.appendChild(div);
        });
    }

    function setupWheel(wheelId, callback) {
        const wheel = document.getElementById(wheelId);
        wheel.addEventListener('scroll', () => {
            if (callback) callback();
        });
    }

    function updateBirthdateResult() {
        const result = document.getElementById('result');
        // Get selected values and calculate result
        // This is a placeholder - implement your calculation logic here
        result.textContent = 'Calculated Result';
    }

    // Initialize wheels when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        populateWheel('monthWheel', months);
        populateWheel('dayWheel', days);
        populateWheel('yearWheel', years);
        populateWheel('ageYearWheel', ageYears);
        populateWheel('ageMonthWheel', ageMonths);
        populateWheel('ageDayWheel', ageDays);
        
        setupWheel('monthWheel');
        setupWheel('dayWheel');
        setupWheel('yearWheel');
        setupWheel('ageYearWheel', updateBirthdateResult);
        setupWheel('ageMonthWheel', updateBirthdateResult);
        setupWheel('ageDayWheel', updateBirthdateResult);

        scrollToDefaultDate();
    });
});
