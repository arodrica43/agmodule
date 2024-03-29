
    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-lb-content-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------
    document.querySelector("#waiting-div-dynamic_index").innerHTML = '<img id="waiting-dynamic_index" src="https://i.pinimg.com/originals/23/35/32/23353292cc60b2bcb3f015ee362eeb74.gif"  width=250/>'; 
    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-lb-dynamic_index").innerHTML = '<h2>' + myJson.title + '</h2>';
            var users = Object.keys(myJson.leadders);
            var scores = Object.values(myJson.leadders);
            document.querySelector("#tablehead-lb-dynamic_index").innerHTML +=   '<thead id="tablehead-lb-dynamic_index" style="background:#dddddd;"><tr>'+
                                                                                    '<th id="head-col0-dynamic_index" style="text-align:center">Position</th>'+
                                                                                    '<th id="head-col1-dynamic_index" style="text-align:center">Username</th>'+
                                                                                    '<th id="score-type-dynamic_index" style="text-align:center">' + myJson.sort_by + '</th>'+
                                                                                  '</tr></thead>';
            
            //document.querySelector("#extra").innerHTML = "Length = " + myJson.length + ", Type = " + myJson.mechanic_type; 
            document.querySelector("#waiting-dynamic_index").src = "";
            var count = 0; 
            users.forEach(populateTable);
            function populateTable(item, index) {
                //alert(myJson.user.email );
                if("only_me" == "yes"){
                    if(item == "dynamic_user" || count < 4){
                        var color = "whitesmoke";
                        if(item=="dynamic_user"){
                            color = "#ffcc66";
                        }else{
                            count++;
                        }
                        document.querySelector("#t-incr-dynamic_index").innerHTML += 
                            "<tr id='row-element-dynamic_index-" + index + "' style='background:" + color + ";'>" + 
                                "<td>#" + (index + 1) + "</td>" +
                                "<td>" + item + "</td>" + 
                                "<td>" + scores[index] + "</td>" + 
                            "</tr>";
                    }else{

                    }
                }else{
                    var hidden_html = "";
                    if(item == "dynamic_user"){
                        hidden_html = "style='background:#ffcc66;'";
                    }
                    document.querySelector("#t-incr-dynamic_index").innerHTML += 
                    "<tr id='row-element-dynamic_index-" + index + "' " + hidden_html + ">" + 
                        "<td>#" + (index + 1) + "</td>" +
                        "<td>" + item + "</td>" + 
                        "<td>" + scores[index] + "</td>" + 
                    "</tr>";
                }
                
            }
            users.forEach(function(item,index){
                if("only_me" == "yes"){
                    if(item == "dynamic_user" || count < 4){
                        document.querySelector("#row-element-dynamic_index-" + index).onclick = function(){
                            // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                            //Logging :: button-click interaction
                            log_click({itime: 2, message:"User at row " + index + " clicked", register : log, level:1,type:"TextClick"});
                            // --------------------------------------------------------------------------
                        }
                    }
                }else{
                    document.querySelector("#row-element-dynamic_index-" + index).onclick = function(){
                        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                        //Logging :: button-click interaction
                        log_click({itime: 2, message:"User at row " + index + " clicked", register : log, level:1,type:"TextClick"});
                        // --------------------------------------------------------------------------
                    }
                }
                
            });

        })
        .catch(function (error) {
            console.log("Error: " + error);
        });



      