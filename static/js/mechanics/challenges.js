

    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-chl");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------

    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-chl").innerHTML = myJson.title;
            var icon;
            var descr;
            if(myJson.state){
                icon = myJson.icon;
                descr = 'Your ' + myJson.by + ' is over ' + myJson.threshold;
            }else{
                icon = "https://agmodule.herokuapp.com/media/challenge_icons/locked.png"
                descr = 'Increase ' + myJson.by + ' over ' + myJson.threshold + ' to unlock this challenge';
            }
            document.querySelector("#icon").innerHTML = '<div class="card" style="width:100%; text-align:center; border: none;">' +
                                                                    '<div class="row no-gutters" style = "text-align:center;">' +
                                                                        
                                                                    '<div class="col-sm-12">' +
                                                                          '<img id = "main-challenge" class="card-img-top" src="' + icon + '" alt="Card image" style="width:30%;" >' +
                                                                    '</div>' +
                                                                          '<div class="col-sm-12" style="text-align:center;">' +
                                                                            '<div class="card-body" >' + 
                                                                                '<h3 id="name-chl-text" class="card-title" style = "text-align:center;">' + myJson.name + '</h3>' +
                                                                                '<p id="desc-chl-text" class="card-text" style = "text-align:center;"> ' + descr + ' </p>' +
                                                                            '</div>' +
                                                                            '<button id="myBtn">See all challenges</button>' +
                                                                          '</div>' +
                                                                    '</div><br>' +
                                                                  '</div>'  ;                               
                        // Get the modal
            var modal = document.getElementById("myModal");

            // Get the button that opens the modal
            var btn = document.getElementById("myBtn");
            var chllge = document.getElementById("main-challenge");
            var txt1 = document.getElementById("name-chl-text");
            var txt2 = document.getElementById("desc-chl-text");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            txt1.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2, message:"Main challenge name clicked", register : log, level:1,type:"TextClick"});
               // --------------------------------------------------------------------------
              }

            txt2.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Main challenge description clicked", register : log, level:1,type:"TextClick"});
               // --------------------------------------------------------------------------
              }

            chllge.onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Main challenge icon clicked", register : log, level:1,type:"ImageClick"});
               // --------------------------------------------------------------------------
              }
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
              modal.style.display = "none";
               // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: modal-close interaction
              log_click({itime: 2,message:"Challenges modal close (Click x button)", register : log, level:2,type:"ModalClose"});
              // --------------------------------------------------------------------------
            }
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = "none";
                // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: modal-close interaction
                log_click({itime: 2,message:"Challenges modal close (Click outside modal)", register : log, level:2,type:"ModalClose"});
                // --------------------------------------------------------------------------
              }
            }  

            // When the user clicks the button, open the modal 
            btn.onclick = function() {
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //Logging :: button-click interaction
              log_click({itime: 2,message:"Open all challenges button clicked", register : log, level:1,type:"ButtonClick"});
              // --------------------------------------------------------------------------
              modal.style.display = "block";

              document.querySelector("#challenge-set").innerHTML = "";
              fetch("https://agmodule.herokuapp.com/api/challenges/retrieve_for_user/dynamic_user") // WARNING: should be replaced by a concrete username
              .then(function (response) {
                  return response.json();
              })
              .then(function (myJson) {
                  //alert(myJson.results);
              
                  myJson.results.forEach(render_challenge);
                  function render_challenge(item, index) {
                    
                      var unlocked = item[1];
                      var icon;
                      var desc;
                
                      if(unlocked){
                        icon = item[0].icon;
                        descr = 'Your ' + item[0].by + ' is over ' + item[0].threshold;
                        
                      }else{
                        icon = "https://agmodule.herokuapp.com/media/challenge_icons/locked.png";
                        descr = 'Increase ' + item[0].by + ' over ' + item[0].threshold + ' to unlock this challenge';
                        //alert(descr);
                      }
                      document.querySelector("#challenge-set").innerHTML += '<div class="card" style="width:100%; border: none;">' +
                                                                          '<div class="row no-gutters"  style="text-align:center;">' +
                                                                          '<div class="col-sm-4">' +
                                                                                '<img id ="challenge-set-chl-icon-' + index + '" class="card-img-top" src="' + icon + '" alt="Card image" style="width:30%;" >' +
                                                                          '</div>' +
                                                                                '<div class="col-sm-4" style="text-align:left;">' +
                                                                                  '<div class="card-body">' + 
                                                                                      '<h3 class="card-title" id="challenge-set-chl-title-' + index + '">' + item[0].name + '</h3>' +
                                                                                      '<p class="card-text" id="challenge-set-chl-descr-' + index + '"> ' + descr + ' </p>' +
                                                                                  '</div>' +
                                                                                '</div>' +
                                                                          '</div>' +
                                                                        '</div><br>';
                  }
                   myJson.results.forEach(function(item,index){
                      var tmp_img = document.getElementById("challenge-set-chl-icon-" + index);
                      var tmp_txt1 = document.getElementById("challenge-set-chl-descr-" + index);   
                      var tmp_txt2 = document.getElementById("challenge-set-chl-title-" + index);              
                      tmp_img.onclick = function(){
                        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                        //Logging :: image-click interaction
                        log_click({itime: 2,message:"Challenge icon clicked (challenge " + index + " in challenge set)", register : log, level:2,type:"ImageClick"});
                        // --------------------------------------------------------------------------
                        }
                      tmp_txt1.onclick = function(){
                         // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                        //Logging :: text-click interaction
                        log_click({itime: 2,message:"Challenge description clicked (challenge " + index + " in challenge set)", register : log, level:2,type:"TextClick"});
                        //alert("Main time:" + main_time());
                        // --------------------------------------------------------------------------
                      }
                        tmp_txt2.onclick = function(){
                         // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                        //Logging :: text-click interaction
                        log_click({itime: 2,message:"Challenge title clicked (challenge " + index + " in challenge set)", register : log, level:2,type:"TextClick"});
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



