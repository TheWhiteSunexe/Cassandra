/* =========================================
   CASSANDRA - BOUCHE
   ========================================= */

var mouth =
    document.getElementById("cassandraMouth");

var speaking = false;


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
   TRANSITION DE BOUCHE
   ========================================= */

function playMouthTransition(sequence, speed, callback) {

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

        var state =
            sequence[frame];

        if (
            typeof state === "number"
        ) {

            setMouth(state);

        } else {

            setMouthExpression(state);
        }

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
   PAROLE
   ========================================= */

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
        animationConfig.speechFrameDuration
    );
}
