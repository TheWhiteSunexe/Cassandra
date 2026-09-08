/* =========================================
   CASSANDRA 2.2.0
   MOTEUR D'ANIMATION
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

    document.getElementById("clock").innerHTML =
        hours + ":" + minutes;
}


/* =========================================
   DATE
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
   YEUX
   ========================================= */

/*
    Yeux utilisés par Cassandra.

    NORMAL
    ├── Eyes1 → yeux ouverts
    ├── Eyes2
    ├── Eyes3
    ├── Eyes4
    ├── Eyes5
    └── Eyes6 → yeux fermés

    EXPRESSIONS
    ├── EyesBottom
    ├── EyesTop
    ├── EyesClin
    ├── EyesHappy
    ├── EyesLeft
    ├── EyesRight
    ├── EyesSad
    ├── EyesSurprise
    └── EyesTired
*/

var eyeImages = {

    normal: [
        "images/eyes/Eyes1.png",
        "images/eyes/Eyes2.png",
        "images/eyes/Eyes3.png",
        "images/eyes/Eyes4.png",
        "images/eyes/Eyes5.png",
        "images/eyes/Eyes6.png"
    ],

    bottom:
        "images/eyes/EyesBottom.png",

    top:
        "images/eyes/EyesTop.png",

    clin:
        "images/eyes/EyesClin.png",

    happy:
        "images/eyes/EyesHappy.png",

    left:
        "images/eyes/EyesLeft.png",

    right:
        "images/eyes/EyesRight.png",

    sad:
        "images/eyes/EyesSad.png",

    surprise:
        "images/eyes/EyesSurprise.png",

    tired:
        "images/eyes/EyesTired.png"
};


/* =========================================
   BOUCHE
   ========================================= */

var mouthImages = [

    "images/mouth/Mouth1.png",
    "images/mouth/Mouth2.png",
    "images/mouth/Mouth3.png",
    "images/mouth/Mouth4.png",
    "images/mouth/Mouth5.png",
    "images/mouth/Mouth6.png",
    "images/mouth/Mouth7.png",
    "images/mouth/Mouth8.png",
    "images/mouth/Mouth9.png",
    "images/mouth/Mouth10.png",
    "images/mouth/Mouth11.png",
    "images/mouth/Mouth12.png"

];


/* =========================================
   PATTERNS DE BOUCHE
   ========================================= */

var mouthPatterns = [

    [1, 2, 3, 4, 3, 2, 1],

    [1, 3, 4, 5, 3, 2, 1],

    [1, 2, 5, 4, 3, 2, 1],

    [1, 3, 6, 4, 3, 2, 1],

    [1, 2, 3, 5, 4, 3, 2, 1]

];


/* =========================================
   ÉLÉMENTS DOM
   ========================================= */

var eyes =
    document.getElementById("cassandraEyes");

var mouth =
    document.getElementById("cassandraMouth");


/* =========================================
   PRÉCHARGEMENT
   ========================================= */

/*
    Toutes les images sont chargées une seule fois.

    Cela évite que Safari tente de charger une
    nouvelle image au moment précis où Cassandra
    doit bouger.

    Important pour le vieil iMac.
*/

var loadedEyes = {};
var loadedMouth = [];


function preloadImage(src) {

    var image = new Image();

    image.src = src;

    return image;
}


/* =========================================
   PRÉCHARGEMENT DES YEUX
   ========================================= */

function loadEyeImages() {

    var i;

    /*
        Images normales
    */

    loadedEyes.normal = [];

    for (
        i = 0;
        i < eyeImages.normal.length;
        i++
    ) {

        loadedEyes.normal.push(
            preloadImage(
                eyeImages.normal[i]
            )
        );
    }


    /*
        Expressions
    */

    loadedEyes.bottom =
        preloadImage(
            eyeImages.bottom
        );

    loadedEyes.top =
        preloadImage(
            eyeImages.top
        );

    loadedEyes.clin =
        preloadImage(
            eyeImages.clin
        );

    loadedEyes.happy =
        preloadImage(
            eyeImages.happy
        );

    loadedEyes.left =
        preloadImage(
            eyeImages.left
        );

    loadedEyes.right =
        preloadImage(
            eyeImages.right
        );

    loadedEyes.sad =
        preloadImage(
            eyeImages.sad
        );

    loadedEyes.surprise =
        preloadImage(
            eyeImages.surprise
        );

    loadedEyes.tired =
        preloadImage(
            eyeImages.tired
        );
}


