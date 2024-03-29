
    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-development_tools-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------

    //document.querySelector("#main-content-development_tools-dynamic_index").innerHTML = 'Hurry!';


function log_img_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 2, message:"Badge icon clicked", register : log, level:1,type:"ImageClick"});
           // --------------------------------------------------------------------------
          };

function log_txt_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 2, message:"Title text clicked", register : log, level:1,type:"TextClick"});
           // --------------------------------------------------------------------------
          };

function render_dvt(modifiable){

    course_position = global_avatar; // this works if there's a global variable called global_avatar, encoding the current avatar (such as dashboard2.html)
    console.log(modifiable.id);

    dyn_str = "";

    if (course_position[0] == 'X'){
        dyn_str = '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_027.png" onclick="changeIcon(1,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_028.png" onclick="changeIcon(2,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_029.png" onclick="changeIcon(3,' + modifiable.id + ');">';
    }else if (course_position[0] == 'Y'){
        dyn_str = '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_027.png" onclick="changeIcon(1,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_028.png" onclick="changeIcon(2,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_029.png" onclick="changeIcon(3,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_030.png" onclick="changeIcon(4,' + modifiable.id + ');">' ;
    }else if (course_position[0] == 'Z'){
        dyn_str = '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_027.png" onclick="changeIcon(1,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_028.png" onclick="changeIcon(2,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_029.png" onclick="changeIcon(3,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_030.png" onclick="changeIcon(4,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_031.png" onclick="changeIcon(5,' + modifiable.id + ');">';

    }else{
         dyn_str = '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_027.png" onclick="changeIcon(1,' + modifiable.id + ');">' +
            '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/Medalla_028.png" onclick="changeIcon(2,' + modifiable.id + ');">';         
    }

    
    document.querySelector("#main-content-development_tools-dynamic_index").innerHTML += '<div style="height:calc(1.5vw);"><h2>Modifica una medalla ' + global_vars["mech_title"] + '</h2></div>' + 
                                                                    '<div><img onclick="log_img_click();" id="main-badge-dynamic_index" src="' + modifiable.icon + '"><br>' +
                                                                    '<br><div>' + dyn_str + '</div></div>';
}

function selectPolicy(list){
    console.log(list);
    list.sort((a, b) => a.id - b.id);
    if(global_vars["mech_title"] == "Newbie"){
        return list[Math.floor(Math.random() * 3)];
    }else if(global_vars["mech_title"] == "Medium"){
        return list[3 + Math.floor(Math.random() * 1.99)];
    }else if(global_vars["mech_title"] == "Pro"){
        return list[5 + Math.floor(Math.random() * 1.99)];
    }
    return list[Math.floor(Math.random() * list.length)];
}

function changeIcon(type, id){
    log_img_click();
    tp = 26 + type;
    document.querySelector("#main-badge-dynamic_index").src = "https://agmodule.herokuapp.com/media/badge_icons/Medalla_0" + tp + ".png"
    fetch("https://agmodule.herokuapp.com/api/badges/" + id + "/change_icon?option=" + tp)
    .then(response => response.json())
    .then(res_json => (alert("Badge icon changed!")))
    .catch(error => (console.log("Error: " + error)))

}

modifiables = ["badges"]
mod_type =  modifiables[Math.floor(Math.random() * modifiables.length)];

