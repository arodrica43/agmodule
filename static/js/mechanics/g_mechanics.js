
    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header").innerHTML = myJson.title;
            document.querySelector("#mechanic_html").innerHTML = myJson.html;
            //$(myJson.html).appendTo(document.body); // WARNING:  enabling this turns into a recursive call to server
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });



      