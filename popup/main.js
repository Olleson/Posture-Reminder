document.addEventListener("DOMContentLoaded", function () {
    console.log("loaded");
});

const swt = document.getElementById("switch");
const inter = document.getElementById("interval");
const clock = document.getElementById("clock");

let on = false; let intervalID; let alert_audio = new Audio('../audio/545495__ienba__notification.wav');

swt.addEventListener("click", function () {
    startStop();
});

function startStop() {
    on = !on;
    if (on) {
        startTimer(getDuration());
    } else {
        stopTimer();
    }
}

function getDuration() {
    let duration;
    duration = function () {
        switch(inter.options[inter.selectedIndex].value) {
            case "A": return 10
            case "B": return 30
            default: return 5
        }
    }();
    console.log("duration: " + duration);
    return duration;
}

// Add hours, minutes functionality
// Problem: Interval starts at 9 instead of 10 first time
// https://jsfiddle.net/wr1ua0db/17/ https://stackoverflow.com/questions/20618355/how-to-write-a-countdown-timer-in-javascript
function startTimer(duration) {
    let r = duration; 
    intervalID = setInterval(function () {
        if (r-- <= 0) {
            alarm();
            r = duration;
        }
        updateClockDisplay(r);
    }, 1000);
}

// Add hours, minutes, functionality
function stopTimer() {
    clearInterval(intervalID);
    updateClockDisplay("00:00");
}

function updateClockDisplay(update) {
    clock.textContent = update;
}

// https://www.py4u.net/discuss/277183
// https://newbedev.com/how-to-start-and-stop-pause-setinterval
// make more intuitive and not with windows alert
// Pause interval until user clicks off alert/reminder
function alarm() {
    alert_audio.play();
    alert("Ding Ding Ding");
}