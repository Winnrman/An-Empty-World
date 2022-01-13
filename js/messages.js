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
        var message = messages[0];
        document.getElementById(`message-${message.id}`).remove();
        messages.shift();
    }

    var message = document.createElement("li");
    message.appendChild(document.createTextNode(message_text));
    message.setAttribute('id', `message-${messageId}`);
    document.getElementById("messages").appendChild(message);
}

setInterval(() => {
    const minTimeForFadeout = new Date(new Date().getTime() - maxMessageTime);
    for (let message of messages.filter(x => !x.isFading && x.time < minTimeForFadeout)) {
        document.getElementById(`message-${message.id}`).classList.add("fadeOut");
        message.isFading = true;
    }

    const minTimeForDelete = new Date(new Date().getTime() - maxMessageTime - messageFadeoutTime);
    for (let message of messages.filter(x => x.time < minTimeForDelete)) {
        document.getElementById(`message-${message.id}`).remove();
        messages.splice(messages.indexOf(message), 1);
    }
}, 100)