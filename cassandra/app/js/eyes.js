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
   ÉTATS
   ========================================= */

var blinking = false;
var looking = false;


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
   ÉTAT LOGIQUE -> IMAGE
   ========================================= */

function setEyeState(state) {

    if (state.indexOf("normal") === 0) {

        var number =
            parseInt(
                state.replace("normal", ""),
                10
            );

        setNormalEyes(number);

        return;
    }

    setEyeExpression(state);
}


/* =========================================
   TRANSITION
   ========================================= */

function playEyeTransition(sequence, speed, callback) {

    if (
        !sequence ||
        sequence.length === 0
    ) {
        if (callback) {
            callback();
        }

        return;
    }

    var frame = 0;

    function nextFrame() {

        if (frame >= sequence.length) {

            if (callback) {
                callback();
            }

            return;
        }

        setEyeState(
            sequence[frame]
        );

        frame++;

        if (frame < sequence.length) {

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

function scheduleLook() {

    var delay =
        animationConfig.lookMinDelay +
        Math.random() *
        (
            animationConfig.lookMaxDelay -
            animationConfig.lookMinDelay
        );

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
            animationConfig.lookMinDuration +
            Math.random() *
            (
                animationConfig.lookMaxDuration -
                animationConfig.lookMinDuration
            );

        look(
            direction,
            duration
        );

        scheduleLook();

    }, delay);
}
