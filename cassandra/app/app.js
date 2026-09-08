/* =========================================
   CASSANDRA - HORLOGE
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
    document.getElementById("clock").innerHTML =
        hours + ":" + minutes;
}

/* =========================================
   CASSANDRA - DATE
   ========================================= */

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
    var day = days[now.getDay()];
    var number = now.getDate();
    var month = months[now.getMonth()];

    document.getElementById("date").innerHTML =
        day + " " + number + " " + month;
}


/* =========================================
   CASSANDRA - YEUX
   ========================================= */

/*
    ORDRE DES IMAGES :

    eyes1 = yeux ouverts
    eyes2 = légèrement fermés
    eyes3 = ...
    eyes4 = ...
    eyes5 = presque fermés
    eyes6 = yeux fermés
*/

var eyeImages = [

    "app/images/eyes/eyes1.png",
    "app/images/eyes/eyes2.png",
    "app/images/eyes/eyes3.png",
    "app/images/eyes/eyes4.png",
    "app/images/eyes/eyes5.png",
    "app/images/eyes/eyes6.png"

];


/* =========================================
   CASSANDRA - BOUCHE
   ========================================= */

/*
    12 images de bouche.

    mouth1 = bouche neutre
    mouth2 à mouth12 = différentes
    formes utilisées pour la parole / expressions.
*/

var mouthImages = [

    "app/images/mouth/mouth1.png",
    "app/images/mouth/mouth2.png",
    "app/images/mouth/mouth3.png",
    "app/images/mouth/mouth4.png",
    "app/images/mouth/mouth5.png",
    "app/images/mouth/mouth6.png",
    "app/images/mouth/mouth7.png",
    "app/images/mouth/mouth8.png",
    "app/images/mouth/mouth9.png",
    "app/images/mouth/mouth10.png",
    "app/images/mouth/mouth11.png",
    "app/images/mouth/mouth12.png"

];


/* =========================================
   PATTERNS DE BOUCHE
   ========================================= */

/*
    Séquences utilisées pour simuler la parole.

    Elles seront affinées lorsque nous aurons
    testé les 12 images directement sur Cassandra.
*/

var mouthPatterns = [

    [1, 2, 3, 4, 3, 2, 1],

    [1, 3, 4, 5, 3, 2, 1],

    [1, 2, 5, 4, 3, 2, 1],

    [1, 3, 6, 4, 3, 2, 1],

    [1, 2, 3, 5, 4, 3, 2, 1]

];


/* =========================================
   VARIABLES
   ========================================= */

var mouth = document.getElementById("cassandraMouth");

var loadedEyeImages = [];
var loadedMouthImages = [];


/* =========================================
   PRÉCHARGEMENT DES YEUX
   ========================================= */

function loadEyeImages() {

    var i;
    var image;

    for (i = 0; i < eyeImages.length; i++) {

        image = new Image();

        image.src = eyeImages[i];

        loadedEyeImages.push(image);
    }
}


/* =========================================
   PRÉCHARGEMENT DE LA BOUCHE
   ========================================= */

function preloadMouthImages() {

    var i;
    var image;

    for (i = 0; i < mouthImages.length; i++) {

        image = new Image();

        image.src = mouthImages[i];

        loadedMouthImages.push(image);
    }
}


/* =========================================
   CHANGER LES YEUX
   ========================================= */

function setEyes(number) {

    var eyes = document.getElementById("cassandraEyes");

    if (number < 1 || number > loadedEyeImages.length) {
        return;
    }

    eyes.src = loadedEyeImages[number - 1].src;
}


/* =========================================
   CHANGER LA BOUCHE
   ========================================= */

function setMouth(number) {

    if (number < 1 || number > loadedMouthImages.length) {
        return;
    }

    mouth.src = loadedMouthImages[number - 1].src;
}


/* =========================================
   CASSANDRA - CLIGNEMENT
   ========================================= */

/*
    Séquence :

    1 → 2 → 3 → 4 → 5 → 6
    → 5 → 4 → 3 → 2 → 1

    30 ms entre chaque image.
*/

function blink() {

    var frame = 0;
    var total = eyeImages.length;
    var totalFrames = total * 2 - 1;

    function nextFrame() {

        var eyeNumber;

        if (frame < total) {

            eyeNumber = frame + 1;

        } else {

            eyeNumber =
                total - (frame - total) - 1;
        }

        setEyes(eyeNumber);

        frame++;

        if (frame < totalFrames) {

            setTimeout(nextFrame, 20);
        }
    }

    nextFrame();
}


/* =========================================
   CASSANDRA - PAROLE
   ========================================= */

/*
    Joue une séquence de bouche.

    Exemple :

    speakMouth(
        [1, 2, 3, 4, 3, 2, 1],
        70
    );
*/

function speakMouth(sequence, speed) {

    var frame = 0;

    function nextFrame() {

        if (frame >= sequence.length) {

            setMouth(1);

            return;
        }

        setMouth(sequence[frame]);

        frame++;

        setTimeout(nextFrame, speed);
    }

    nextFrame();
}


/* =========================================
   PAROLE ALÉATOIRE
   ========================================= */

/*
    Choisit un pattern de bouche au hasard.
*/

function speakRandomPattern() {

    var index =
        Math.floor(
            Math.random() * mouthPatterns.length
        );

    var pattern =
        mouthPatterns[index];

    speakMouth(pattern, 70);
}


/* =========================================
   PROGRAMMATION DES CLIGNEMENTS
   ========================================= */

function scheduleBlink() {

    /*
        Cassandra attend entre 6 et 12 secondes
        avant chaque clignement.
    */

    var delay =
        6000 + Math.random() * 6000;

    setTimeout(function() {

        blink();

        scheduleBlink();

    }, delay);
}

/* =========================================
   INITIALISATION
   ========================================= */
updateClock();

updateDate();

loadEyeImages();

preloadMouthImages();

setEyes(1);

setMouth(1);

scheduleBlink();


/* =========================================
   MISE À JOUR HORLOGE / DATE
   ========================================= */

setInterval(function() {

    updateClock();

}, 1000);


setInterval(function() {

    updateDate();

}, 60000);

/* =========================================
   CASSANDRA - HOME ASSISTANT
   ========================================= */

function updateHomeAssistant() {

    var request = new XMLHttpRequest();

    request.open(
        "GET",
        "/api/state",
        true
    );

    request.onreadystatechange = function() {

        if (
            request.readyState === 4 &&
            request.status === 200
        ) {

            try {

                var data =
                    JSON.parse(request.responseText);

                if (
                    document.getElementById("temperature")
                ) {

                    document.getElementById(
                        "temperature"
                    ).innerHTML = data.temperature;
                }

                if (
                    document.getElementById("weather")
                ) {

                    document.getElementById(
                        "weather"
                    ).innerHTML = data.weather;
                }

                if (
                    document.getElementById("house")
                ) {

                    document.getElementById(
                        "house"
                    ).innerHTML = data.house;
                }

                if (
                    document.getElementById("rer")
                ) {

                    document.getElementById(
                        "rer"
                    ).innerHTML = data.rer;
                }

            } catch (error) {

                console.log(
                    "Erreur données Cassandra : "
                    + error
                );
            }
        }
    };

    request.send();
}
updateHomeAssistant();

setInterval(function() {

    updateHomeAssistant();

}, 10000);