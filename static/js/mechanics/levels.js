

    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-levels");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------

    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            url = "https://agmodule.herokuapp.com/api/gamers/dynamic_user/";
            fetch(url)
            .then(response => response.json())
            .then(function(res_json){
                console.log(course_id.replace(/\+/g, " "));
                console.log(res_json.gamer_profile.data)
                console.log(res_json.gamer_profile.data['edx_data'])
                val = res_json.gamer_profile.data['edx_data'][course_id.replace(/\+/g, " ")].progress;
                console.log(val);
                var percent = Math.min(100,100*val.toFixed(3))  + '%';
                document.querySelector("#header-lvl").innerHTML = myJson.title;
                document.querySelector("#value").innerHTML = "<div></div><br><div>Progress: " + percent + "</div>" ;
                document.querySelector("#progress").innerHTML = '<div class="progress" id="progress-bar-div">' +
                                                                    '<div class="meter red">' +
                                                                        '<span style="width: ' + percent + '"></span>' +
                                                                    '</div>' +
                                                                '</div><br>'; 
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
            .then((list) => (ch_list = list))
            .catch(error => (console.log("Error: " + error)))       
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

      