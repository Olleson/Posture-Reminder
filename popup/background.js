//https://stackoverflow.com/questions/59914490/how-to-handle-unchecked-runtime-lasterror-the-message-port-closed-before-a-res?rq=1
//https://developer.chrome.com/docs/extensions/mv2/messaging/
// https://www.google.com/search?q=runtime+chrome+extension&oq=runtime+chrome&aqs=edge.0.0i19j69i57j0i19i22i30l3j0i10i19i22i30j0i19i22i30l3.2527j0j1&sourceid=chrome&ie=UTF-8

// Ideal world: take stuff from popup in parameters to here

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        console.log("received message from: " + sender.id);
        switch (request) {
            case "START_TIMER":
                sendResponse("started");
                //PopUp.startTimer(getDuration());
                return;
            case "STOP_TIMER":
                sendResponse("stopping timer");
                //PopUp.stopTimer();
                return;
            default:
                return sendResponse("did not receive reasonable request, try again");
        }
    } catch (err) {
        console.log(err);
        return sendResponse("failed");
    }
})