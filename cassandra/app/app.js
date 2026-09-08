/* =========================================
   CASSANDRA 2.2.1
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
   BOUCHES
   ========================================= */

/*
    Mouth1 → Mouth12
        Utilisées pour la parole.

    EXPRESSIONS

    smile1 → sourire naturel
    smile2 → sourire marqué
    smile3 → sourire faux
    smile4 → sourire malveillant

    laugh → rire
    kiss → baiser
    o → bouche en O / surprise

    disgust → dégoût
    grimace → grimace
*/

var mouthImages = {

    normal: [
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
    ],

    disgust:
        "images/mouth/MouthDisgust.png",

    grimace:
        "images/mouth/MouthGrimace.png",

    kiss:
        "images/mouth/MouthKiss.png",

    laugh:
        "images/mouth/MouthLaugh.png",

    o:
        "images/mouth/MouthO.png",

    smile1:
        "images/mouth/MouthSmile1.png",

    smile2:
        "images/mouth/MouthSmile2.png",

    smile3:
        "images/mouth/MouthSmile3.png",

    smile4:
        "images/mouth/MouthSmile4.png"
};


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
   CORPS
   ========================================= */

/*
    Pour le moment, Cassandra possède une
    seule image de corps.

    On va simuler une respiration très légère
    uniquement en déplaçant cette couche.

    L'image elle-même n'est jamais modifiée.
*/

var bodyImage =
    "images/body/cassandraBody.png";


/* =========================================
   ÉLÉMENTS DOM
   ========================================= */

var eyes =
    document.getElementById("cassandraEyes");

var mouth =
    document.getElementById("cassandraMouth");

var body =
    document.getElementById("cassandraBody");


/* =========================================
   PRÉCHARGEMENT
   ========================================= */

var loadedEyes = {};
var loadedMouth = {};
var loadedBody = null;


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

    loadedMouth.normal = [];

    for (
        i = 0;
        i < mouthImages.normal.length;
        i++
    ) {

        loadedMouth.normal.push(
            preloadImage(
                mouthImages.normal[i]
            )
        );
    }


    /*
        Expressions
    */

    loadedMouth.disgust =
        preloadImage(
            mouthImages.disgust
        );

    loadedMouth.grimace =
        preloadImage(
            mouthImages.grimace
        );

    loadedMouth.kiss =
        preloadImage(
            mouthImages.kiss
        );

    loadedMouth.laugh =
        preloadImage(
            mouthImages.laugh
        );

    loadedMouth.o =
        preloadImage(
            mouthImages.o
        );

    loadedMouth.smile1 =
        preloadImage(
            mouthImages.smile1
        );

    loadedMouth.smile2 =
        preloadImage(
            mouthImages.smile2
        );

    loadedMouth.smile3 =
        preloadImage(
            mouthImages.smile3
        );

    loadedMouth.smile4 =
        preloadImage(
            mouthImages.smile4
        );
}


/* =========================================
   PRÉCHARGEMENT CORPS
   ========================================= */

function loadBodyImage() {

    loadedBody =
        preloadImage(
            bodyImage
        );
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
   BOUCHE NORMALE
   ========================================= */

function setMouth(number) {

    if (
        number < 1 ||
        number > loadedMouth.normal.length
    ) {
        return;
    }

    mouth.src =
        loadedMouth.normal[number - 1].src;
}


/* =========================================
   EXPRESSION DE BOUCHE
   ========================================= */

function setMouthExpression(expression) {

    if (!loadedMouth[expression]) {
        return;
    }

    mouth.src =
        loadedMouth[expression].src;
}


/* =========================================
   CLIGNEMENT
   ========================================= */

/*
    1 → 2 → 3 → 4 → 5 → 6
              ↓
    5 → 4 → 3 → 2 → 1

    20 ms par frame.
*/

var blinking = false;


function blink() {

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
        looking ||
        speaking
    ) {
        return;
    }

    expressing = true;

    setEyeExpression("happy");

    setMouthExpression("smile1");


    setTimeout(function() {

        setNormalEyes(1);

        setMouth(1);

        expressing = false;

    }, duration);
}


/* =========================================
   EXPRESSION DE CASSANDRA
   ========================================= */

