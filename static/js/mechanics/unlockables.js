
    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_locked_time();
    start_focus_time("main-content-unk");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------
    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-unk").innerHTML = myJson.title;
            var icon;
            var descr;
            var func;
            if(myJson.state){
                icon = myJson.icon;
                descr = myJson.by + ' is over ' + myJson.threshold;
                func = "loadGame(\'#game\',\'#ghtml\')";
            }else{
                icon = "https://agmodule.herokuapp.com/media/badge_icons/locked.png"
                descr = 'Increase ' + myJson.by + ' over ' + myJson.threshold + ' to unlock it';
                func = 'lockGame(\'' + descr + '\')';
            }
            document.querySelector("#ghtml").value = myJson.locked_html;
            document.querySelector("#icon").innerHTML = '<div class="card" style="width:100%; text-align:center; border: none;">' +
                                                                    '<div class="row no-gutters" style = "text-align:center;">' +
                                                                        
                                                                    '<div class="col-sm-12">' +
                                                                          '<div id = "game">' +
                                                                          '<a onclick="javascript:' + func + '" href="#">' +
                                                                          '<img id = "main-unlockable" class="card-img-top" src="' + icon + '" alt="Card image" style="width:30%;"></a></div>' +
                                                                    '</div>' +
                                                                          '<div class="col-sm-12" style="text-align:center;">' +
                                                                            '<div class="card-body" >' + 
                                                                                '<h3 id="name-unk-text" class="card-title" style = "text-align:center;">' + myJson.name + '</h3>' +
                                                                                '<p id="desc-unk-text" class="card-text" style = "text-align:center;"> ' + descr + ' </p>' +
                                                                            '</div>' +
                                                                            '<button id="myBtn" >See all unlockables</button>' +
                                                                          '</div>' +
                                                                    '</div><br>' +
                                                                  '</div>'  ;
                                                        
                        // Get the modal
            var modal = document.getElementById("myModal");
            // Get the button that opens the modal
            var btn = document.getElementById("myBtn");
            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];
            // When the user clicks the button, open the modal 
            var unlock = document.getElementById("main-unlockable");
            var txt1 = document.getElementById("name-unk-text");
            var txt2 = document.getElementById("desc-unk-text");
            
            txt1.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2, message:"Main unlockable name clicked", register : log, level:1,type:"TextClick"});
               // --------------------------------------------------------------------------
              }

            txt2.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Main unlockable description clicked", register : log, level:1,type:"TextClick"});
               // --------------------------------------------------------------------------
              }

            unlock.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Main unlockable icon clicked", register : log, level:1,type:"ImageClick"});
               // --------------------------------------------------------------------------
              }
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
              modal.style.display = "none";
               // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: modal-close interaction
              log_click({itime: 2,message:"Unlockables modal close (Click x button)", register : log, level:2,type:"ModalClose"});
              // --------------------------------------------------------------------------
            }
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = "none";
                // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: modal-close interaction
                log_click({itime: 2,message:"Unlockables modal close (Click outside modal)", register : log, level:2,type:"ModalClose"});
                // --------------------------------------------------------------------------
              }
            }  
            btn.onclick = function() {
               // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Open all unlockables button clicked", register : log, level:1,type:"ButtonClick"});
              // --------------------------------------------------------------------------
              modal.style.display = "block";

              document.querySelector("#badge-set").innerHTML = "";
              fetch("https://agmodule.herokuapp.com/api/unlockables/retrieve_for_user/dynamic_user") // WARNING: should be replaced by a concrete username
              .then(function (response) {
                  return response.json();
              })
              .then(function (myJson) {
                  //alert(myJson.results);
              
                  myJson.results.forEach(render_badge);
                  function render_badge(item, index) {
                    
                      var unlocked = item[1];
                      var icon;
                      var desc;
                      var func = "empty()";
                      var href = "#";
                
                      if(unlocked){
                        icon = item[0].icon;
                        descr = item[0].by + ' is over ' + item[0].threshold;
                        
                        href = "https://agmodule.herokuapp.com/preview/games/"+item[0].id+"/dynamic_user";
                        
                        
                        
                      }else{
                        icon = "https://agmodule.herokuapp.com/media/badge_icons/locked.png";
                        descr = 'Increase ' + item[0].by + ' over ' + item[0].threshold + ' to unlock it';
                        func = 'lockGame(\'' + descr + '\')';
                      }
                      document.querySelector("#badge-set").innerHTML +=   '<div class="card" style="width:100%; border: none;">' +
                                                                          '<div class="row no-gutters"  style="text-align:center;">' +
                                                                          '<div class="col-sm-4">' +
                                                                                '<a onclick="javascript:' + func + '" href="' + href + '">' +
                                                                                '<img id ="unlockable-set-unk-icon-' + index + '" class="card-img-top" src="' + icon + '" alt="Card image" style="width:30%;"></a>' +
                                                                          '</div>' +
                                                                                '<div class="col-sm-4" style="text-align:left;">' +
                                                                                  '<div class="card-body">' + 
                                                                                      '<h3 class="card-title" id="unlockable-set-unk-title-' + index + '">' + item[0].name + '</h3>' +
                                                                                      '<p class="card-text" id="unlockable-set-unk-descr-' + index + '"> ' + descr + ' </p>' +
                                                                                  '</div>' +
                                                                                '</div>' +
                                                                          '</div>' +
                                                                        '</div><br>';
                  }
                  myJson.results.forEach(function(item,index){
                    var tmp_img = document.getElementById("unlockable-set-unk-icon-" + index);
                    var tmp_txt1 = document.getElementById("unlockable-set-unk-descr-" + index);   
                    var tmp_txt2 = document.getElementById("unlockable-set-unk-title-" + index);              
                    tmp_img.onclick = function(){
                      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                      //Logging :: image-click interaction
                      log_click({itime: 2,message:"Unlockable icon clicked (unlockable " + index + " in unlockable set)", register : log, level:2,type:"ImageClick"});
                      // --------------------------------------------------------------------------
                      }
                    tmp_txt1.onclick = function(){
                        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                      //Logging :: text-click interaction
                      log_click({itime: 2,message:"Unlockable description clicked (unlockable " + index + " in unlockable set)", register : log, level:2,type:"TextClick"});
                      //alert("Main time:" + main_time());
                      // --------------------------------------------------------------------------
                    }
                    tmp_txt2.onclick = function(){
                      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                      //Logging :: text-click interaction
                      log_click({itime: 2,message:"Unlockable title clicked (unlockable " + index + " in unlockable set)", register : log, level:2,type:"TextClick"});
                      //alert("Main time:" + main_time());
                      // --------------------------------------------------------------------------
                    }
                  });                   
              })
              .catch(function (error) {
                  alert("User not found!");
                  console.log("Error: " + error);
              });
            }                         
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });

function loadGame(container_name, param_name){
  // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
  stop_locked_time();
  start_unlocked_time();
  // --------------------------------------------------------------------------
  document.querySelector(container_name).innerHTML = document.querySelector(param_name).value ;
   $( document.querySelector(param_name).value).appendTo(document.body); 
}

function lockGame(message){
  alert("Locked! \n" + message);
}

function empty(){};



