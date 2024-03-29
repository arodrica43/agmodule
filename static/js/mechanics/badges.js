
    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-bdg");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------
    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-bdg").innerHTML = myJson.title;
            
            var icon;
            var descr;
            if(myJson.state){
                icon = myJson.icon;
                descr = myJson.by + ' is over ' + myJson.threshold;
            }else{
                icon = "https://agmodule.herokuapp.com/media/badge_icons/locked.png"
                descr = 'Increase ' + myJson.by + ' over ' + myJson.threshold + ' to unlock it';
            }
            document.querySelector("#icon").innerHTML = '<div class="card" style="width:100%; text-align:center; border: none;">' +
                                                                    '<div class="row no-gutters" style = "text-align:center;">' +
                                                                        
                                                                    '<div class="col-sm-12">' +
                                                                          '<img id = "main-badge" class="card-img-top" src="' + icon + '" alt="Card image" style="width:30%;">' +
                                                                    '</div>' +
                                                                    '<div class="col-sm-12" style="text-align:center;">' +
                                                                      '<div class="card-body" >' + 
                                                                          '<h3 id="name-bdg-text" class="card-title" style = "text-align:center;">' + myJson.name + '</h3>' +
                                                                          '<p id="desc-bdg-text" class="card-text" style = "text-align:center;"> ' + descr + ' </p>' +
                                                                      '</div>' +
                                                                      '<button id="myBtn">See all badges</button>' +
                                                                    '</div>' +
                                                                    '</div><br>' +
                                                                  '</div>';                                       
            // Get the modal
            var modal = document.getElementById("myModal");
            // Get the button that opens the modal
            var btn = document.getElementById("myBtn");
            var bdge = document.getElementById("main-badge");
            var txt1 = document.getElementById("name-bdg-text");
            var txt2 = document.getElementById("desc-bdg-text");              
            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];
            txt1.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2, message:"Main badge name clicked", register : log, level:1,type:"TextClick"});
               // --------------------------------------------------------------------------
              }

            txt2.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Main badge description clicked", register : log, level:1,type:"TextClick"});
               // --------------------------------------------------------------------------
              }

            bdge.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Main badge icon clicked", register : log, level:1,type:"ImageClick"});
               // --------------------------------------------------------------------------
              }
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
              modal.style.display = "none";
               // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: modal-close interaction
              log_click({itime: 2,message:"Badges modal close (Click x button)", register : log, level:2,type:"ModalClose"});
              // --------------------------------------------------------------------------
            }
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = "none";
                // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: modal-close interaction
                log_click({itime: 2,message:"Badges modal close (Click outside modal)", register : log, level:2,type:"ModalClose"});
                // --------------------------------------------------------------------------
              }
            }  
            // When the user clicks the button, open the modal 
            btn.onclick = function() {
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Open all badges button clicked", register : log, level:1,type:"ButtonClick"});
              // --------------------------------------------------------------------------
              modal.style.display = "block";
              document.querySelector("#badge-set").innerHTML = "";
              fetch("https://agmodule.herokuapp.com/api/badges/retrieve_for_user/dynamic_user") // WARNING: should be replaced by a concrete username
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
                
                      if(unlocked){
                        icon = item[0].icon;
                        descr = item[0].by + ' is over ' + item[0].threshold;
                        
                      }else{
                        icon = "https://agmodule.herokuapp.com/media/badge_icons/locked.png";
                        descr = 'Increase ' + item[0].by + ' over ' + item[0].threshold + ' to unlock it';
                      }
                      document.querySelector("#badge-set").innerHTML += '<div class="card" style="width:100%; border: none;">' +
                                                                          '<div class="row no-gutters"  style="text-align:center;">' +
                                                                          '<div class="col-sm-4">' +
                                                                                '<img id ="badge-set-bdg-icon-' + index + '" class="card-img-top" src="' + icon + '" alt="Card image" style="width:30%;" >' +
                                                                          '</div>' +
                                                                                '<div class="col-sm-4" style="text-align:left;">' +
                                                                                  '<div class="card-body">' + 
                                                                                      '<h3 class="card-title" id="badge-set-bdg-title-' + index + '">' + item[0].name + '</h3>' +
                                                                                      '<p class="card-text" id="badge-set-bdg-descr-' + index + '"> ' + descr + ' </p>' +
                                                                                  '</div>' +
                                                                                '</div>' +
                                                                          '</div>' +
                                                                        '</div><br>';
                  }
                  myJson.results.forEach(function(item,index){
                    var tmp_img = document.getElementById("badge-set-bdg-icon-" + index);
                    var tmp_txt1 = document.getElementById("badge-set-bdg-descr-" + index);   
                    var tmp_txt2 = document.getElementById("badge-set-bdg-title-" + index);              
                    tmp_img.onclick = function(){
                      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                      //Logging :: image-click interaction
                      log_click({itime: 2,message:"Badge icon clicked (badge " + index + " in badge set)", register : log, level:2,type:"ImageClick"});
                      // --------------------------------------------------------------------------
                      }
                    tmp_txt1.onclick = function(){
                        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                      //Logging :: text-click interaction
                      log_click({itime: 2,message:"Badge description clicked (badge " + index + " in badge set)", register : log, level:2,type:"TextClick"});
                      //alert("Main time:" + main_time());
                      // --------------------------------------------------------------------------
                    }
                      tmp_txt2.onclick = function(){
                        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                      //Logging :: text-click interaction
                      log_click({itime: 2,message:"Badge title clicked (badge " + index + " in badge set)", register : log, level:2,type:"TextClick"});
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