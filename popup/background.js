chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("sender = " + sender);
    console.log("request = " + request);
    console.log("sendResponse = " + sendResponse);
    if (request.greeting == "hello") {
        sendResponse({farewell: "goodbye"});
    }
    return true;
})