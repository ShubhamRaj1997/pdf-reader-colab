import { io } from "socket.io-client";
import "setimmediate";

// const joinRoomButton = document.getElementById("room-button");
// const messageInput = document.getElementById("message-input");
// const roomInput = document.getElementById("room-input");
// const form = document.getElementById("form");

const socket = io("http://localhost:3000");
const userSocket = io("http://localhost:3000/user", { auth: {token: 'Test'}});


socket.on('get-page', (page)=>{
    console.log("received get-page");
    if(myState.currentPage != page){
        changePage(page);
    }
});

var myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1
}

console.log("reaching here");
pdfjsLib.getDocument('./docs/jumphash.pdf').then((pdf) => {
  
    console.log("HEY");
    myState.pdf = pdf;
    render();
  
});

function render() {
        myState.pdf.getPage(myState.currentPage).then((page) => {
        var canvas = document.getElementById("pdf_renderer");
        var ctx = canvas.getContext('2d');

        var viewport = page.getViewport(myState.zoom);

        canvas.width = viewport.width;
        canvas.height = viewport.height;
  
        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
    });
}

function changePage(desiredPage){
    myState.currentPage = desiredPage;
    document.getElementById("current_page").value = desiredPage;
    render();
}

document.getElementById('go_previous')
    .addEventListener('click', (e) => {
    console.log("clicked go prev");
    if(myState.pdf == null|| myState.currentPage == 1) 
    return;
    console.log("go-prev");
    myState.currentPage -= 1;
    document.getElementById("current_page").value = myState.currentPage;
    socket.emit('set-page', myState.currentPage, '');
    render();
});

document.getElementById('go_next')
    .addEventListener('click', (e) => {
    if(myState.pdf == null || myState.currentPage > myState.pdf._pdfInfo.numPages) 
    return;
          
    myState.currentPage += 1;
    document.getElementById("current_page").value = myState.currentPage;
    socket.emit('set-page', myState.currentPage, '');

    render();
});

document.getElementById('current_page')
    .addEventListener('keypress', (e) => {
    if(myState.pdf == null) return;
  
    // Get key code
    var code = (e.keyCode ? e.keyCode : e.which);
    
    // If key code matches that of the Enter key
    if(code == 13) {
        var desiredPage = document.getElementById('current_page').valueAsNumber;
        socket.emit('set-page', myState.currentPage, '');
        changePage(desiredPage);
    }
});

document.getElementById('zoom_in')
    .addEventListener('click', (e) => {
    if(myState.pdf == null) return;
    myState.zoom += 0.5;
 
    render();
});
document.getElementById('zoom_out')
    .addEventListener('click', (e) => {
    if(myState.pdf == null) return;
    myState.zoom -= 0.5;
     
    render();
});

var pr = document.getElementById('pdf_renderer');
pr.addEventListener('wheel', (event)=>{
    console.log('Scrolle', event);
    
});




// userSocket.on('connect_error', error=>{
//     displayMessage(error)
// })
// socket.emit('custom-event', 10, 'Hi', {a: 'a'});

// socket.on("connect", ()=>{
//     displayMessage(`You connected with id ${socket.id}`);
// });

// socket.on('receive-message', (message) => {
//     displayMessage(message);
// });

// form.addEventListener("submit", e => {
//     e.preventDefault();
//     const message = messageInput.value;
//     const room = roomInput.value;
//     console.log(messageInput);
//     if (message === "") return;

//     displayMessage(message);
//     socket.emit('send-message', message, room);
//     messageInput.value = "";
// });

// joinRoomButton.addEventListener("click", () => {
//     const room = roomInput.value;
//     socket.emit('join-room', room, message => {
//         displayMessage(message)
//     })
// })

// function displayMessage(message) {
//     const div = document.createElement("div");
//     div.textContent = message;
//     document.getElementById("message-container").append(div);
// }

// document.addEventListener('keydown', e=> {
//     if(e.target.matches('input')) return
//     if(e.key == 'c') socket.connect()
//     if(e.key == 'd') socket.disconnect()
// })