function scheduleExpression() {

    var delay =
        15000 +
        Math.random() * 20000;


    setTimeout(function() {

        var duration =
            1500 +
            Math.random() * 2500;


        smile(duration);


        scheduleExpression();

    }, delay);
}

/* =========================================
   SURPRISE
   ========================================= */

function surprise(duration) {

    if (
        expressing ||
        blinking ||
        looking ||
        speaking
    ) {
        return;
    }

    expressing = true;

    setEyeExpression("surprise");
    setMouthExpression("o");


    setTimeout(function() {

        setNormalEyes(1);
        setMouth(1);

        expressing = false;

    }, duration);
}


/* =========================================
   FATIGUE
   ========================================= */

function fatigue(duration) {

    if (
        expressing ||
        blinking ||
        looking ||
        speaking
    ) {
        return;
    }

    expressing = true;

    setEyeExpression("tired");
    setMouth(1);


    setTimeout(function() {

        setNormalEyes(1);
        setMouth(1);

        expressing = false;

    }, duration);
}


/* =========================================
   DÉGOÛT
   ========================================= */

function disgust(duration) {

    if (
        expressing ||
        blinking ||
        looking ||
        speaking
    ) {
        return;
    }

    expressing = true;

    setEyeExpression("sad");
    setMouthExpression("disgust");


    setTimeout(function() {

        setNormalEyes(1);
        setMouth(1);

        expressing = false;

    }, duration);
}


/* =========================================
   SOURIRE MENAÇANT
   ========================================= */

function maliciousSmile(duration) {

    if (
        expressing ||
        blinking ||
        looking ||
        speaking
    ) {
        return;
    }

    expressing = true;

    setEyeExpression("clin");
    setMouthExpression("smile4");


    setTimeout(function() {

        setNormalEyes(1);
        setMouth(1);

        expressing = false;

    }, duration);
}

/* =========================================
   RESPIRATION
   ========================================= */

/*
    Première version très simple.

    Une seule image du corps est utilisée.

    On déplace légèrement la couche vers le haut
    puis vers le bas.

    Le mouvement est volontairement très faible
    pour éviter que Cassandra semble "flotter".
*/

var breathing = false;


function setBodyPosition(offset) {

    if (!body) {
        return;
    }

    body.style.transform =
        "translateY(" + offset + "px)";
}


function breathe() {

    if (
        breathing ||
        !body
    ) {
        return;
    }

    breathing = true;


    /*
        Position normale
    */

    setBodyPosition(0);


    /*
        Inspiration
    */

    setTimeout(function() {

        setBodyPosition(-1);

    }, 250);


    setTimeout(function() {

        setBodyPosition(-2);

    }, 500);


    setTimeout(function() {

        setBodyPosition(-3);

    }, 750);


    /*
        Petite pause en inspiration
    */

    setTimeout(function() {

        setBodyPosition(-3);

    }, 1100);


    /*
        Expiration
    */

    setTimeout(function() {

        setBodyPosition(-2);

    }, 1400);


    setTimeout(function() {

        setBodyPosition(-1);

    }, 1700);


    setTimeout(function() {

        setBodyPosition(0);

    }, 2000);


    /*
        Fin du cycle
    */

    setTimeout(function() {

        breathing = false;

    }, 2100);
}


/* =========================================
   RESPIRATION AUTOMATIQUE
   ========================================= */

function scheduleBreathing() {

    /*
        Une respiration toutes les
        3 à 5 secondes environ.
    */

    var delay =
        3000 +
        Math.random() * 2000;


    setTimeout(function() {

        breathe();

        scheduleBreathing();

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
    loadBodyImage();


    /*
        État initial
    */

    setNormalEyes(1);
    setMouth(1);
    setBodyPosition(0);


    /*
        Animations
    */

    scheduleBlink();

    scheduleLook();

    scheduleExpression();

    scheduleBreathing();


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

setTimeout(function() {
    surprise(2500);
}, 3000);

setTimeout(function() {
    fatigue(3000);
}, 3000);

setTimeout(function() {
    disgust(2500);
}, 3000);

setTimeout(function() {
    maliciousSmile(3000);
}, 3000);