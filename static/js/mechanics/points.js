
    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-points");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------

    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-pts").innerHTML = myJson.title;
            document.querySelector("#score").innerHTML = "Your " + myJson.given_by + " is " + myJson.score ;
            //document.querySelector("#uname").innerHTML = "Username: " + myJson.user ;

            document.querySelector("#score").onclick = function(){
                // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 2, message:"Current score text clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            } 
             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });



      