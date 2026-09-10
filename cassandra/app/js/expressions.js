/* =========================================
   CASSANDRA - EXPRESSIONS
   ========================================= */

var expressing = false;


/* =========================================
   MAPPING DES EXPRESSIONS
   ========================================= */

var expressionMap = {

    neutral: {
        eyes: "normal1",
        mouth: 1
    },

    happy: {
        eyes: "happy",
        mouth: "smile1"
    },

    surprise: {
        eyes: "surprise",
        mouth: "o"
    },

    fatigue: {
        eyes: "tired",
        mouth: 1
    },

    disgust: {
        eyes: "sad",
        mouth: "disgust"
    },

    maliciousSmile: {
        eyes: "clin",
        mouth: "smile4"
    },

    grimace: {
        eyes: "sad",
        mouth: "grimace"
    },

    laugh: {
        eyes: "happy",
        mouth: "laugh"
    },

    kiss: {
        eyes: "happy",
        mouth: "kiss"
    }
};


/* =========================================
   UTILITAIRES
   ========================================= */

function restoreNeutral() {

    setNormalEyes(1);
    setMouth(1);
}


/* =========================================
   EXPRESSION
   ========================================= */

/*
    Le mapping décrit l'état final.
    Les chemins de transition seront placés
    dans config.js puis exécutés par eyes.js
    et mouth.js.

    Tant qu'un chemin détaillé n'existe pas,
    on conserve le comportement actuel pour
    ne rien casser.
*/

function playExpression(name, duration) {

    if (!expressionMap[name]) {
        console.log(
            "Expression inconnue : " + name
        );

        return;
    }

    if (
        expressing ||
        blinking ||
        looking ||
        speaking
    ) {
        return;
    }

    expressing = true;

    var expression =
        expressionMap[name];


    /*
        Yeux
    */

    if (
        expression.eyes.indexOf("normal") === 0
    ) {

        var eyeNumber =
            parseInt(
                expression.eyes.replace("normal", ""),
                10
            );

        setNormalEyes(eyeNumber);

    } else {

        setEyeExpression(
            expression.eyes
        );
    }


    /*
        Bouche
    */

    if (
        typeof expression.mouth === "number"
    ) {

        setMouth(
            expression.mouth
        );

    } else {

        setMouthExpression(
            expression.mouth
        );
    }


    setTimeout(function() {

        restoreNeutral();

        expressing = false;

    }, duration);
}


/* =========================================
   EXPRESSIONS PUBLIQUES
   ========================================= */

function smile(duration) {
    playExpression("happy", duration);
}

function surprise(duration) {
    playExpression("surprise", duration);
}

function fatigue(duration) {
    playExpression("fatigue", duration);
}

function disgust(duration) {
    playExpression("disgust", duration);
}

function maliciousSmile(duration) {
    playExpression("maliciousSmile", duration);
}

function grimace(duration) {
    playExpression("grimace", duration);
}

function laugh(duration) {
    playExpression("laugh", duration);
}

function kiss(duration) {
    playExpression("kiss", duration);
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
