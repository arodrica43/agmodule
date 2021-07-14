

    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-levels");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",15);
    // ---------------------------------------------------------------------------------------

    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            var percent = 100*myJson.value/ myJson.max_value  + '%';
            document.querySelector("#header-lvl").innerHTML = myJson.title;
            document.querySelector("#value").innerHTML = "You have reached " + myJson.by + " " + myJson.value +"!<br><div>" + percent + "</div><br>" ;
            document.querySelector("#progress").innerHTML = '<div class="progress" id="progress-bar-div">' +
                                                                '<div class="meter red">' +
                                                                    '<span style="width: ' + percent + '"></span>' +
                                                                '</div>' +
                                                            '</div>'; 
            document.querySelector("#progress-bar-div").onclick = function(){
                // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 2, message:"Progress bar clicked", register : log, level:1,type:"ImageClick"});
                // --------------------------------------------------------------------------
            }   
            document.querySelector("#value").onclick = function(){
                // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 2, message:"Current level text clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }          
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });


    $(".meter > span").each(function () {
      $(this)
        .data("origWidth", $(this).width())
        .width(0)
        .animate(
          {
            width: $(this).data("origWidth")
          },
          1200
        );
    });

      