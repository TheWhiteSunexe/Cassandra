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

    bottom: [
        "images/eyes/EyesBottom.png",
        "images/eyes/EyesBottom2.png",
        "images/eyes/EyesBottom3.png",
        "images/eyes/EyesBottom4.png",
        "images/eyes/EyesBottomLeft.png",
        "images/eyes/EyesBottomRight.png"
    ],

    top: [
        "images/eyes/EyesTop.png",
        "images/eyes/EyesTop2.png",
        "images/eyes/EyesTop3.png",
        "images/eyes/EyesTop4.png",
        "images/eyes/EyesTop5.png",
        "images/eyes/EyesTopLeft.png",
        "images/eyes/EyesTopRight.png"
    ],

    clin: [
        "images/eyes/EyesClin.png"
    ],

    happy: [
        "images/eyes/EyesHappy.png"
    ],

    left: [
        "images/eyes/EyesLeft.png",
        "images/eyes/EyesLeft1.png",
        "images/eyes/EyesLeft2.png",
        "images/eyes/EyesLeft3.png",
        "images/eyes/EyesLeftBottom.png",
        "images/eyes/EyesLeftTop.png"
    ],

    right: [
        "images/eyes/EyesRight.png",
        "images/eyes/EyesRight2.png",
        "images/eyes/EyesRight3.png",
        "images/eyes/EyesRight4.png",
        "images/eyes/EyesRight5.png",
        "images/eyes/EyesRight6.png",
        "images/eyes/EyesRightBottom.png",
        "images/eyes/EyesRightTop.png"
    ],

    sad: [
        "images/eyes/EyesSad.png"
    ],

    surprise: [
        "images/eyes/EyesSurprise.png"
    ],

    tired: [
        "images/eyes/EyesTired.png"
    ]
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
   PATTERNS DE BROUILLARD
   ========================================= */

