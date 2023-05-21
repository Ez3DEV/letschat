// initializing socket, connection to server
var socket = io.connect("http://192.168.1.51:7777");
socket.on("connect", function(data) {
    socket.emit("join", "Hello server from client");
});

var clientColor = generateRandomColor();

// listener for 'thread' event, which updates messages
socket.on("thread", function(data) {
    let shouldScroll = true;
    if (thread.scrollTop < thread.scrollHeight) {
        shouldScroll = false;
    }
    $("#thread").append(`
    <div class="p-10 px-20 w-full m-0 card h-5 border-top-0 border-left-0 border-right-0 border-bottom rounded-0">
        <p class="d-inline" style="color: ` + data[1] + `">anon:&nbsp</p><p class="d-inline m-0">` + data[0] + `</p>
    </div>
    `);
    if (shouldScroll) {
        let thread = $("#thread")[0];
        $("#thread")[0].scrollTop = $("#thread")[0].scrollHeight;
    }
});

socket.on("loadmessages", function(data) {
    $("#thread").append(data);
})

// sends message to server, resets & prevents default form action
$("form").submit(function() {
    var message = $("#message").val();
    if (message == "") return false;
    if (message.length > 144) {
        generateToast("Cannot go past 144!", "144 characters is the limit.", "danger", "filled", true, 4000);
        return false;
    }
    let data = [message, clientColor];
    socket.emit("messages", data);
    this.reset();
    $("#message").focus();
    return false;
});

function generateRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
}

function randString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function generateToast(title, content = "", type = "primary", fillType = "", dismissButton = false, duration = 3000) {
    let settings = {
        content: content,
        title: title,
        alertType: "alert-" + type,
        fillType: fillType,
        hasDismissButton: dismissButton,
        timeShown: duration
    };
    halfmoon.initStickyAlert();
}