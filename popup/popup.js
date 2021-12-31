/*
save settings and preload the popup with them so that user doesn't have to re-input (time interval)
save the settings when toggle is triggered (if settings have changed)
when clicking off the extension, the timer resets to 0:00:00
    -> either move the updateDisplay code to background, making it change
        in the background all the time
    -> or cache the last value and replace that in the html - keeps this consistent ?
when clicking off the extension, switch is toggled off upon return 
    -> revisit the css and the startStop(); script to detect states instead
        of clicks
*/

// Base elements
const sw = document.getElementById("switch");
const interval = document.getElementById("interval");
const clockDisplay = document.getElementById("clock");

// Custom Interval Input
const customHours = document.getElementById("custom_hours");
const customMinutes = document.getElementById("custom_minutes");
const customContainer = document.getElementById("custom_cont")

sw.addEventListener("click", function () {
    startStop();
});

interval.addEventListener("change", (e) => {
    displayCustom(e);
})

function startStop() {
    if (sw.checked) {
        console.log("sending...");
        chrome.runtime.sendMessage({
            req: "START_TIMER",
            duration: getDuration(),
            state: sw.checked,
            clockDisplay: clockDisplay.textContent
        }, function (response) {
            console.log("received: " + response);
        })
    } else {
        console.log("sending...");
        chrome.runtime.sendMessage({ req: "STOP_TIMER", state: sw.checked }, function (response) {
            console.log("received: " + response);
        })
    }
}

function getDuration() {
    switch (interval.options[interval.selectedIndex].value) {
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
function customInput() {
    if (customHours.value <= 0 || customMinutes.value <= 0 || customHours.value > 10 || customMinutes > 60) {
        alert("shut the fuck up");
        return "invalid";
    }
    return (customHours.value * 60 * 60) + (customMinutes.value * 60);   // Get total seconds of input
}

function displayCustom(e) {
    let s = window.getComputedStyle(customContainer);
    if (s.getPropertyValue("opacity") === "0" && e.target.value === "D") {
        customContainer.style.transform = "translateY(15px)";
        customContainer.style.opacity = "1";
        // console.log("fadeIn");
    } else if (s.getPropertyValue("opacity") === "1") {
        customContainer.style.transform = "translateY(0px)";
        customContainer.style.opacity = "0";
        // console.log("fadeOut");
    }
}

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     try {
//         // console.log("received message from: " + sender.id);
//         // console.log("getting: " + request.req);

//         if (request.req === "UPDATE_DISPLAY") {
//             updateClockDisplay(request.seconds);
//             return sendResponse("updating display");
//         }

//         return sendResponse("did not match any cases");
//     } catch (err) {
//         console.log(err + " from " + self);
//         return sendResponse("failed");
//     }
// })

// https://jsfiddle.net/wr1ua0db/17/ https://stackoverflow.com/questions/20618355/how-to-write-a-countdown-timer-in-javascript
// function updateClockDisplay(duration) {
//     let update;
//     if (duration > 0) {
//         let seconds = parseInt(duration % 60);
//         let minutes = parseInt((duration / 60) % 60);
//         let hours = parseInt((duration / 60) / 60);
//         update = (hours + ":" + ((minutes < 10) ? ("0" + minutes) : minutes) + ":" + ((seconds < 10) ? ("0" + seconds) : seconds));
//     } else {
//         update = "0:00:00";
//     }
//     clock.textContent = update;
// }

// // Random number from 0 to max
// function random(max) {
//     return Math.floor(Math.random() * Math.floor(max));
// }

        // bad old code lmao    - dont ever do this
        // let hours = parseInt(((duration / 60) / 60) < 1 ? "0" : ((duration / 60) / 60));
        // let minutes = parseInt((duration / 60) == 60 ? "00" : duration / 60);
        //update = (hours + ":" + minutes);