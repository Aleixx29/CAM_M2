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

var streaming = false;
width = document.getElementById("player").offsetWidth;


video = document.getElementById('video');
canvas = document.getElementById('canvas');
photo = document.getElementById('photo');
startbutton = document.getElementById('picShoot');
ctx = canvas.getContext('2d');

/******* Listeners pour les boutons ******/
document.getElementById("filterGray").addEventListener("click", function (ev) {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imageData.data;
    var nbPixels = pixels.length;

    for (var i = 0; i < nbPixels; i++) {
        // moyenne RGB pour obtenir le ton de gris
        var average = (pixels[i * 4] + pixels[i * 4 + 1] + pixels[i * 4 + 2]) / 3;

        pixels[i * 4] = average;
        pixels[i * 4 + 1] = average;
        pixels[i * 4 + 2] = average;

        // On n'y touche pas car on ne veut pas appliquer de transparence
        // pixels[i*4+3] = pour l'alpha
    }

    ctx.putImageData(imageData, 0, 0);
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
});
document.getElementById("downloadImage").addEventListener("click", function () {
    document.getElementById("downloadImage").href = photo.src;
});

document.getElementById("picReset").addEventListener("click", function () {
    // affiche le canvas
    video.play();
    canvas.style.display = "block";
    photo.style.display = "none";

    $("#dateTime").empty();
    $("#latitude").empty();
    $("#longitude").empty();
});

navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function (stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function (err) {
        console.log("An error occurred! " + err);
    });

video.addEventListener('canplay', function (ev) {
    if (!streaming) {
        initvideo();

        streaming = true;
    }
}, false);

video.addEventListener('play', function () {
    var $this = this; //cache
    (function loop() {
        if (!$this.paused && !$this.ended) {
            // draw video
            // fill horizontally
            var hRatio = (canvas.width / video.videoWidth) * video.videoHeight;
            ctx.drawImage($this, 0, 0, canvas.width, hRatio);
            // draw the cross
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = '#4C8';
            var circleRadius = 0.07*canvas.height;
            var circleOffset = 0.05*canvas.height;
            ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, Math.PI * 2, false);

            ctx.moveTo(canvas.width / 2, canvas.height / 2 - (circleRadius+circleOffset));
            ctx.lineTo(canvas.width / 2, canvas.height / 2 - circleRadius);
            ctx.moveTo(canvas.width / 2, canvas.height / 2 + (circleRadius+circleOffset));
            ctx.lineTo(canvas.width / 2, canvas.height / 2 + circleRadius);

            ctx.moveTo(canvas.width / 2 - (circleRadius+circleOffset), canvas.height / 2);
            ctx.lineTo(canvas.width / 2 - circleRadius, canvas.height / 2);
            ctx.moveTo(canvas.width / 2 + (circleRadius+circleOffset), canvas.height / 2);
            ctx.lineTo(canvas.width / 2 + circleRadius, canvas.height / 2);

            ctx.stroke();
            ctx.closePath();
            setTimeout(loop, 1000 / 30); // drawing at 30fps
        }
    })();
}, 0);

video.addEventListener('loadedmetadata', function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});

startbutton.addEventListener('click', function (ev) {
    takepicture();
    ev.preventDefault();
}, false);
clearphoto();

window.addEventListener('orientationchange', changescreen_handler);
window.addEventListener('resize', changescreen_handler);

function changescreen_handler() {
    video.pause();
    initvideo();
    video.play();
}

function initvideo() {
    width = document.getElementById("player").offsetWidth;
    height = video.videoHeight / (video.videoWidth / width);

    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    photo.style.width = width + 'px';
    photo.style.height = height + 'px';
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        photo.style.display = "block";
        canvas.style.display = "none";
        video.pause();
        document.getElementById("downloadImage").onclick = "return true;";
        var date = new Date();
        $("#dateTime").empty().append(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " : " +
            date.getHours() + "h" + date.getMinutes());
        if (waitting) {
            alert("La localisation n'a pas eu le temps de charger");
        }
        setCoordonnees();
    } else {
        clearphoto();
    }
}