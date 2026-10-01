/* =========================================================
   CASSANDRA — API EXTERNES
   ========================================================= */

var externalAPI = {

    timeout: 5000,


    get: function(
        url,
        options,
        callback
    ) {

        if (
            typeof options ===
            "function"
        ) {

            callback =
                options;

            options = {};
        }


        options =
            options || {};


        var xhr =
            new XMLHttpRequest();


        xhr.open(
            "GET",
            url,
            true
        );


        xhr.timeout =
            options.timeout ||
            this.timeout;


        if (options.headers) {

            Object.keys(
                options.headers
            ).forEach(
                function(header) {

                    xhr.setRequestHeader(
                        header,
                        options.headers[header]
                    );
                }
            );
        }


        xhr.onload =
            function() {

                if (
                    xhr.status < 200 ||
                    xhr.status >= 300
                ) {

                    console.error(
                        "Erreur API externe : " +
                        xhr.status
                    );

                    callback(
                        null,
                        "HTTP_" +
                        xhr.status
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
                        null
                    );

                }
                catch (error) {

                    console.error(
                        "Erreur JSON API externe :",
                        error
                    );

                    callback(
                        null,
                        "JSON_ERROR"
                    );
                }
            };


        xhr.onerror =
            function() {

                console.error(
                    "Erreur réseau API externe."
                );

                callback(
                    null,
                    "NETWORK_ERROR"
                );
            };


        xhr.ontimeout =
            function() {

                console.error(
                    "Timeout API externe."
                );

                callback(
                    null,
                    "TIMEOUT"
                );
            };


        xhr.send();
    }
};
