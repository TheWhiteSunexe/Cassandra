/* =========================================
   CASSANDRA - MIST
   ========================================= */

var cassandraHidden = false;
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
   RÉCUPÉRATION DES ÉLÉMENTS
   ========================================= */

function ensureMistInitialized() {

    if (
        !mistElement ||
        !mistImageElement
    ) {
        initMist();
    }

    return (
        mistElement &&
        mistImageElement
    );
}


/* =========================================
   AFFICHAGE D'UNE IMAGE
   ========================================= */

function setMistFrame(frame) {

    if (
        !ensureMistInitialized()
    ) {
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
        cassandraHidden
    ) {
        return;
    }

    if (
        !ensureMistInitialized()
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
            Le brouillard est complètement opaque.

            Cassandra disparaît maintenant.
        */

        var cassandra =
            document.getElementById("cassandra");

        if (cassandra) {
            cassandra.style.visibility =
                "hidden";
        }


        var leftInfo =
            document.getElementById("leftInfo");

        var rightInfo =
            document.getElementById("rightInfo");


        if (leftInfo) {
            leftInfo.style.visibility =
                "hidden";
        }

        if (rightInfo) {
            rightInfo.style.visibility =
                "hidden";
        }


        cassandraHidden = true;


        /*
            Le brouillard disparaît.
        */

        setTimeout(function() {

            mistElement.style.display = "none";

            mistAnimating = false;

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
        !cassandraHidden
    ) {
        return;
    }

    if (
        !ensureMistInitialized()
    ) {
        return;
    }

    mistAnimating = true;

    mistElement.style.display = "block";


    /*
        Le brouillard est complètement présent.
    */

    var frame = 9;


    /*
        Cassandra est placée derrière
        le brouillard avant sa disparition.
    */

    var cassandra =
        document.getElementById("cassandra");

    if (cassandra) {
        cassandra.style.visibility =
            "visible";
    }


    var leftInfo =
        document.getElementById("leftInfo");

    var rightInfo =
        document.getElementById("rightInfo");


    if (leftInfo) {
        leftInfo.style.visibility =
            "visible";
    }

    if (rightInfo) {
        rightInfo.style.visibility =
            "visible";
    }


    cassandraHidden = false;


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
            Le brouillard est complètement dissipé.
        */

        mistElement.style.display = "none";

        mistAnimating = false;
    }


    nextFrame();
}