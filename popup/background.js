// https://stackoverflow.com/questions/59914490/how-to-handle-unchecked-runtime-lasterror-the-message-port-closed-before-a-res?rq=1
// https://developer.chrome.com/docs/extensions/mv2/messaging/
// https://www.google.com/search?q=runtime+chrome+extension&oq=runtime+chrome&aqs=edge.0.0i19j69i57j0i19i22i30l3j0i10i19i22i30j0i19i22i30l3.2527j0j1&sourceid=chrome&ie=UTF-8
// https://stackoverflow.com/questions/16322830/chrome-extension-from-the-dom-to-popup-js-message-passing

// window.addEventListener("load", (e) => {
//     console.log("loaded")
//     clock_display = document.getElementById("clock");
// })

// let clock_display;
let intervalID;
let alertAudio = new Audio('../audio/545495__ienba__notification.wav');
let reminderText = ["ding ding ding!", "check your back", "you know what time it is"];
let clockContent;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        console.log("received message from: " + sender.id);
        console.log("getting: " + request.req);

        switch (request.req) {
            case "START_TIMER":
                clockContent = request.clockDisplay;
                console.log(clockContent);
                startTimer(request.duration)
                return sendResponse("started timer");
            case "STOP_TIMER":
                stopTimer();
                return sendResponse("stopping timer");
            default:
                return sendResponse("did not match any cases");
        }
    } catch (err) {
        console.log(err);
        return sendResponse("failed");
    }
})

function startTimer(duration) {
    let r = duration + 1;
    let lastSavedIndex = random(reminderText.length);

    intervalID = setInterval(function () {
        if (r-- <= 0) {
            lastSavedIndex = alarm(lastSavedIndex);  // Alarm that avoids last index
            r = duration;
        }
        // if (chrome.extension.getViews({type: "popup"}).length != 0) {       // https://stackoverflow.com/questions/8920953/how-determine-if-the-popup-page-is-open-or-not
        //     chrome.runtime.sendMessage({req: "UPDATE_DISPLAY", seconds: r}), function(response) {
        //         console.log("received: " + response);
        //     };
        updateClockDisplay(r);
        console.log(r);
    }, 1000);
}

// https://newbedev.com/how-to-start-and-stop-pause-setinterval
function stopTimer() {
    clearInterval(intervalID);
    // chrome.runtime.sendMessage({ req: "UPDATE_DISPLAY", seconds: 0 }), function (response) {
    //     console.log("received: " + response);
    // };
    updateClockDisplay(0);
}

// https://www.py4u.net/discuss/277183
// make more intuitive and not with windows alert
// Pause interval until user clicks off alert/reminder
// Overlay notification popup

// Recursively find new index that was not the last index
// Smarter solution is to cache the old index and then compare
function alarm(index) {
    let randomIndex = random(reminderText.length);
    if (index != randomIndex) {
        // console.log("Found new index!");
        alertAudio.play();
        alert(reminderText[randomIndex]);
        return randomIndex;
    } else {
        // console.log("Same index - recursively finding new one...");
        return alarm(randomIndex);
    }
}

// Random number from 0 to max
function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// https://jsfiddle.net/wr1ua0db/17/ https://stackoverflow.com/questions/20618355/how-to-write-a-countdown-timer-in-javascript
function updateClockDisplay(duration) {
    let update;
    if (duration > 0) {
        let seconds = parseInt(duration % 60);
        let minutes = parseInt((duration / 60) % 60);
        let hours = parseInt((duration / 60) / 60);
        update = (hours + ":" + ((minutes < 10) ? ("0" + minutes) : minutes) + ":" + ((seconds < 10) ? ("0" + seconds) : seconds));
    } else {
        update = "0:00:00";
    }
    clockContent = update;
}