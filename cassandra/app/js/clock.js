/* =========================================
   HORLOGE
   ========================================= */
/* =========================================
   HORLOGE
   ========================================= */

function updateClock() {
    var now = new Date();

    var hours = now.getHours();
    var minutes = now.getMinutes();

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    var clock = document.getElementById("clock");

    if (clock) {
        clock.textContent = hours + ":" + minutes;
    }
}

function updateDate() {
    var now = new Date();

    var days = [
        "DIMANCHE",
        "LUNDI",
        "MARDI",
        "MERCREDI",
        "JEUDI",
        "VENDREDI",
        "SAMEDI"
    ];

    var months = [
        "JANVIER",
        "FÉVRIER",
        "MARS",
        "AVRIL",
        "MAI",
        "JUIN",
        "JUILLET",
        "AOÛT",
        "SEPTEMBRE",
        "OCTOBRE",
        "NOVEMBRE",
        "DÉCEMBRE"
    ];

    var date =
        days[now.getDay()] + " " +
        now.getDate() + " " +
        months[now.getMonth()] + " " +
        now.getFullYear();

    var dateElement = document.getElementById("date");

    if (dateElement) {
        dateElement.textContent = date;
    }
}

function updateClockAndDate() {
    updateClock();
    updateDate();
}

updateClockAndDate();

setInterval(updateClockAndDate, 1000);
