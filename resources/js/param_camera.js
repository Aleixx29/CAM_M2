/************** PARAMETRAGE CAMERA ******************/
function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
    // Good to go!
} else {
    alert('getUserMedia() is not supported in your browser');
}

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

/***************/

var video = document.getElementById("myVideo");
var image = document.getElementById("myImage");
var canvas = document.getElementById("myCanvas");
var videoCanvas = document.getElementById("myVideoCanvas");

/******* Listeners pour les boutons ******/

document.getElementById("picSave").addEventListener("click", function () {
    document.getElementById("downloadImage").href = videoCanvas.toDataURL('image/webp');
});

document.getElementById("picShoot").addEventListener("click", function () {

    if (myStream) {
        // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
        image.src = videoCanvas.toDataURL('image/webp');
        // Active le bouton save
        document.getElementById("downloadImage").onclick = "return true;";
    }

    image.style.display = "block";
    canvas.style.display = "none";

    var date = new Date();
    $("#dateTime").empty().append(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " : " +
        date.getHours() + "h" + date.getMinutes());
    if (waitting) {
        alert("La localisation n'a pas eu le temps de charger");
    }
    setCoordonnees();

});

document.getElementById("picReset").addEventListener("click", function () {
    // affiche le canvas
    canvas.style.display = "block";
    image.style.display = "none";

    $("#dateTime").empty();
    $("#latitude").empty();
    $("#longitude").empty();
});

canvas.width = 640;
canvas.height = 480;
videoCanvas.width = 640;
videoCanvas.height = 480;

var ctxVideoCanvas = videoCanvas.getContext('2d');
var ctx = canvas.getContext('2d');

var myStream = null;

var xStart = 0;
var yStart = 0;

var xStop = 480;
var yStop = 480;

var x = xStart;
var y = yStart;

function canvasPlayer() {
    if (myStream) {
        ctx.drawImage(video, 0, 0);
        ctxVideoCanvas.drawImage(video, 0, 0);
        var currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = currentImage.data;
        ctx.putImageData(currentImage, 0, 0);

        // draw the cross
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = '#4C8';
        ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
    }
}
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        // Constraints
        audio: true,
        video: true
    }).then(
        // Promise Success
        function (localMediaStream) {
            video.srcObject = localMediaStream;
            myStream = localMediaStream;
            // call canvasPlayer every 20ms
            window.setInterval(canvasPlayer, 20);
        }).catch(
        // Promise Catch
        function (err) {
            console.log('The following error occurred when trying to use getUserMedia: ' + err);
        }
    );
}