let totalMessages = 0, messagesLimit = 0, removeSelector, addition, channelName,
    provider, version, fontSize, usernameRatio, scale;
let animationIn = 'bounceIn';
let animationOut = 'bounceOut';
let hideAfter = 60;
let hideCommands = "no";
let ignoredUsers = [];

const fontSettings = {
    "finalFantasy1": {
        url: "https://wgrout87.github.io/Custom-Chat/assets/fonts/ff1_font.png",
        characterWidth: 8,
        characterHeight: 8,
    },
    "finalFantasy2": {
        url: "https://wgrout87.github.io/Custom-Chat/assets/fonts/ff2_font.png",
        characterWidth: 8,
        characterHeight: 8,
    },
    "finalFantasy4": {
        url: "https://wgrout87.github.io/Custom-Chat/assets/fonts/ff4_font.png",
        characterWidth: 8,
        characterHeight: 8,
    },
    "finalFantasy6": {
        url: "https://wgrout87.github.io/Custom-Chat/assets/fonts/ff6_font.png",
        characterWidth: 12,
        characterHeight: 12,
    },
    "finalFantasy7": {
        url: "https://wgrout87.github.io/Custom-Chat/assets/fonts/ff7_font.png",
        characterHeight: 12,
        characterWidth: 12,
    },
    "finalFantasy9": {
        url: "https://wgrout87.github.io/Custom-Chat/assets/fonts/ff9_font.png",
        characterHeight: 8,
        characterWidth: 12,
    }
}

function getFontCoordinatesObj(characterWidth, characterHeight) {
    const fontArr = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u007F".split('');
    const charactersObj = {};
    let row = 0;
    let col = 0;
    fontArr.forEach(character => {
        charactersObj[character] = [row * characterWidth, col * characterHeight];
        if (col === 7) {
            row++;
            col = 0;
        } else {
            col++
        }
    })
    return charactersObj;
};

function convertFont(text, desiredSize, username = false) {
    const fontUrl = fontSettings[version].url;
    const textCharacters = text.split('');
    const characterWidth = fontSettings[version].characterWidth
    const characterHeight = fontSettings[version].characterHeight;
    const charactersObj = getFontCoordinatesObj(characterWidth, characterHeight);
    let result = textCharacters.map(character => {
        const characterInfo = charactersObj[character];
        return characterInfo ? `<div style="display: inline-block; width: ${characterHeight}px; height: ${characterWidth}px; background: url(${fontUrl}) -${characterInfo[1]}px -${characterInfo[0]}px; image-rendering: crisp-edges; transform: scale(${desiredSize}); margin: ${(desiredSize - 1) * 4}px"></div>` : `<div style="display: inline-block; width: ${characterHeight}px; height: ${characterWidth}px; background: url(${fontUrl}) -${charactersObj["*"][1]}px -${charactersObj["*"][0]}px; image-rendering: crisp-edges;; transform: scale(${desiredSize}); margin: ${(desiredSize - 1) * 4}px"></div>`;
    })
    result = result.reduce((a, c) => a + c, '');
    result = text !== " " ? `<div class=${username ? "username" : "message-text"} style="display: inline-block; height: ${(characterHeight + 10) * scale}">${result}</div>` : result;
    return result;
}

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.event.listener === 'widget-button') {

        if (obj.detail.event.field === 'testMessage') {
            let emulated = new CustomEvent("onEventReceived", {
                detail: {
                    listener: "message", event: {
                        service: "twitch",
                        data: {
                            time: Date.now(),
                            tags: {
                                "badge-info": "",
                                badges: "moderator/1,partner/1",
                                color: "#5B99FF",
                                "display-name": "StreamElements",
                                emotes: "25:46-50",
                                flags: "",
                                id: "43285909-412c-4eee-b80d-89f72ba53142",
                                mod: "1",
                                "room-id": "85827806",
                                subscriber: "0",
                                "tmi-sent-ts": "1579444549265",
                                turbo: "0",
                                "user-id": "100135110",
                                "user-type": "mod"
                            },
                            nick: channelName,
                            userId: "100135110",
                            displayName: channelName,
                            displayColor: "#5B99FF",
                            badges: [{
                                type: "moderator",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                                description: "Moderator"
                            }, {
                                type: "partner",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                                description: "Verified"
                            }],
                            channel: channelName,
                            text: "Howdy! My name is Bill and I am here to serve Kappa Kappa",
                            isAction: !1,
                            emotes: [{
                                type: "twitch",
                                name: "Kappa",
                                id: "25",
                                gif: !1,
                                urls: {
                                    1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                    2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                    4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0"
                                },
                                start: 46,
                                end: 50
                            }],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: 'Howdy! My name is Bill and I am here to serve <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
                    }
                }
            });
            window.dispatchEvent(emulated);
        }
        return;
    }
    if (obj.detail.listener === "delete-message") {
        const msgId = obj.detail.event.msgId;
        $(`.message-row[data-msgid=${msgId}]`).remove();
        return;
    } else if (obj.detail.listener === "delete-messages") {
        const sender = obj.detail.event.userId;
        $(`.message-row[data-sender=${sender}]`).remove();
        return;
    }

    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    if (data.text.startsWith("!") && hideCommands === "yes") return;
    if (ignoredUsers.indexOf(data.nick) !== -1) return;
    let message = attachEmotes(data);
    let badges = "", badge;
    if (provider === 'mixer') {
        data.badges.push({ url: data.avatar });
    }
    for (let i = 0; i < data.badges.length; i++) {
        badge = data.badges[i];
        badges += `<img alt="" src="${badge.url}" class="badge ${badge.type}-icon"> `;
    }
    let username = data.displayName + ":";
    addMessage(username, badges, message, data.isAction, data.userId, data.msgId);
});

