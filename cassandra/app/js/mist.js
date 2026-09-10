/* =========================================
   CASSANDRA - MIST
   ========================================= */

var mistVisible = false;
var mistAnimating = false;

var mistElement = null;
var mistImageElement = null;


/* =========================================
   INITIALISATION
   ========================================= */

function initMist() {

    mistElement =
        document.getElementById("mist");

    mistImageElement =
        document.getElementById("mistImage");

}


/* =========================================
   AFFICHAGE D'UNE IMAGE
   ========================================= */

function setMistFrame(frame) {

    if (!mistImageElement) {
        return;
    }

    mistImageElement.src =
        "images/mist/Mist" +
        frame +
        ".png";
}


/* =========================================
   CACHER CASSANDRA
   ========================================= */

function hideCassandra() {

    if (
        mistAnimating ||
        mistVisible
    ) {
        return;
    }

    mistAnimating = true;

    mistElement.style.display = "block";


    var frame = 1;


    function nextFrame() {

        setMistFrame(frame);

        frame++;


        if (frame <= 9) {

            setTimeout(
                nextFrame,
                animationConfig.mistFrameDuration
            );

            return;
        }


        /*
            Le brouillard est maintenant
            complètement opaque.

            Cassandra peut disparaître
            derrière lui.
        */

        if (typeof cassandraVisible !== "undefined") {
            cassandraVisible = false;
        }


        /*
            On cache réellement Cassandra.
        */

        var cassandra =
            document.getElementById(
                "cassandra"
            );

        if (cassandra) {
            cassandra.style.visibility =
                "hidden";
        }


        /*
            Les informations peuvent également
            disparaître si on le souhaite.
        */

        var leftInfo =
            document.getElementById(
                "leftInfo"
            );

        var rightInfo =
            document.getElementById(
                "rightInfo"
            );

        if (leftInfo) {
            leftInfo.style.visibility =
                "hidden";
        }

        if (rightInfo) {
            rightInfo.style.visibility =
                "hidden";
        }


        /*
            Le brouillard disparaît à son tour.

            Il ne reste alors que le background.
        */

        setTimeout(function() {

            mistElement.style.display =
                "none";

            mistAnimating = false;
            mistVisible = true;

        }, 100);
    }


    nextFrame();
}


/* =========================================
   FAIRE RÉAPPARAÎTRE CASSANDRA
   ========================================= */

function showCassandra() {

    if (
        mistAnimating ||
        !mistVisible
    ) {
        return;
    }

    mistAnimating = true;

    mistElement.style.display = "block";


    /*
        On commence avec le brouillard
        complètement présent.
    */

    var frame = 9;


    /*
        Cassandra est déjà cachée.
    */

    var cassandra =
        document.getElementById(
            "cassandra"
        );

    if (cassandra) {
        cassandra.style.visibility =
            "visible";
    }


    var leftInfo =
        document.getElementById(
            "leftInfo"
        );

    var rightInfo =
        document.getElementById(
            "rightInfo"
        );

    if (leftInfo) {
        leftInfo.style.visibility =
            "visible";
    }

    if (rightInfo) {
        rightInfo.style.visibility =
            "visible";
    }


    function nextFrame() {

        setMistFrame(frame);

        frame--;


        if (frame >= 1) {

            setTimeout(
                nextFrame,
                animationConfig.mistFrameDuration
            );

            return;
        }


        /*
            Le brouillard est complètement
            dissipé.
        */

        mistElement.style.display =
            "none";

        mistAnimating = false;
        mistVisible = false;
    }


    nextFrame();
}