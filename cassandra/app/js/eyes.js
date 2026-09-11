/* =========================================
   CASSANDRA - YEUX
   ========================================= */

var eyes =
    document.getElementById("cassandraEyes");

var body =
    document.getElementById("cassandraBody");


/* =========================================
   ÉTATS
   ========================================= */

var blinking = false;
var looking = false;


/* =========================================
   YEUX NORMAUX
   ========================================= */

function setNormalEyes(number) {

    if (
        !eyes ||
        !loadedEyes ||
        !loadedEyes.normal
    ) {
        return;
    }


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

    if (
        !eyes ||
        !loadedEyes ||
        !loadedEyes[expression]
    ) {
        return;
    }


    /*
        Les expressions d'yeux sont des tableaux.

        On utilise la première image de
        l'expression.

        Exemple :
        loadedEyes.happy[0]
        loadedEyes.tired[0]
        loadedEyes.left[0]
    */

    if (
        Array.isArray(
            loadedEyes[expression]
        )
    ) {

        if (
            loadedEyes[expression].length === 0
        ) {
            return;
        }

        eyes.src =
            loadedEyes[expression][0].src;

        return;
    }


    /*
        Sécurité si une expression était
        stockée directement comme Image.
    */

    if (
        loadedEyes[expression].src
    ) {

        eyes.src =
            loadedEyes[expression].src;
    }
}


/* =========================================
   ÉTAT LOGIQUE → IMAGE
   ========================================= */

function setEyeState(state) {

    if (!state) {
        return;
    }


    /*
        Yeux normaux

        normal1
        normal2
        normal3
        ...
    */

    if (
        typeof state === "string" &&
        state.indexOf("normal") === 0
    ) {

        var number =
            parseInt(
                state.replace("normal", ""),
                10
            );

        if (!isNaN(number)) {
            setNormalEyes(number);
        }

        return;
    }


    /*
        États intermédiaires.

        top1 → loadedEyes.top[0]
        top2 → loadedEyes.top[1]

        left1 → loadedEyes.left[0]
        left2 → loadedEyes.left[1]

        etc.
    */

    var match =
        state.match(
            /^(top|bottom|left|right)(\d+)$/
        );


    if (match) {

        var direction =
            match[1];

        var index =
            parseInt(
                match[2],
                10
            ) - 1;


        if (
            loadedEyes[direction] &&
            loadedEyes[direction][index]
        ) {

            eyes.src =
                loadedEyes[direction][index].src;
        }

        return;
    }


    /*
        États intermédiaires nommés.

        Exemple :

        leftTop
        topLeft
        topRight
        rightTop
        rightBottom
        bottomRight
        bottomLeft
        leftBottom
    */

    var namedStates = {

        leftTop: ["left", 5],
        leftBottom: ["left", 4],

        topLeft: ["top", 5],
        topRight: ["top", 6],

        rightTop: ["right", 7],
        rightBottom: ["right", 6],

        bottomRight: ["bottom", 5],
        bottomLeft: ["bottom", 4]
    };


    if (
        namedStates[state]
    ) {

        var group =
            namedStates[state][0];

        var namedIndex =
            namedStates[state][1];


        if (
            loadedEyes[group] &&
            loadedEyes[group][namedIndex]
        ) {

            eyes.src =
                loadedEyes[group][namedIndex].src;
        }

        return;
    }


    /*
        Expression fixe

        happy
        sad
        tired
        surprise
        clin
    */

    setEyeExpression(state);
}


/* =========================================
   TRANSITION
   ========================================= */

function playEyeTransition(
    sequence,
    speed,
    callback
) {

    if (
        !sequence ||
        !Array.isArray(sequence) ||
        sequence.length === 0
    ) {

        if (callback) {
            callback();
        }

        return;
    }


    if (
        typeof speed !== "number" ||
        speed < 0
    ) {

        speed =
            animationConfig.blinkFrameDuration;
    }


    var frame = 0;


    function nextFrame() {

        if (
            frame >= sequence.length
        ) {

            if (callback) {
                callback();
            }

            return;
        }


        setEyeState(
            sequence[frame]
        );


        frame++;


        if (
            frame < sequence.length
        ) {

            setTimeout(
                nextFrame,
                speed
            );

        } else if (callback) {

            callback();
        }
    }


    nextFrame();
}


/* =========================================
   CLIGNEMENT
   ========================================= */

function blink() {

    if (blinking) {
        return;
    }

    blinking = true;


    playEyeTransition(
        eyeTransitions.blink,
        animationConfig.blinkFrameDuration,
        function() {

            setNormalEyes(1);

            blinking = false;
        }
    );
}


/* =========================================
   CLIGNEMENTS AUTOMATIQUES
   ========================================= */

function scheduleBlink() {

    var delay =
        animationConfig.blinkMinDelay +
        Math.random() *
        (
            animationConfig.blinkMaxDelay -
            animationConfig.blinkMinDelay
        );


    setTimeout(function() {

        blink();

        scheduleBlink();

    }, delay);
}


/* =========================================
   REGARD
   ========================================= */

function look(direction, duration) {

    if (
        looking ||
        blinking
    ) {
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

/*
    Désactivé pour le moment.

    Cassandra doit maintenant regarder
    en fonction de behavior.js / Home Assistant,
    et non aléatoirement.
*/

/*
function scheduleLook() {

    ...
}
*/