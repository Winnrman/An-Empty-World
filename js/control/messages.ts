import * as dom from "../util/dom";

let nextMessageId = 0;
const maxMessages = 20;
const maxMessageTime = 10000;
const messageFadeoutTime = 1000;
const messages = [];

export function addMessage(message_text) {
    const messageId = nextMessageId++;
    messages.push({
        id: messageId,
        time: new Date()
    });
    while (messages.length > maxMessages) {
        const oldMessage = messages[0];
        dom.removeElement(`message-${oldMessage.id}`);
        messages.shift();
    }

    const message = dom.createElement("li");
    message.appendChild(dom.createText(message_text));
    message.setAttribute('id', `message-${messageId}`);
    dom.getElement("messages").prepend(message);
}

window.onerror = function(msg, url, lineNo, columnNo, error) {
    addMessage(error || `Error: ${msg}`)
}

export function startClearInterval() {
    setInterval(() => {
        const minTimeForFadeout = new Date(new Date().getTime() - maxMessageTime);
        for (let message of messages.filter(x => !x.isFading && x.time < minTimeForFadeout)) {
            dom.addClass(`message-${message.id}`, "fadeOut");
            message.isFading = true;
        }
    
        const minTimeForDelete = new Date(new Date().getTime() - maxMessageTime - messageFadeoutTime);
        for (let message of messages.filter(x => x.time < minTimeForDelete)) {
            dom.removeElement(`message-${message.id}`);
            messages.splice(messages.indexOf(message), 1);
        }
    }, 100);
}