/* =========================================
   PRÉCHARGEMENT BOUCHE
   ========================================= */

function loadMouthImages() {

    var i;

    for (
        i = 0;
        i < mouthImages.length;
        i++
    ) {

        loadedMouth.push(
            preloadImage(
                mouthImages[i]
            )
        );
    }
}


/* =========================================
   YEUX NORMAUX
   ========================================= */

function setNormalEyes(number) {

    if (
        number < 1 ||
        number > loadedEyes.normal.length
    ) {
        return;
    }

    eyes.src =
        loadedEyes.normal[number - 1].src;
}


/* =========================================
   EXPRESSION DES YEUX
   ========================================= */

function setEyeExpression(expression) {

    if (!loadedEyes[expression]) {
        return;
    }

    eyes.src =
        loadedEyes[expression].src;
}


/* =========================================
   BOUCHE
   ========================================= */

function setMouth(number) {

    if (
        number < 1 ||
        number > loadedMouth.length
    ) {
        return;
    }

    mouth.src =
        loadedMouth[number - 1].src;
}


/* =========================================
   CLIGNEMENT
   ========================================= */

/*
    1 → 2 → 3 → 4 → 5 → 6
              ↓
    5 → 4 → 3 → 2 → 1

    20 ms par frame.

    Aucun moteur permanent :
    uniquement des timers pendant
    le mouvement.
*/

var blinking = false;


function blink() {

    /*
        Évite deux clignements simultanés.
    */

    if (blinking) {
        return;
    }

    blinking = true;

    var frame = 0;

    var total =
        loadedEyes.normal.length;

    var totalFrames =
        total * 2 - 1;


    function nextFrame() {

        var eyeNumber;

        if (frame < total) {

            eyeNumber =
                frame + 1;

        } else {

            eyeNumber =
                total -
                (frame - total) -
                1;
        }

        setNormalEyes(eyeNumber);

        frame++;

        if (frame < totalFrames) {

            setTimeout(
                nextFrame,
                20
            );

        } else {

            setNormalEyes(1);

            blinking = false;
        }
    }

    nextFrame();
}


/* =========================================
   CLIGNEMENTS AUTOMATIQUES
   ========================================= */

function scheduleBlink() {

    var delay =
        6000 +
        Math.random() * 6000;

    setTimeout(function() {

        blink();

        scheduleBlink();

    }, delay);
}


/* =========================================
   REGARD
   ========================================= */

/*
    Cassandra regarde dans une direction
    pendant une durée donnée puis revient
    au regard normal.
*/

var looking = false;


function look(direction, duration) {

    if (looking || blinking) {
        return;
    }

    looking = true;

    setEyeExpression(direction);

    setTimeout(function() {

        setNormalEyes(1);

        looking = false;

    }, duration);
}


/* =========================================
   REGARDS ALÉATOIRES
   ========================================= */

function scheduleLook() {

    var delay =
        8000 +
        Math.random() * 12000;

    setTimeout(function() {

        /*
            Choix du regard
        */

        var directions = [
            "left",
            "right",
            "top",
            "bottom"
        ];

        var direction =
            directions[
                Math.floor(
                    Math.random() *
                    directions.length
                )
            ];


        /*
            Durée aléatoire
            entre 1.2 et 3.5 secondes
        */

        var duration =
            1200 +
            Math.random() * 2300;


        look(
            direction,
            duration
        );


        scheduleLook();

    }, delay);
}


