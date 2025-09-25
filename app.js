let Clocks = document.querySelectorAll(".clock");
const timeDisplay = document.querySelector(".timeDisplay");
const setTime = document.getElementById("setTime");
const addTime = document.querySelector(".addTime");
const buttons = document.querySelectorAll(".btn");
const addClockbtn = document.querySelector(".addClock");
const clockContainer = document.querySelector(".clockContainer");
const startSound = new Audio("sounds/fswish.mp3");
const alertSound = new Audio("sounds/alert.mp3");
const image = document.querySelector(".imgs")
const timelabel = document.querySelector(".label")

let num = 0;
let time = Number(Clocks[num].dataset.score) * 60;
let selectedClock = null;
let isRunning = false;
let clockCount = Clocks.length;
let maxClock = 10;

const progressCircle = document.querySelector(".progressCircle");
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

// Countdown logic
Clocks[0].style.background = "orange";
function updateCountdown() {
    let min = Math.floor(time / 60);
    let secs = time % 60;

    secs = secs < 10 ? "0" + secs : secs;
    min = min < 10 ? "0" + min : min;

    timeDisplay.innerHTML = `${min}:${secs}`;
    const total = Number(Clocks[num].dataset.score) * 60;
    const percent = time / total;
    progressCircle.style.strokeDashoffset = circumference * (1 - percent);

    time--;

    if (time <= 0) {
        alertSound.play()
        Clocks[num].style.background = "white";
        num += 1;

        if (num >= Clocks.length) {
            clearInterval(interval);
            isRunning = false;
            buttons[0].innerHTML = "start"
            return;
        }

        Clocks[num].style.background = "orange";
        time = Number(Clocks[num].dataset.score) * 60
    }
if (Clocks[num].dataset.score <= 5) {
    image.src = "displays/picaglad.png"
    timelabel.innerHTML = "Break Time "
}else{
    image.src = "displays/picachu.png"
    timelabel.innerHTML = "Focus Time"
}
}

// Initial call
updateCountdown();

// Set up click listeners for each initial clock
Clocks.forEach((clock, index) => {
    setupClockClick(clock);
});

// Start / Pause button
buttons[0].addEventListener("click", function () {
    if (isRunning) {
        clearInterval(interval);
        buttons[0].innerHTML = "start";
        isRunning = false;
    } else {
       interval =  setInterval(updateCountdown, 1000);;
        buttons[0].innerHTML = "pause";
        isRunning =true;
        startSound.play().catch((err) => {
            console.log("Sound blocked:",err)
        })
    }


});

// Reset button
buttons[1].addEventListener("click", function () {
    
    clearInterval(interval);
    isRunning = false;
    buttons[0].innerHTML = "start"

    num = 0;
    time = Number(Clocks[num].dataset.score) * 60;
    Clocks.forEach(clock => clock.style.background = "");
    Clocks[0].style.background = "orange";
    buttons[0].innerHTML = "start";
    updateCountdown();
});

// Apply new time button
buttons[2].addEventListener("click", function () {
    if (selectedClock) {
        selectedClock.dataset.score = Number(setTime.value);
        if (selectedClock === Clocks[num]) {
            time = Number(setTime.value) * 60;
        }
    }
    addTime.classList.remove("show");
    selectedClock = null;
});

// Limit input to two digits
setTime.addEventListener("input", function () {
    if (this.value.length > 2) {
        this.value = this.value.slice(0, 2);
    }
});

// Add new clock
addClockbtn.addEventListener("click", function () {
    if (clockCount >= maxClock) {
        alert("Maximum clocks reached!");
        return;
    }
    if (num >= Clocks.length) {
            num -= 1
            return;
        }

    const newClock = document.createElement("div");
    newClock.className = "clock";
    newClock.dataset.score = 5;

    clockContainer.appendChild(newClock);
    setupClockClick(newClock);

    clockCount++;
    Clocks = document.querySelectorAll(".clock");
});

// Setup click and double-click behavior for a clock
function setupClockClick(clock) {
    clock.addEventListener("click", function () {
        addTime.classList.toggle("show");
        selectedClock = clock;
        setTime.value = clock.dataset.score;
    });

    clock.addEventListener("dblclick", function () {
        if (clock === Clocks[num]) {
            alert("Can't remove current clock");
            return;
        }
        clock.remove();
        addTime.classList.remove("show");
        clockCount--;
        Clocks = document.querySelectorAll(".clock");
        
    });

}

