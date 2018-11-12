var latitude = "",
    longitude = "",
    waitting = true;
$(document).ready(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            waitting = false;
        });

    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function setCoordonnees() {
    $("#latitude").empty().append(latitude);
    $("#longitude").empty().append(longitude);
}