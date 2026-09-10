/* =========================================
   CASSANDRA - PRÉCHARGEMENT DES IMAGES
   ========================================= */

var loadedEyes = {};
var loadedMouth = {};
var loadedBody = null;


/* =========================================
   PRÉCHARGEMENT D'UNE IMAGE
   ========================================= */

function preloadImage(src) {

    var image = new Image();

    image.src = src;

    return image;
}


/* =========================================
   PRÉCHARGEMENT D'UN TABLEAU D'IMAGES
   ========================================= */

function preloadImageArray(images) {

    var loaded = [];

    for (var i = 0; i < images.length; i++) {

        loaded.push(
            preloadImage(images[i])
        );
    }

    return loaded;
}


/* =========================================
   PRÉCHARGEMENT DES YEUX
   ========================================= */

function loadEyeImages() {

    loadedEyes.normal =
        preloadImageArray(
            eyeImages.normal
        );

    loadedEyes.bottom =
        preloadImageArray(
            eyeImages.bottom
        );

    loadedEyes.top =
        preloadImageArray(
            eyeImages.top
        );

    loadedEyes.clin =
        preloadImageArray(
            eyeImages.clin
        );

    loadedEyes.happy =
        preloadImageArray(
            eyeImages.happy
        );

    loadedEyes.left =
        preloadImageArray(
            eyeImages.left
        );

    loadedEyes.right =
        preloadImageArray(
            eyeImages.right
        );

    loadedEyes.sad =
        preloadImageArray(
            eyeImages.sad
        );

    loadedEyes.surprise =
        preloadImageArray(
            eyeImages.surprise
        );

    loadedEyes.tired =
        preloadImageArray(
            eyeImages.tired
        );
}


/* =========================================
   PRÉCHARGEMENT BOUCHE
   ========================================= */

function loadMouthImages() {

    loadedMouth.normal =
        preloadImageArray(
            mouthImages.normal
        );

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