var mistTransitions = {

    disappear: [
        "mist1",
        "mist2",
        "mist3",
        "mist4",
        "mist5",
        "mist6",
        "mist7",
        "mist8",
        "mist9"
    ],

    appear: [
        "mist9",
        "mist8",
        "mist7",
        "mist6",
        "mist5",
        "mist4",
        "mist3",
        "mist2",
        "mist1"
    ]
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
    breathingMaxDelay: 5000, 

    mistFrameDuration: 180,
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

    // =========================================
    // CLIGNEMENT
    // =========================================

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
    ],


    // =========================================
    // CENTRE → HAUT
    // =========================================

    normalToTop: [
        "normal1",
        "top1",
        "top2",
        "top3",
        "top4",
        "top5"
    ],

    topToNormal: [
        "top5",
        "top4",
        "top3",
        "top2",
        "top1",
        "normal1"
    ],


    // =========================================
    // CENTRE → BAS
    // =========================================

    normalToBottom: [
        "normal1",
        "bottom1",
        "bottom2",
        "bottom3",
        "bottom4"
    ],

    bottomToNormal: [
        "bottom4",
        "bottom3",
        "bottom2",
        "bottom1",
        "normal1"
    ],


    // =========================================
    // CENTRE → GAUCHE
    // =========================================

    normalToLeft: [
        "normal1",
        "left1",
        "left2",
        "left3"
    ],

    leftToNormal: [
        "left3",
        "left2",
        "left1",
        "normal1"
    ],


    // =========================================
    // CENTRE → DROITE
    // =========================================

    normalToRight: [
        "normal1",
        "right1",
        "right2",
        "right3",
        "right4",
        "right5",
        "right6"
    ],

    rightToNormal: [
        "right6",
        "right5",
        "right4",
        "right3",
        "right2",
        "right1",
        "normal1"
    ],


    // =========================================
    // GAUCHE → HAUT
    // =========================================

    leftToTop: [
        "left3",
        "leftTop",
        "topLeft",
        "top1"
    ],

    topToLeft: [
        "top1",
        "topLeft",
        "leftTop",
        "left3"
    ],


    // =========================================
    // HAUT → DROITE
    // =========================================

    topToRight: [
        "top5",
        "topRight",
        "rightTop",
        "right6"
    ],

    rightToTop: [
        "right6",
        "rightTop",
        "topRight",
        "top5"
    ],


    // =========================================
    // DROITE → BAS
    // =========================================

    rightToBottom: [
        "right6",
        "rightBottom",
        "bottomRight",
        "bottom4"
    ],

    bottomToRight: [
        "bottom4",
        "bottomRight",
        "rightBottom",
        "right6"
    ],


    // =========================================
    // BAS → GAUCHE
    // =========================================

    bottomToLeft: [
        "bottom4",
        "bottomLeft",
        "leftBottom",
        "left3"
    ],

    leftToBottom: [
        "left3",
        "leftBottom",
        "bottomLeft",
        "bottom4"
    ],


    // =========================================
    // GAUCHE → DROITE PAR LE HAUT
    // =========================================

    leftToRightTop: [
        "left3",
        "leftTop",
        "topLeft",
        "top1",
        "top2",
        "top3",
        "topRight",
        "rightTop",
        "right6"
    ],


    // =========================================
    // GAUCHE → DROITE PAR LE BAS
    // =========================================

    leftToRightBottom: [
        "left3",
        "leftBottom",
        "bottomLeft",
        "bottom1",
        "bottom2",
        "bottom3",
        "bottomRight",
        "rightBottom",
        "right6"
    ],


    // =========================================
    // DROITE → GAUCHE PAR LE HAUT
    // =========================================

    rightToLeftTop: [
        "right6",
        "rightTop",
        "topRight",
        "top1",
        "top2",
        "top3",
        "topLeft",
        "leftTop",
        "left3"
    ],


    // =========================================
    // DROITE → GAUCHE PAR LE BAS
    // =========================================

    rightToLeftBottom: [
        "right6",
        "rightBottom",
        "bottomRight",
        "bottom1",
        "bottom2",
        "bottom3",
        "bottomLeft",
        "leftBottom",
        "left3"
    ],


    // =========================================
    // TOUR COMPLET DES YEUX
    // =========================================

    circleClockwise: [
        "left3",
        "leftTop",
        "topLeft",
        "top1",
        "topRight",
        "rightTop",
        "right6",
        "rightBottom",
        "bottomRight",
        "bottom4",
        "bottomLeft",
        "leftBottom",
        "left3"
    ],

    circleCounterClockwise: [
        "left3",
        "leftBottom",
        "bottomLeft",
        "bottom4",
        "bottomRight",
        "rightBottom",
        "right6",
        "rightTop",
        "topRight",
        "top1",
        "topLeft",
        "leftTop",
        "left3"
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
var mouthTransitions = {

    // =========================================
    // RETOUR À LA BOUCHE NORMALE
    // =========================================

    normal: [
        "normal1"
    ],


    // =========================================
    // OUVERTURE PROGRESSIVE
    // =========================================

    open: [
        "normal1",
        "normal2",
        "normal3",
        "normal4"
    ],


    // =========================================
    // FERMETURE PROGRESSIVE
    // =========================================

    close: [
        "normal4",
        "normal3",
        "normal2",
        "normal1"
    ],


    // =========================================
    // PAROLE
    // =========================================

    speak: [
        "normal1",
        "normal2",
        "normal3",
        "normal4"
    ],


    // =========================================
    // BOUCHE EN "O"
    // =========================================

    toO: [
        "normal1",
        "normal2",
        "normal3",
        "normal4",
        "o"
    ],

    fromO: [
        "o",
        "normal4",
        "normal3",
        "normal2",
        "normal1"
    ],


    // =========================================
    // BOUCHE → KISS
    // =========================================

    toKiss: [
        "normal1",
        "normal2",
        "normal3",
        "normal4",
        "normal7",
        "o",
        "kiss"
    ],

    fromKiss: [
        "kiss",
        "o",
        "normal7",
        "normal4",
        "normal3",
        "normal2",
        "normal1"
    ],


    // =========================================
    // BOUCHE → LAUGH
    // =========================================

    toLaugh: [
        "normal1",
        "normal2",
        "normal3",
        "normal4",
        "laugh"
    ],

    fromLaugh: [
        "laugh",
        "normal4",
        "normal3",
        "normal2",
        "normal1"
    ],


    // =========================================
    // SOURIRE NATUREL
    // =========================================

    toSmile1: [
        "normal1",
        "smile1"
    ],

    fromSmile1: [
        "smile1",
        "normal1"
    ],


    // =========================================
    // SOURIRE → SOURIRE PLUS MARQUÉ
    // =========================================

    smile1ToSmile2: [
        "smile1",
        "smile2"
    ],

    smile2ToSmile1: [
        "smile2",
        "smile1"
    ],


    // =========================================
    // SOURIRE 2 → SOURIRE 3
    // =========================================

    smile2ToSmile3: [
        "smile2",
        "smile3"
    ],

    smile3ToSmile2: [
        "smile3",
        "smile2"
    ],


    // =========================================
    // SOURIRE 3 → SOURIRE 4
    // =========================================

    smile3ToSmile4: [
        "smile3",
        "smile4"
    ],

    smile4ToSmile3: [
        "smile4",
        "smile3"
    ],


    // =========================================
    // SOURIRE NATUREL → RIRE
    // =========================================

    smile1ToLaugh: [
        "smile1",
        "smile2",
        "smile3",
        "smile4",
        "laugh"
    ],


    // =========================================
    // SOURIRE 4 → RETOUR NORMAL
    // =========================================

    smile4ToNormal: [
        "smile4",
        "smile3",
        "smile2",
        "smile1",
        "normal1"
    ],


    // =========================================
    // DÉGOÛT
    // =========================================

    toDisgust: [
        "normal1",
        "disgust"
    ],

    fromDisgust: [
        "disgust",
        "normal1"
    ],


    // =========================================
    // DÉGOÛT → GRIMACE
    // =========================================

    disgustToGrimace: [
        "disgust",
        "grimace"
    ],

    grimaceToDisgust: [
        "grimace",
        "disgust"
    ],


    // =========================================
    // GRIMACE → NORMAL
    // =========================================

    grimaceToNormal: [
        "grimace",
        "disgust",
        "normal1"
    ],


    // =========================================
    // NORMAL → GRIMACE
    // =========================================

    toGrimace: [
        "normal1",
        "disgust",
        "grimace"
    ]
};