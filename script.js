document.addEventListener('DOMContentLoaded', function() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const years = Array.from({length: 101}, (_, i) => 1950 + i);
    const ageYears = Array.from({length: 100}, (_, i) => i);
    const ageMonths = Array.from({length: 12}, (_, i) => i);
    const ageDays = Array.from({length: 31}, (_, i) => i);

    function populateWheel(wheelId, items) {
        const wheel = document.getElementById(wheelId);
        wheel.innerHTML = '';
        // Add padding items at the start
        for (let i = 0; i < 2; i++) {
            const div = document.createElement('div');
            div.classList.add('wheel-item', 'padding-item');
            wheel.appendChild(div);
        }
        items.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('wheel-item');
            div.textContent = item;
            wheel.appendChild(div);
        });
        // Add padding items at the end
        for (let i = 0; i < 2; i++) {
            const div = document.createElement('div');
            div.classList.add('wheel-item', 'padding-item');
            wheel.appendChild(div);
        }
    }

    function setupWheel(wheelId, updateFunction = updateResult) {
        const wheel = document.getElementById(wheelId);
        let isScrolling;
    
        wheel.addEventListener('scroll', () => {
            updateWheelSelection(wheel);
    
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                snapToClosest(wheel);
                updateFunction();
            }, 66); // Delay to trigger snapping after scrolling stops
        });
    
        // Initialize the wheel with the correct selection
        snapToClosest(wheel);
    }
    
    function updateWheelSelection(wheel) {
        const items = wheel.getElementsByClassName('wheel-item');
        const wheelRect = wheel.getBoundingClientRect();
        const middleY = wheelRect.top + wheelRect.height / 2;
    
        let closestItem = null;
        let closestDistance = Infinity;
    
        Array.from(items).forEach(item => {
            if (item.classList.contains('padding-item')) return;
            const itemRect = item.getBoundingClientRect();
            const itemMiddleY = itemRect.top + itemRect.height / 2;
            const distance = Math.abs(middleY - itemMiddleY);
    
            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = item;
            }
            item.classList.remove('selected');
        });
    
        if (closestItem) {
            closestItem.classList.add('selected');
        }
    }
    
    function snapToClosest(wheel) {
        const selected = wheel.querySelector('.wheel-item.selected');
        if (selected) {
            selected.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    

    function updateTargetDate() {
        const now = new Date();
        document.getElementById('targetDate').value = now.toISOString().split('T')[0];
    }

    function getSelectedDate() {
        const selectedMonth = document.querySelector('#monthWheel .selected')?.textContent || 'January';
        const selectedDay = document.querySelector('#dayWheel .selected')?.textContent || '1';
        const selectedYear = document.querySelector('#yearWheel .selected')?.textContent || '2000';
        return new Date(selectedYear, months.indexOf(selectedMonth), selectedDay);
    }

    // function updateResult() {
    //     const birthDate = getSelectedDate();
    //     const targetDateInput = document.getElementById('targetDate').value
    //     const targetDate = new Date(`${targetDateInput}T00:00:00`);
    //     console.log('birthDate: ', birthDate)
    //     console.log('targetDate: ', targetDate)

    //     const prematurity = parseInt(document.getElementById('prematuritySlider').value);

    //     birthDate.setDate(birthDate.getDate() - prematurity);

    //     const diffTime = targetDate - birthDate;
    //     console.log('diffTime: ', diffTime)
    //     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    //     console.log('diffDays: ', diffDays)

    //     const years = Math.floor(diffDays / 365.25);
    //     const months = Math.floor((diffDays % 365.25) / 30.44);
    //     const days = Math.floor(diffDays % 30.44);

    //     document.querySelector('.age-finder .result').textContent = `${years} years ${months} months ${days} days`;
    // }

    function updateResult() {
        const birthDate = getSelectedDate(); // Assuming this returns a valid Date object
        const targetDateInput = document.getElementById('targetDate').value;
        const targetDate = new Date(`${targetDateInput}T00:00:00`);
        console.log(birthDate)
        
        const prematurity = parseInt(document.getElementById('prematuritySlider').value);
        
        // Adjust birthDate by prematurity days
        birthDate.setDate(birthDate.getDate() - prematurity);
        
        // Calculate the difference in years, months, and days
        let years = targetDate.getFullYear() - birthDate.getFullYear();
        let months = targetDate.getMonth() - birthDate.getMonth();
        let days = targetDate.getDate() - birthDate.getDate();
        
        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Adjust for negative days
        if (days < 0) {
            months--;
            const previousMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
            days += previousMonth.getDate();
        }
        
        document.querySelector('.age-finder .result').textContent = `${years} years ${months} months ${days} days`;
    }
    

    function updateBirthdateResult() {
        const ageYears = parseInt(document.querySelector('#ageYearWheel .selected')?.textContent || '0');
        const ageMonths = parseInt(document.querySelector('#ageMonthWheel .selected')?.textContent || '0');
        const ageDays = parseInt(document.querySelector('#ageDayWheel .selected')?.textContent || '0');

        const today = new Date();
        let birthdate = new Date(today.getFullYear() - ageYears, today.getMonth() - ageMonths, today.getDate() - ageDays);

        if (birthdate > today) {
            birthdate.setFullYear(birthdate.getFullYear() - 1);
        }

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('birthdateResult').textContent = `Birthdate: ${birthdate.toLocaleDateString(undefined, options)}`;
    }

    function hoverInfoEffect(){
        const infoIcon = document.getElementById('infoIcon');
        const infoTooltip = document.getElementById('infoTooltip');

        // infoTooltip.style.display = 'none';
    
        infoIcon.addEventListener('pointerenter', () => {
            infoTooltip.style.display = 'block';
        });
            
        infoIcon.addEventListener('pointerleave', () => {
            infoTooltip.style.display = 'none';
        });
    }

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

    // Scroll to January 1, 2000
    function scrollToDefaultDate() {
        const yearWheel = document.getElementById('yearWheel');
        const monthWheel = document.getElementById('monthWheel');
        const dayWheel = document.getElementById('dayWheel');
        const ageYearWheel = document.getElementById('ageYearWheel');
        const ageMonthWheel = document.getElementById('ageMonthWheel');
        const ageDayWheel = document.getElementById('ageDayWheel');

        // Scroll to January (index 0)
        monthWheel.scrollTo({
            top: 75, // January is at the top (index 0)
            behavior: 'smooth'
        });

        // Scroll to day 1 (index 0)
        dayWheel.scrollTo({
            top: 75, // Day 1 is at the top (index 0)
            behavior: 'smooth'
        });

        // Scroll to year 2000 (2000 is index 50 because it starts at 1950)
        yearWheel.scrollTo({
            top: 75 * 33.5,  // Assuming each item has a height of 40px
            behavior: 'smooth'
        });

        // Scroll to January (index 0)
        ageYearWheel.scrollTo({
            top: 75, // January is at the top (index 0)
            behavior: 'smooth'
        });

        // Scroll to day 1 (index 0)
        ageMonthWheel.scrollTo({
            top: 75, // Day 1 is at the top (index 0)
            behavior: 'smooth'
        });

        // Scroll to year 2000 (2000 is index 50 because it starts at 1950)
        ageDayWheel.scrollTo({
            top: 75,  // Assuming each item has a height of 40px
            behavior: 'smooth'
        });
    }

    scrollToDefaultDate();


    
    updateTargetDate();
    updateResult();
    updateBirthdateResult();

    document.getElementById('targetDate').addEventListener('change', () => {
        updateResult();
        updateBirthdateResult();
    });

    const prematuritySlider = document.getElementById('prematuritySlider');
    const prematurityDays = document.getElementById('prematurityDays');

    prematuritySlider.addEventListener('input', () => {
        prematurityDays.textContent = prematuritySlider.value;
        updateResult();
    });

    document.querySelectorAll('.wheel').forEach(wheel => {
        wheel.addEventListener('wheel', (e) => {
            e.preventDefault();
            wheel.scrollTop += e.deltaY;
            updateWheelSelection(wheel);
            if (wheel.id.includes('age')) {
                updateBirthdateResult();
            } else {
                updateResult();
            }
        });
    });

    document.addEventListener('DOMContentLoaded', hoverInfoEffect());
});