window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    animationIn = fieldData.animationIn;
    animationOut = fieldData.animationOut;
    hideAfter = fieldData.hideAfter;
    messagesLimit = fieldData.messagesLimit;
    hideCommands = fieldData.hideCommands;
    channelName = obj.detail.channel.username;
    version = fieldData.version;
    fontSize = fieldData.fontSize;
    usernameRatio = fieldData.usernameRatio;
    scale = fontSize / fontSettings[version].characterHeight;
    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/').then(response => response.json()).then((profile) => {
        provider = profile.provider;
    });
    if (fieldData.alignMessages === "block") {
        addition = "prepend";
        removeSelector = ".message-row:nth-child(n+" + (messagesLimit + 1) + ")"
    } else {
        addition = "append";
        removeSelector = ".message-row:nth-last-child(n+" + (messagesLimit + 1) + ")"
    }

    ignoredUsers = fieldData.ignoredUsers.toLowerCase().replace(" ", "").split(",");
});


function attachEmotes(message) {
    let text = html_encode(message.text);
    let data = message.emotes;
    if (typeof message.attachment !== "undefined") {
        if (typeof message.attachment.media !== "undefined") {
            if (typeof message.attachment.media.image !== "undefined") {
                text = `${message.text}<img src="${message.attachment.media.image.src}">`;
            }
        }
    }
    return text
        .replace(
            /([^\s]*)/gi,
            function (m, key, offset, string) {
                let result = data.filter(emote => {
                    return html_encode(emote.name) === key
                });
                if (typeof result[0] !== "undefined") {
                    let url = result[0]['urls'][1];
                    if (provider === "twitch") {
                        return string.trim().split(' ').length === 1 ? `<img class="emote loneEmote" " src="${url}"/>` : `<img class="emote" " src="${url}"/>`;
                    } else {
                        if (typeof result[0].coords === "undefined") {
                            result[0].coords = { x: 0, y: 0 };
                        }
                        let x = parseInt(result[0].coords.x);
                        let y = parseInt(result[0].coords.y);

                        let width = "{{emoteSize}}px";
                        let height = "auto";

                        if (provider === "mixer") {
                            console.log(result[0]);
                            if (result[0].coords.width) {
                                width = `${result[0].coords.width}px`;
                            }
                            if (result[0].coords.height) {
                                height = `${result[0].coords.height}px`;
                            }
                        }
                        return `<div class="emote" style="width: ${width}; height:${height}; display: inline-block; background-image: url(${url}); background-position: -${x}px -${y}px;"></div>`;
                    }
                } else return convertFont(m, scale);

            }
        );
}

function html_encode(e) {
    return e.replace(/[<>"^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}

function addMessage(username, badges, message, isAction, uid, msgId) {
    totalMessages += 1;
    let actionClass = "";
    if (isAction) {
        actionClass = "action";
    }

    const borderVersion = version + "-border";
    console.log(`
    <div data-sender="${uid}" data-msgid="${msgId}" class="message-row {animationIn} animated" id="msg-${totalMessages}">
        <div class="border ${borderVersion}">        
            <p class="user-box ${actionClass}">${badges}${convertFont(username, (scale * usernameRatio), true)}</p>
            <p class="user-message centered ${actionClass}">${message}</p>
        </div>
    </div>`);
    const element = $.parseHTML(`
    <div data-sender="${uid}" data-msgid="${msgId}" class="message-row {animationIn} animated" id="msg-${totalMessages}">
        <div class="border ${borderVersion}">        
            <p class="user-box ${actionClass}">${badges}${convertFont(username, (scale * usernameRatio), true)}</p>
            <p class="user-message ${actionClass}">${message}</p>
        </div>
    </div>`);
    if (addition === "append") {
        if (hideAfter !== 999) {
            $(element).appendTo('.main-container').delay(hideAfter * 1000).queue(function () {
                $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                    $(this).remove()
                }).dequeue();
            });
        } else {
            $(element).appendTo('.main-container');
        }
    } else {
        if (hideAfter !== 999) {
            $(element).prependTo('.main-container').delay(hideAfter * 1000).queue(function () {
                $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                    $(this).remove()
                }).dequeue();
            });
        } else {
            $(element).prependTo('.main-container');
        }
    }

    if (totalMessages > messagesLimit) {
        removeRow();
    }
}

function removeRow() {
    if (!$(removeSelector).length) {
        return;
    }
    if (animationOut !== "none" || !$(removeSelector).hasClass(animationOut)) {
        if (hideAfter !== 999) {
            $(removeSelector).dequeue();
        } else {
            $(removeSelector).addClass(animationOut).delay(1000).queue(function () {
                $(this).remove().dequeue()
            });

        }
        return;
    }

    $(removeSelector).animate({
        height: 0,
        opacity: 0
    }, 'slow', function () {
        $(removeSelector).remove();
    });
}