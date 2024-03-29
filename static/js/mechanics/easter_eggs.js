    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_locked_time();
    start_focus_time("main-content-egg");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------

    function approachEgg(){
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Easter egg image clicked", register : log, level:1,type:"ImageClick"});
        // --------------------------------------------------------------------------
        document.querySelector("#num_clicks").value++;
        //alert(document.querySelector("#num_clicks").value);
        if(document.querySelector("#num_clicks").value >= 5){
            // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
            stop_locked_time();
            start_unlocked_time();
            // --------------------------------------------------------------------------
            document.querySelector("#num_clicks").value = 0;
            document.querySelector("#egg-content").innerHTML = document.querySelector("#egg-html").value;
          // $(document.querySelector("#egg-html").value).appendTo(document.body); 
        }
    }

    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#egg-html").value = myJson.egg_html;
            document.querySelector("#header-egg").innerHTML = myJson.title;
            document.querySelector("#egg-content").innerHTML = '<div style="height:calc(5vw);"></div><a onclick="javascript:approachEgg()">' +
                                                                          '<img class="card-img-top" src="' + myJson.feedback + '" alt="Card image" style="width:300px; height:300px;"></a>';
             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });


      