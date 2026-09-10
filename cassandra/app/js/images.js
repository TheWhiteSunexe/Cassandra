/* =========================================
   CASSANDRA - PRÉCHARGEMENT DES IMAGES
   ========================================= */

var loadedEyes = {};
var loadedMouth = {};
var loadedBody = null;


function preloadImage(src) {

    var image = new Image();

    image.src = src;

    return image;
}


/* =========================================
   PRÉCHARGEMENT DES YEUX
   ========================================= */

function loadEyeImages() {

    var i;

    loadedEyes.normal = [];

    for (
        i = 0;
        i < eyeImages.normal.length;
        i++
    ) {

        loadedEyes.normal.push(
            preloadImage(
                eyeImages.normal[i]
            )
        );
    }

    loadedEyes.bottom =
        preloadImage(
            eyeImages.bottom
        );

    loadedEyes.top =
        preloadImage(
            eyeImages.top
        );

    loadedEyes.clin =
        preloadImage(
            eyeImages.clin
        );

    loadedEyes.happy =
        preloadImage(
            eyeImages.happy
        );

    loadedEyes.left =
        preloadImage(
            eyeImages.left
        );

    loadedEyes.right =
        preloadImage(
            eyeImages.right
        );

    loadedEyes.sad =
        preloadImage(
            eyeImages.sad
        );

    loadedEyes.surprise =
        preloadImage(
            eyeImages.surprise
        );

    loadedEyes.tired =
        preloadImage(
            eyeImages.tired
        );
}


/* =========================================
   PRÉCHARGEMENT BOUCHE
   ========================================= */

function loadMouthImages() {

    var i;

    loadedMouth.normal = [];

    for (
        i = 0;
        i < mouthImages.normal.length;
        i++
    ) {

        loadedMouth.normal.push(
            preloadImage(
                mouthImages.normal[i]
            )
        );
    }

    loadedMouth.disgust =
        preloadImage(
            mouthImages.disgust
        );

    loadedMouth.grimace =
        preloadImage(
            mouthImages.grimace
        );

    loadedMouth.kiss =
        preloadImage(
            mouthImages.kiss
        );

    loadedMouth.laugh =
        preloadImage(
            mouthImages.laugh
        );

    loadedMouth.o =
        preloadImage(
            mouthImages.o
        );

    loadedMouth.smile1 =
        preloadImage(
            mouthImages.smile1
        );

    loadedMouth.smile2 =
        preloadImage(
            mouthImages.smile2
        );

    loadedMouth.smile3 =
        preloadImage(
            mouthImages.smile3
        );

    loadedMouth.smile4 =
        preloadImage(
            mouthImages.smile4
        );
}


/* =========================================
   PRÉCHARGEMENT CORPS
   ========================================= */

function loadBodyImage() {

    loadedBody =
        preloadImage(
            bodyImage
        );
}
