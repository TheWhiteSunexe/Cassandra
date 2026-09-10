/* =========================================
   CASSANDRA - EXPRESSIONS
   ========================================= */

var expressing = false;


/* =========================================
   MAPPING DES EXPRESSIONS
   ========================================= */

/*
    Une expression décrit :

    eyes:
        état final des yeux

    mouth:
        état final de la bouche

    eyeTransition:
        transition utilisée pour atteindre les yeux

    mouthTransition:
        transition utilisée pour atteindre la bouche

    Les transitions détaillées sont définies
    dans config.js.

    Les moteurs qui exécutent réellement
    les transitions sont dans eyes.js
    et mouth.js.
*/

var expressionMap = {

    /* =====================================
       NEUTRE
       ===================================== */

    neutral: {
        eyes: "normal1",
        mouth: "normal1",
        eyeTransition: null,
        mouthTransition: "normal"
    },


    /* =====================================
       JOIE / BONHEUR
       ===================================== */

    happy: {
        eyes: "happy",
        mouth: "smile1",
        eyeTransition: null,
        mouthTransition: "toSmile1"
    },


    /* =====================================
       SOURIRE LÉGER
       ===================================== */

    smile: {
        eyes: "happy",
        mouth: "smile1",
        eyeTransition: null,
        mouthTransition: "toSmile1"
    },


    /* =====================================
       SOURIRE PLUS MARQUÉ
       ===================================== */

    bigSmile: {
        eyes: "happy",
        mouth: "smile2",
        eyeTransition: null,
        mouthTransition: "smile1ToSmile2"
    },


    /* =====================================
       SOURIRE TRÈS MARQUÉ
       ===================================== */

    hugeSmile: {
        eyes: "happy",
        mouth: "smile3",
        eyeTransition: null,
        mouthTransition: "smile2ToSmile3"
    },


    /* =====================================
       SOURIRE FAUX / MALVEILLANT
       ===================================== */

    maliciousSmile: {
        eyes: "clin",
        mouth: "smile4",
        eyeTransition: null,
        mouthTransition: "smile3ToSmile4"
    },


    /* =====================================
       RIRE
       ===================================== */

    laugh: {
        eyes: "happy",
        mouth: "laugh",
        eyeTransition: null,
        mouthTransition: "smile1ToLaugh"
    },


    /* =====================================
       SURPRISE
       ===================================== */

    surprise: {
        eyes: "surprise",
        mouth: "o",
        eyeTransition: null,
        mouthTransition: "toO"
    },


    /* =====================================
       GRANDE SURPRISE
       ===================================== */

    bigSurprise: {
        eyes: "surprise",
        mouth: "o",
        eyeTransition: null,
        mouthTransition: "toO"
    },


    /* =====================================
       FATIGUE
       ===================================== */

    fatigue: {
        eyes: "tired",
        mouth: "normal1",
        eyeTransition: null,
        mouthTransition: "normal"
    },


    /* =====================================
       TRISTESSE
       ===================================== */

    sad: {
        eyes: "sad",
        mouth: "normal12",
        eyeTransition: null,
        mouthTransition: "normal"
    },


    /* =====================================
       DÉGOÛT
       ===================================== */

    disgust: {
        eyes: "sad",
        mouth: "disgust",
        eyeTransition: null,
        mouthTransition: "toDisgust"
    },


    /* =====================================
       GRIMACE
       ===================================== */

    grimace: {
        eyes: "sad",
        mouth: "grimace",
        eyeTransition: null,
        mouthTransition: "toGrimace"
    },


    /* =====================================
       BISOUS
       ===================================== */

    kiss: {
        eyes: "happy",
        mouth: "kiss",
        eyeTransition: null,
        mouthTransition: "toKiss"
    },


    /* =====================================
       CLIN D'ŒIL
       ===================================== */

    wink: {
        eyes: "clin",
        mouth: "normal1",
        eyeTransition: null,
        mouthTransition: "normal"
    },


    /* =====================================
       YEUX HEUREUX
       ===================================== */

    happyEyes: {
        eyes: "happy",
        mouth: "normal1",
        eyeTransition: null,
        mouthTransition: "normal"
    },


    /* =====================================
       YEUX FATIGUÉS + BOUCHE NORMALE
       ===================================== */

    tired: {
        eyes: "tired",
        mouth: "normal1",
        eyeTransition: null,
        mouthTransition: "normal"
    },


    /* =====================================
       YEUX SURPRIS + BOUCHE NORMALE
       ===================================== */

    shocked: {
        eyes: "surprise",
        mouth: "normal1",
        eyeTransition: null,
        mouthTransition: "normal"
    },


    /* =====================================
       ÉNERVEMENT / MÉCONTENTEMENT
       ===================================== */

    angry: {
        eyes: "sad",
        mouth: "normal12",
        eyeTransition: null,
        mouthTransition: "normal"
    },


    /* =====================================
       PETIT RIRE / AMUSEMENT
       ===================================== */

    amused: {
        eyes: "happy",
        mouth: "smile1",
        eyeTransition: null,
        mouthTransition: "toSmile1"
    }
};


/* =========================================
   UTILITAIRES
   ========================================= */

/*
    Retour à l'état neutre.
*/

function restoreNeutral() {

    if (typeof moveEyes === "function") {
        moveEyes("normal1");
    } else {
        setNormalEyes(1);
    }

    if (typeof moveMouth === "function") {
        moveMouth("normal1");
    } else {
        setMouth(1);
    }
}


/*
    Vérifie si Cassandra peut changer
    d'expression.
*/

