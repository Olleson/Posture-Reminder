/*
save settings and preload the popup with them so that user doesn't have to re-input (time interval)
save the settings when toggle is triggered (if settings have changed)
*/

// document.addEventListener("DOMContentLoaded", function () {
//     console.log("loaded");
// });

const swt = document.getElementById("switch");
const inter = document.getElementById("interval");
const clock = document.getElementById("clock");

const c_hours = document.getElementById("custom_hours");
const c_minutes = document.getElementById("custom_minutes");
const customCont = document.getElementById("custom_cont")

let on = false; let intervalID;

let alert_audio = new Audio('../audio/545495__ienba__notification.wav');
let reminderText = ["ding ding ding!", "check your back", "you know what time it is"];

swt.addEventListener("click", function () {
    startStop();
});

inter.addEventListener("change", (e) => {
    displayCustom(e);
})

function startStop() {
    on = !on;
    if (on) {
        console.log("sending...");
        chrome.runtime.sendMessage("START_TIMER", function (response) {
            console.log("received: " + response);
        })
    } else {
        console.log("sending...");
        chrome.runtime.sendMessage("STOP_TIMER", function (response) {
            console.log("received: " + response);
        })
    }
}

// https://newbedev.com/how-to-start-and-stop-pause-setinterval
export function stopTimer() {
    clearInterval(intervalID);
    updateClockDisplay(0);
}

export function startTimer(duration) {
    console.log("starttimer()");
    let r = duration + 1;
    let lastSavedIndex = random(reminderText.length);

    intervalID = setInterval(function () {
        if (r-- <= 0) {
            lastSavedIndex = alarm(lastSavedIndex);  // Alarm that avoids last index
            r = duration;
        }
        updateClockDisplay(r);
    }, 1000);
}

// https://www.py4u.net/discuss/277183
// make more intuitive and not with windows alert
// Pause interval until user clicks off alert/reminder
// Overlay notification popup

// Recursively find new index that was not the last index
// Smarter solution is to cache the old index and then compare
export function alarm(index) {
    let randomIndex = random(reminderText.length);
    if (index != randomIndex) {
        console.log("Found new index!");
        alert_audio.play();
        alert(reminderText[randomIndex]);
        return randomIndex;
    } else {
        console.log("Same index - recursively finding new one...");
        return alarm(randomIndex);
    }
}

export function getDuration() {
    switch (inter.options[inter.selectedIndex].value) {
        case "A":               // Hour
            return (60 * 60);
        case "B":               // Half hour
            return (60 * 30);
        case "C":               // Fifteen minutes
            return (60 * 15);
        case "X":
            return 3;
        case "D":
            return customInput();
        default:
            return 5;
    }
}

// Do not allow for invalid (0) durations
// Undo toggle, trigger some animation if I can
export function customInput() {
    if (c_hours.value == 0 && c_minutes.value == 0) {
        alert("shut the fuck up");
        return 2;
    }
    sum = (c_hours.value * 60 * 60) + (c_minutes.value * 60);   // Get total seconds of input
    return sum;
}

function displayCustom(e) {
    let s = window.getComputedStyle(customCont);
    if (s.getPropertyValue("opacity") === "0" && e.target.value === "D") {
        customCont.style.transform = "translateY(15px)";
        customCont.style.opacity = "1";
        // console.log("fadeIn");
    } else if (s.getPropertyValue("opacity") === "1") {
        customCont.style.transform = "translateY(0px)";
        customCont.style.opacity = "0";
        // console.log("fadeOut");
    }
}

// https://jsfiddle.net/wr1ua0db/17/ https://stackoverflow.com/questions/20618355/how-to-write-a-countdown-timer-in-javascript
export function updateClockDisplay(duration) {
    let update;
    if (duration > 0) {
        let seconds = parseInt(duration % 60);
        let minutes = parseInt((duration / 60) % 60);
        let hours = parseInt((duration / 60) / 60);
        update = (hours + ":" + ((minutes < 10) ? ("0" + minutes) : minutes) + ":" + ((seconds < 10) ? ("0" + seconds) : seconds));
    } else {
        update = "0:00:00";
    }
    clock.textContent = update;
}


// Random number from 0 to max
export function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

        // bad old code lmao    - dont ever do this
        // let hours = parseInt(((duration / 60) / 60) < 1 ? "0" : ((duration / 60) / 60));
        // let minutes = parseInt((duration / 60) == 60 ? "00" : duration / 60);
        //update = (hours + ":" + minutes);