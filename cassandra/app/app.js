/* =========================================
   CASSANDRA 2.2.2
   LANCEMENT + INITIALISATION
   ========================================= */


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
   INITIALISATION
   ========================================= */

function initCassandra() {

    updateClock();
    updateDate();

    loadEyeImages();
    loadMouthImages();
    loadBodyImage();

    setNormalEyes(1);
    setMouth(1);
    setBodyPosition(0);

    scheduleBlink();
    scheduleLook();
    scheduleExpression();
    scheduleBreathing();

    updateHomeAssistant();
    initMist();
}


/* =========================================
   HORLOGE
   ========================================= */

setInterval(
    updateClock,
    1000
);


/* =========================================
   DATE
   ========================================= */

setInterval(
    updateDate,
    60000
);


/* =========================================
   HOME ASSISTANT
   ========================================= */

setInterval(
    updateHomeAssistant,
    10000
);


/* =========================================
   LANCEMENT
   ========================================= */

initCassandra();