function canExpress() {

    if (expressing) {
        return false;
    }

    if (typeof blinking !== "undefined" && blinking) {
        return false;
    }

    if (typeof looking !== "undefined" && looking) {
        return false;
    }

    if (typeof speaking !== "undefined" && speaking) {
        return false;
    }

    return true;
}


/* =========================================
   TRANSITION DES YEUX
   ========================================= */

/*
    Lance la transition d'yeux demandée.

    Si une transition précise existe dans
    config.js, elle est utilisée.

    Sinon, on utilise le comportement
    classique.
*/

function playExpressionEyes(expression) {

    if (!expression.eyes) {
        return;
    }


    /*
        Transition personnalisée
    */

    if (
        expression.eyeTransition &&
        typeof playEyeTransition === "function"
    ) {

        playEyeTransition(
            expression.eyeTransition
        );

        return;
    }


    /*
        État normal
    */

    if (
        expression.eyes.indexOf("normal") === 0
    ) {

        var eyeNumber =
            parseInt(
                expression.eyes.replace("normal", ""),
                10
            );

        if (typeof setNormalEyes === "function") {
            setNormalEyes(eyeNumber);
        }

        return;
    }


    /*
        Expression d'yeux
    */

    if (typeof setEyeExpression === "function") {

        setEyeExpression(
            expression.eyes
        );
    }
}


/* =========================================
   TRANSITION DE LA BOUCHE
   ========================================= */

function playExpressionMouth(expression) {

    if (!expression.mouth) {
        return;
    }


    /*
        Transition personnalisée
    */

    if (
        expression.mouthTransition &&
        typeof playMouthTransition === "function"
    ) {

        playMouthTransition(
            expression.mouthTransition
        );

        return;
    }


    /*
        Bouche normale
    */

    if (
        expression.mouth.indexOf("normal") === 0
    ) {

        var mouthNumber =
            parseInt(
                expression.mouth.replace("normal", ""),
                10
            );

        if (typeof setMouth === "function") {
            setMouth(mouthNumber);
        }

        return;
    }


    /*
        Expression de bouche
    */

    if (typeof setMouthExpression === "function") {

        setMouthExpression(
            expression.mouth
        );
    }
}


/* =========================================
   EXPRESSION
   ========================================= */

function playExpression(name, duration) {

    if (!expressionMap[name]) {

        console.log(
            "Expression inconnue : " + name
        );

        return;
    }


    if (!canExpress()) {
        return;
    }


    expressing = true;


    var expression =
        expressionMap[name];


    /*
        Durée par défaut
    */

    if (
        typeof duration !== "number"
    ) {

        duration =
            animationConfig.expressionMinDuration;
    }


    /*
        Yeux
    */

    playExpressionEyes(
        expression
    );


    /*
        Bouche
    */

    playExpressionMouth(
        expression
    );


    /*
        Retour au neutre
    */

    setTimeout(function() {

        restoreNeutral();

        expressing = false;

    }, duration);
}


/* =========================================
   EXPRESSIONS PUBLIQUES
   ========================================= */

/*
    Joie
*/

function smile(duration) {
    playExpression("happy", duration);
}


/*
    Sourire léger
*/

function smileSoft(duration) {
    playExpression("smile", duration);
}


/*
    Grand sourire
*/

function bigSmile(duration) {
    playExpression("bigSmile", duration);
}


/*
    Très grand sourire
*/

function hugeSmile(duration) {
    playExpression("hugeSmile", duration);
}


/*
    Sourire malveillant
*/

function maliciousSmile(duration) {
    playExpression(
        "maliciousSmile",
        duration
    );
}


/*
    Rire
*/

function laugh(duration) {
    playExpression("laugh", duration);
}


/*
    Surprise
*/

function surprise(duration) {
    playExpression("surprise", duration);
}


/*
    Grande surprise
*/

function bigSurprise(duration) {
    playExpression(
        "bigSurprise",
        duration
    );
}


/*
    Fatigue
*/

function fatigue(duration) {
    playExpression(
        "fatigue",
        duration
    );
}


/*
    Tristesse
*/

function sad(duration) {
    playExpression(
        "sad",
        duration
    );
}


/*
    Dégoût
*/

function disgust(duration) {
    playExpression(
        "disgust",
        duration
    );
}


/*
    Grimace
*/

function grimace(duration) {
    playExpression(
        "grimace",
        duration
    );
}


/*
    Bisou
*/

function kiss(duration) {
    playExpression(
        "kiss",
        duration
    );
}


/*
    Clin d'œil
*/

function wink(duration) {
    playExpression(
        "wink",
        duration
    );
}


/*
    Air amusé
*/

function amused(duration) {
    playExpression(
        "amused",
        duration
    );
}


/*
    Énervement
*/

function angry(duration) {
    playExpression(
        "angry",
        duration
    );
}


/*
    Choc / stupéfaction
*/

function shocked(duration) {
    playExpression(
        "shocked",
        duration
    );
}


/* =========================================
   EXPRESSIONS ALÉATOIRES
   ========================================= */

function scheduleExpression() {

    var delay =
        animationConfig.expressionMinDelay +
        Math.random() *
        (
            animationConfig.expressionMaxDelay -
            animationConfig.expressionMinDelay
        );


    setTimeout(function() {

        /*
            Pour l'instant, Cassandra utilise
            principalement le sourire dans les
            animations autonomes.

            On pourra ensuite créer un véritable
            système de personnalité avec plusieurs
            expressions pondérées.
        */

        var duration =
            animationConfig.expressionMinDuration +
            Math.random() *
            (
                animationConfig.expressionMaxDuration -
                animationConfig.expressionMinDuration
            );


        smile(duration);


        scheduleExpression();

    }, delay);
}