/* =========================================
   PAROLE
   ========================================= */

var speaking = false;


function speakMouth(sequence, speed) {

    if (speaking) {
        return;
    }

    speaking = true;

    var frame = 0;


    function nextFrame() {

        if (frame >= sequence.length) {

            setMouth(1);

            speaking = false;

            return;
        }

        setMouth(
            sequence[frame]
        );

        frame++;


        setTimeout(
            nextFrame,
            speed
        );
    }


    nextFrame();
}


/* =========================================
   PAROLE ALÉATOIRE
   ========================================= */

function speakRandomPattern() {

    if (speaking) {
        return;
    }

    var index =
        Math.floor(
            Math.random() *
            mouthPatterns.length
        );

    speakMouth(
        mouthPatterns[index],
        70
    );
}


/* =========================================
   SOURIRE
   ========================================= */

var expressing = false;


function smile(duration) {

    if (
        expressing ||
        blinking ||
        looking
    ) {
        return;
    }

    expressing = true;

    setEyeExpression("happy");

    setMouth(5);


    setTimeout(function() {

        setNormalEyes(1);

        setMouth(1);

        expressing = false;

    }, duration);
}


/* =========================================
   EXPRESSION ALÉATOIRE
   ========================================= */

function scheduleExpression() {

    var delay =
        15000 +
        Math.random() * 20000;


    setTimeout(function() {

        /*
            Pour l'instant on utilise
            uniquement le sourire.

            D'autres expressions seront
            ajoutées plus tard.
        */

        var duration =
            1500 +
            Math.random() * 2500;


        smile(duration);


        scheduleExpression();

    }, delay);
}


/* =========================================
   HOME ASSISTANT
   ========================================= */

function updateHomeAssistant() {

    var request =
        new XMLHttpRequest();


    request.open(
        "GET",
        "/api/state",
        true
    );


    request.onreadystatechange =
        function() {

            if (
                request.readyState === 4 &&
                request.status === 200
            ) {

                try {

                    var data =
                        JSON.parse(
                            request.responseText
                        );


                    /*
                        TEMPÉRATURE
                    */

                    var temperature =
                        document.getElementById(
                            "temperature"
                        );

                    if (temperature) {

                        temperature.innerHTML =
                            data.temperature ||
                            "----";
                    }


                    /*
                        MÉTÉO
                    */

                    var weather =
                        document.getElementById(
                            "weather"
                        );

                    if (weather) {

                        weather.innerHTML =
                            data.weather ||
                            "----";
                    }


                    /*
                        MAISON
                    */

                    var house =
                        document.getElementById(
                            "houseStatus"
                        );

                    if (house) {

                        house.innerHTML =
                            data.house ||
                            "----";
                    }


                    /*
                        RER
                    */

                    var rer =
                        document.getElementById(
                            "rer"
                        );

                    if (rer) {

                        rer.innerHTML =
                            data.rer ||
                            "----";
                    }

                } catch (error) {

                    console.log(
                        "Erreur données Cassandra : " +
                        error
                    );
                }
            }
        };


    request.send();
}


/* =========================================
   INITIALISATION
   ========================================= */

function initCassandra() {

    /*
        Interface
    */

    updateClock();
    updateDate();


    /*
        Images
    */

    loadEyeImages();
    loadMouthImages();


    /*
        État initial
    */

    setNormalEyes(1);
    setMouth(1);


    /*
        Animations
    */

    scheduleBlink();

    scheduleLook();

    scheduleExpression();


    /*
        Home Assistant
    */

    updateHomeAssistant();

}


/* =========================================
   HORLOGE
   ========================================= */

setInterval(
    updateClock,
    1000
);


/* =========================================
   DATE
   ========================================= */

setInterval(
    updateDate,
    60000
);


/* =========================================
   HOME ASSISTANT
   ========================================= */

setInterval(
    updateHomeAssistant,
    10000
);


/* =========================================
   LANCEMENT
   ========================================= */

initCassandra();