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
   PARAMÈTRES D'ANIMATION
   ========================================= */

var animationConfig = {

    blinkFrameDuration: 20,

    blinkMinDelay: 6000,
    blinkMaxDelay: 12000,

    lookMinDelay: 8000,
    lookMaxDelay: 20000,

    lookMinDuration: 1200,
    lookMaxDuration: 3500,

    expressionMinDelay: 15000,
    expressionMaxDelay: 35000,

    expressionMinDuration: 1500,
    expressionMaxDuration: 4000,

    speechFrameDuration: 70,

    breathingMinDelay: 3000,
    breathingMaxDelay: 5000
};


/* =========================================
   TRANSITIONS DES YEUX
   ========================================= */

/*
    Cette table contient les chemins de transition.

    Pour le moment, seule la transition du
    clignement est définie avec les images
    existantes.

    Les futures images intermédiaires pourront
    être ajoutées ici sans modifier eyes.js.

    Exemple futur :

    center_to_right: [
        "normal1",
        "centerRight1",
        "centerRight2",
        "right"
    ]
*/

var eyeTransitions = {

    blink: [
        "normal1",
        "normal2",
        "normal3",
        "normal4",
        "normal5",
        "normal6",
        "normal5",
        "normal4",
        "normal3",
        "normal2",
        "normal1"
    ]
};


/* =========================================
   TRANSITIONS DE BOUCHE
   ========================================= */

/*
    Même principe pour la bouche.

    Les transitions seront ajoutées au fur et
    à mesure de la création des images
    intermédiaires.

    Exemple futur :

    neutral_to_o: [
        1,
        2,
        "oTransition1",
        "oTransition2",
        "o"
    ]
*/

var mouthTransitions = {};
