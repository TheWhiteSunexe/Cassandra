/* =========================================
   API EXTERNES
   ========================================= */

var externalAPI = {

    timeout: 8000,


    /* -----------------------------------------
       REQUÊTE GET
       ----------------------------------------- */

    get: function(url, options, callback) {

        options = options || {};

        var xhr = new XMLHttpRequest();

        xhr.open(
            "GET",
            url,
            true
        );

        xhr.timeout =
            options.timeout ||
            this.timeout;


        /* -------------------------------------
           HEADERS
           ------------------------------------- */

        if (options.headers) {

            Object.keys(
                options.headers
            ).forEach(function(header) {

                xhr.setRequestHeader(
                    header,
                    options.headers[header]
                );

            });
        }


        /* -------------------------------------
           RÉPONSE
           ------------------------------------- */

        xhr.onload = function() {

            if (
                xhr.status < 200 ||
                xhr.status >= 300
            ) {

                callback(
                    null,
                    "HTTP_" + xhr.status
                );

                return;
            }


            try {

                var data =
                    JSON.parse(
                        xhr.responseText
                    );

                callback(
                    data,
                    null,
                    xhr.status
                );

            }
            catch (error) {

                callback(
                    null,
                    "INVALID_JSON"
                );
            }
        };


        /* -------------------------------------
           ERREUR RÉSEAU
           ------------------------------------- */

        xhr.onerror = function() {

            callback(
                null,
                "NETWORK_ERROR"
            );
        };


        /* -------------------------------------
           TIMEOUT
           ------------------------------------- */

        xhr.ontimeout = function() {

            callback(
                null,
                "TIMEOUT"
            );
        };


        xhr.send();
    }
};