url = "https://agmodule.herokuapp.com/api/" + mod_type + "/";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list)))
.then((modifiable) => ( console.log(modifiable), render_dvt(modifiable)))
.catch(error => (console.log("Error: " + error)))


    // document.querySelector("#form-container-dynamic_index").innerHTML =   '<form action="#" method="POST" name="myForm" id="formid-dynamic_index" enctype="application/json">'+
    //                                                         '<div class="row">'+
    //                                                             '<div class="col-sm-7" style="background-color:white;">'+
    //                                                                 '<label for="title">Title:</label>'+
    //                                                             '</div>'+
    //                                                             '<div class="col-sm-3" style="background-color:white;">'+
    //                                                                 '<input type="text" name="title" id="fname-dynamic_index"  size="10"></p>'+
    //                                                             '</div>'+
    //                                                         '</div>'+
    //                                                         '<div class="row">'+
    //                                                             '<div class="col-sm-7" style="background-color:white;">'+
    //                                                                 '<p><label for="name">Description:</label>'+
    //                                                             '</div>'+
    //                                                             '<div class="col-sm-3" style="background-color:white;">'+
    //                                                                 '<input type="text" name="name" id="lname-dynamic_index"  size="10" value=""></p>'+
    //                                                             '</div>'+
    //                                                         '</div>'+
    //                                                         '<div class="row">'+
    //                                                             '<div class="col-sm-7" style="background-color:white;">'+
    //                                                                 '<p><label for="by">Unlock by:</label>'+
    //                                                             '</div>'+
    //                                                             '<div class="col-sm-3" style="background-color:white;">'+
    //                                                                     '<select id="values-dynamic_index" name="by">'+
    //                                                                         '<option value="score">score</option>'+
    //                                                                         '<option value="level">level</option>'+
    //                                                                         '<option value="\$">$</option>'+
    //                                                                     '</select>'+
    //                                                             '</div>'+
    //                                                         '</div>'+
    //                                                         '<div class="row">'+
    //                                                             '<div class="col-sm-7" style="background-color:white;">'+
    //                                                                 '<p><label for="threshold">Unlock when greater than:</label>'+
    //                                                             '</div>'+
    //                                                             '<div class="col-sm-3" style="background-color:white;">'+
    //                                                                     '<input type="text" name="threshold" id="threshold-dynamic_index" size="10"></p>'+
    //                                                             '</div>'+
    //                                                         '</div><div id="unlock-elem-dynamic_index"></div>'+
    //                                                         '<div class="row">'+
    //                                                             '<div class="col-sm-7" style="background-color:white;"></div>'+
    //                                                             '<div class="col-sm-3" style="background-color:white;">'+
    //                                                                 '<input class="submit" value="Create" type="submit" target="hiddenFrame" id="submit-btn-dynamic_index">'+
    //                                                             '</div>'+
    //                                                         '</div>'+ 
    //                                                         '<br>'+
    //                                                         '</form>';

    // document.querySelector("#preview-container-dynamic_index").innerHTML =    '<div class="container-fluid" style="border-style: groove; min-height:170px;" >'+
    //                                                                 '<div class="row">'+
    //                                                                     '<div class="col-sm-12" style="background-color:white; text-align:center;" id="creation-area-title-dynamic_index">'+ 
    //                                                                         '<h2 style="text-align:center;">Preview of your Mechanic</h2><hr>'+
    //                                                                     '</div>'+
    //                                                                 '</div>' + 
    //                                                                 '<div class="row">'+
    //                                                                     '<div class="col-sm-12" style="background-color:white; text-align:center;">'+ 
    //                                                                         '<div id="incr-creation-dynamic_index"><img src="https://i.pinimg.com/originals/23/35/32/23353292cc60b2bcb3f015ee362eeb74.gif"  width=250/></div>'+
    //                                                                     '</div>'+
    //                                                                 '</div>' + 
    //                                                             '</div>';

    // var input1 = document.getElementById("fname-dynamic_index");
    // input1.onfocus = function(){
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: input-in interaction
    //     log_input({itime: 2,message:"Input field 'Name' focused in", register : log, level:1,type:"InputIn"});
    //     // --------------------------------------------------------------------------
    //     }
    // input1.onblur = function(){
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: input-out interaction
    //     log_input({itime: 2,message:"Input field 'Name' focused out", register : log, level:1,type:"InputOut"});
    //     // --------------------------------------------------------------------------
    //     }

    // var input2 = document.getElementById("lname-dynamic_index");
    // input2.onfocus = function(){
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: input-in interaction
    //     log_input({itime: 2,message:"Input field 'Description' focused in", register : log, level:1,type:"InputIn"});
    //     // --------------------------------------------------------------------------
    //     }
    // input2.onblur = function(){
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: input-out interaction
    //     log_input({itime: 2,message:"Input field 'Description' focused out", register : log, level:1,type:"InputOut"});
    //     // --------------------------------------------------------------------------
    //     }
    // var input3 = document.getElementById("values-dynamic_index");
    // input3.onfocus = function(){
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: input-in interaction
    //     log_input({itime: 2,message:"Input field 'Unlock by' focused in", register : log, level:1,type:"InputIn"});
    //     // --------------------------------------------------------------------------
    //     }
    // input3.onblur = function(){
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: input-out interaction
    //     log_input({itime: 2,message:"Input field 'Unlock by' focused out", register : log, level:1,type:"InputOut"});
    //     // --------------------------------------------------------------------------
    //     }

    // var input4 = document.getElementById("threshold-dynamic_index");
    // input4.onfocus = function(){
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: input-in interaction
    //     log_input({itime: 2,message:"Input field 'Threshold' focused in", register : log, level:1,type:"InputIn"});
    //     // --------------------------------------------------------------------------
    //     }
    // input4.onblur = function(){
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: input-out interaction
    //     log_input({itime: 2,message:"Input field 'Threshold' focused out", register : log, level:1,type:"InputOut"});
    //     // --------------------------------------------------------------------------
    //     }
    // var input_submit = document.getElementById('submit-btn-dynamic_index');
    // input_submit.onclick = function() {
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //           //Logging :: button-click interaction
    //           log_click({itime: 2,message:"Create element button clicked", register : log, level:1,type:"ButtonClick"});
    //           // --------------------------------------------------------------------------
    // }
    // var creation_area = document.getElementById('incr-creation-dynamic_index');
    // var created = false;
    // creation_area.onclick = function() {
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //           //Logging :: button-click interaction
    //           if(!created){log_click({itime: 2,message:"Creation area clicked (before creation)", register : log, level:1,type:"ImageClick"});}
    //           // --------------------------------------------------------------------------
    // }
    // var creation_area = document.getElementById('creation-area-title-dynamic_index');
    // creation_area.onclick = function() {
    //     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //     //Logging :: button-click interaction
    //     log_click({itime: 2,message:"Creation area title clicked", register : log, level:1,type:"TextClick"});
    //     // --------------------------------------------------------------------------
    // }
    // //document.querySelector('#submit-btn').disabled = true;

    // $('#formid-dynamic_index').submit(function(e){
    //     e.preventDefault();
    //     //alert(decodeURI($('#formid').serialize()));
    //     var json0 = JSON.parse('{"' + decodeURI($('#formid-dynamic_index').serialize()).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\+/g,' ').replace(/%24/g,'\$') + '"}');
    //     //alert(document.querySelector('#gtype').value);
    //     //alert(json0.title);

    //     if(json0.name == ""){
    //         alert("You should give a Description");
    //         return 0;
    //     }
    //     fetch('https://agmodule.herokuapp.com/api/' + document.querySelector('#gtype-dynamic_index').value + "/", { 
            
    //         // Adding method type 
    //         method: "POST", 
            
    //         // Adding body or contents to send 
    //         body: JSON.stringify(json0), 
            
    //         // Adding headers to the request 
    //         headers: { 
    //             "Content-type": "application/json; charset=UTF-8"
    //         } 
    //     }) 
        
    //     // Converting to JSON 
    //     .then(response0 => response0.json()) 
        
    //     // Displaying results to console 
    //     .then(function(json1){
    //         console.log(json1);
    //         alert("Element created successfully!");
    //         //document.querySelector('#submit-btn').disabled = true;
            
    //         //alert(json1.url + window.location.search);
    //         fetch(json1.url + "?user=dynamic_user&import_trackers=false")
    //         .catch(error => console.log("Error: " + error));
    //         fetch(json1.url + "?user=dynamic_user&import_trackers=false")
    //         .then(function (response1) {
    //             return response1.json();
    //         })
    //         .then(function (myJson) {
    //             document.querySelector("#incr-creation-dynamic_index").innerHTML = myJson.html;
    //             $(myJson.html).appendTo(document.body);   
    //             created=true; 
    //         })
    //         .catch(function (error) {
    //             console.log("Error: " + error);
    //         });
    //     });     
    // });    

    // fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (myJson) {
    //         //alert(myJson.mechanic_class);
    //         document.querySelector("#header-dev-dynamic_index").innerHTML = myJson.title;
    //         //document.querySelector("#dev-content").innerHTML = myJson.mechanic_class;
    //         if(myJson.mechanic_class == "Badge"){
    //             document.querySelector('#gtype-dynamic_index').value = "badges";
    //         }else if(myJson.mechanic_class == "Unlockable"){   
    //             document.querySelector('#gtype-dynamic_index').value = "unlockables";
    //         }else if(myJson.mechanic_class == "Challenge"){
    //             document.querySelector('#gtype-dynamic_index').value = "challenges";
    //         }
    //         if(document.querySelector('#gtype-dynamic_index').value == "unlockables"){
    //             document.querySelector("#unlock-elem-dynamic_index").innerHTML =   '<div class="row">'+
    //                                 '<div class="col-sm-7" style="background-color:white;">'+
    //                                     '<label for="locked_html">Locked Content:</label>'+
    //                                 '</div>'+
    //                                 '<div class="col-sm-3" style="background-color:white;">'+
    //                                     '<input type="text" name="locked_html" id="lck-html-dynamic_index" size="10"></p>'+
    //                                 '</div>'+
    //                             '</div>';
    //             var input5 = document.getElementById("lck-html-dynamic_index");
    //             input5.onfocus = function(){
    //                 // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //                 //Logging :: input-in interaction
    //                 log_input({itime: 2,message:"Input field 'Locked HTML' focused in", register : log, level:1,type:"InputIn"});
    //                 // --------------------------------------------------------------------------
    //                 }
    //             input5.onblur = function(){
    //                 // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //                 //Logging :: input-in interaction
    //                 log_input({itime: 2,message:"Input field 'Locked HTML' focused out", register : log, level:1,type:"InputOut"});
    //                 // --------------------------------------------------------------------------
    //                 }
    //         }else if(document.querySelector('#gtype-dynamic_index').value == "challenges"){

    //             document.querySelector("#unlock-elem-dynamic_index").innerHTML =   '<div class="row">'+
    //                                 '<div class="col-sm-7" style="background-color:white;">'+
    //                                     '<label for="reward_by">Reward By:</label>'+
    //                                 '</div>'+
    //                                 '<div class="col-sm-3" style="background-color:white;">'+
    //                                      '<select id="reward_by-dynamic_index" name="reward_by">'+
    //                                         '<option value="score">score</option>'+
    //                                         '<option value="level">level</option>'+
    //                                         '<option value="\$">$</option>'+
    //                                     '</select>'+
    //                                 '</div>'+
    //                                 '<div class="col-sm-7" style="background-color:white;">'+
    //                                     '<label for="reward_value">Reward Value:</label>'+
    //                                 '</div>'+
    //                                 '<div class="col-sm-3" style="background-color:white;">'+
    //                                     '<input type="text" name="reward_value" id="reward-value-dynamic_index" size="10"></p>'+
    //                                 '</div>'+
    //                             '</div>';
    //             var input5 = document.getElementById("reward-by-dynamic_index");
    //             input5.onfocus = function(){
    //                 // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //                 //Logging :: input-in interaction
    //                 log_input({itime: 2,message:"Input field 'Reward By' focused in", register : log, level:1,type:"InputIn"});
    //                 // --------------------------------------------------------------------------
    //             }
    //             input5.onblur = function(){
    //                 // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //                 //Logging :: input-in interaction
    //                 log_input({itime: 2,message:"Input field 'Reward By' focused out", register : log, level:1,type:"InputOut"});
    //                 // --------------------------------------------------------------------------
    //             }
    //             var input6 = document.getElementById("reward-value-dynamic_index");
    //             input5.onfocus = function(){
    //                 // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //                 //Logging :: input-in interaction
    //                 log_input({itime: 2,message:"Input field 'Reward Value' focused in", register : log, level:1,type:"InputIn"});
    //                 // --------------------------------------------------------------------------
    //             }
    //             input5.onblur = function(){
    //                 // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //                 //Logging :: input-in interaction
    //                 log_input({itime: 2,message:"Input field 'Reward Value' focused out", register : log, level:1,type:"InputOut"});
    //                 // --------------------------------------------------------------------------
    //             }

    //         }           
    //     })
    //     .catch(function (error) {
    //         console.log("Error: " + error);
    //     });




    //   