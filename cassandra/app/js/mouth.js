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
        !mouth ||
        !loadedMouth ||
        !loadedMouth.normal
    ) {
        return;
    }

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

    if (
        !mouth ||
        !loadedMouth ||
        !loadedMouth[expression]
    ) {
        return;
    }

    /*
        Les expressions fixes sont stockées
        directement comme Image.

        Exemple :
        loadedMouth.o
        loadedMouth.kiss
        loadedMouth.smile1
    */

    mouth.src =
        loadedMouth[expression].src;
}


/* =========================================
   RÉSOLUTION D'UN ÉTAT
   ========================================= */

/*
    Convertit un état logique en image.

    Exemples :

        "normal1"
            → Mouth1.png

        "normal4"
            → Mouth4.png

        "o"
            → MouthO.png

        "kiss"
            → MouthKiss.png
*/

function setMouthState(state) {

    if (!state) {
        return;
    }

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
            setMouth(number);
        }

        return;
    }

    setMouthExpression(state);
}


/* =========================================
   TRANSITION DE BOUCHE
   ========================================= */

function playMouthTransition(sequence, speed, callback) {

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


    /*
        Valeur par défaut.

        Cela évite qu'un speed undefined
        crée des setTimeout incohérents.
    */

    if (
        typeof speed !== "number" ||
        speed < 0
    ) {
        speed =
            animationConfig.speechFrameDuration;
    }


    var frame = 0;


    function nextFrame() {

        if (frame >= sequence.length) {

            if (callback) {
                callback();
            }

            return;
        }


        setMouthState(
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
   PAROLE
   ========================================= */

function speakMouth(sequence, speed) {

    if (
        speaking ||
        !sequence ||
        sequence.length === 0
    ) {
        return;
    }

    speaking = true;


    if (
        typeof speed !== "number" ||
        speed < 0
    ) {
        speed =
            animationConfig.speechFrameDuration;
    }


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