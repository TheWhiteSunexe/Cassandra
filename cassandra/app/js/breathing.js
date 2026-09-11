/* =========================================
   RESPIRATION
   ========================================= */

/*
    Première version très simple.

    Une seule image du corps est utilisée.

    On déplace légèrement la couche vers le haut
    puis vers le bas.

    Le mouvement est volontairement très faible
    pour éviter que Cassandra semble "flotter".
*/

var breathing = false;


function setBodyPosition(offset) {

    if (!body) {
        return;
    }

    body.style.transform =
        "translateY(" + offset + "px)";
}


function breathe() {

    if (
        breathing ||
        !body
    ) {
        return;
    }

    breathing = true;


    /*
        Position normale
    */

    setBodyPosition(0);


    /*
        Inspiration
    */

    setTimeout(function() {

        setBodyPosition(-1);

    }, 250);


    setTimeout(function() {

        setBodyPosition(-2);

    }, 500);


    setTimeout(function() {

        setBodyPosition(-3);

    }, 750);


    /*
        Petite pause en inspiration
    */

    setTimeout(function() {

        setBodyPosition(-3);

    }, 1100);


    /*
        Expiration
    */

    setTimeout(function() {

        setBodyPosition(-2);

    }, 1400);


    setTimeout(function() {

        setBodyPosition(-1);

    }, 1700);


    setTimeout(function() {

        setBodyPosition(0);

    }, 2000);


    /*
        Fin du cycle
    */

    setTimeout(function() {

        breathing = false;

    }, 2100);
}


/* =========================================
   RESPIRATION AUTOMATIQUE
   ========================================= */

function scheduleBreathing() {

    var delay =
        animationConfig.breathingMinDelay +
        Math.random() *
        (
            animationConfig.breathingMaxDelay -
            animationConfig.breathingMinDelay
        );


    setTimeout(function() {

        breathe();

        scheduleBreathing();

    }, delay);
}