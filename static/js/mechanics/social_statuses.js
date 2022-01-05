
//INTERACTION INIT -----------------------------------------------------------------------
  //Dynamic property :: Log tracking functions
  include-base-tracking
  include-onclick-tracking
  start_main_time();
  start_focus_time("main-content-sstat");
  start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
  // ---------------------------------------------------------------------------------------

// LEADERBOARDS EMBEDDING

document.querySelector("#user-status-data").innerHTML = '<div class = "container-fluid" id="prof-image-stat" style="background:whitesmoke;margin-top:20px;padding-top:20px;padding-bottom:20px;">'+
                                                            '<div class="row">'+
                                                                '<div class="col-md-4" >'+
                                                                    '<div id="following-label"  style="text-align:center;"><b></b></div>'+
                                                                    '<div id="following" style="text-align:center;" ></div>'+
                                                                '</div>'+
                                                                '<div class="col-md-4">'+
                                                                    '<div id="followers-label"  style="text-align:center;" ><b></b></div>'+
                                                                    '<div id="followers"  style="text-align:center;"></div>'+
                                                                '</div>'+
                                                                '<div class="col-md-4">'+
                                                                    '<div id="views-label"  style="text-align:center;"><b></b></div>'+
                                                                        '<div id="views"  style="text-align:center;"></div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<hr>'+
                                                            '<div class="row">'+
                                                                '<div class="col-md-4">'+
                                                                    '<div id="score-label"  style="text-align:center;"><b></b></div>'+
                                                                    '<div id="score" style="text-align:center;" ></div>'+
                                                                '</div>'+
                                                                '<div class="col-md-4">'+
                                                                    '<div id="level-label"  style="text-align:center;" ><b></b></div>'+
                                                                    '<div id="level"  style="text-align:center;"></div>'+
                                                                '</div>'+
                                                                '<div class="col-md-4">'+
                                                                    '<div id="coin-label"  style="text-align:center;"><b></b></div>'+
                                                                    '<div id="coin"  style="text-align:center;"></div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>';

document.querySelector("#tab-container-content").innerHTML = '<div class="row">'+
                                                                    '<div class="mytab" style="width:100%;" id ="tabbuttons">'+
                                                                    '</div>'+
                                                                '</div>';

document.querySelector("#tabbuttons").innerHTML =  '<button class="mytablinks" onclick="openTab(event, \'TopFollowed\')"  style="width:16.666%; height:100px; ">Top Socializer</button>'+
                                                    '<button class="mytablinks" onclick="openTab(event, \'TopViews\')" style="width:16.666%;height:100px;">Top Popular</button>';

// document.querySelector("#scrollable-content-friendly").onscroll = function(){
//             // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
//             //Logging :: button-click interaction
//             log_click({itime: 2,message:"Scrolling 'TopFriendly' leaderboard", register : log, level:1,type:"Scroll"});
//             // --------------------------------------------------------------------------
//         }
document.querySelector("#scrollable-content-followed").onscroll = function(){
            // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
            //Logging :: button-click interaction
            log_click({itime: 2,message:"Scrolling 'TopFollowed' leaderboard", register : log, level:1,type:"Scroll"});
            // --------------------------------------------------------------------------
        }
document.querySelector("#scrollable-content-views").onscroll = function(){
            // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
            //Logging :: button-click interaction
            log_click({itime: 2,message:"Scrolling 'TopViewed' leaderboard", register : log, level:1,type:"Scroll"});
            // --------------------------------------------------------------------------
        }
// document.querySelector("#scrollable-content-score").onscroll = function(){
//             // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
//             //Logging :: button-click interaction
//             log_click({itime: 2,message:"Scrolling 'TopScore' leaderboard", register : log, level:1,type:"Scroll"});
//             // --------------------------------------------------------------------------
//         }
// document.querySelector("#scrollable-content-level").onscroll = function(){
//             // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
//             //Logging :: button-click interaction
//             log_click({itime: 2,message:"Scrolling 'TopLevel' leaderboard", register : log, level:1,type:"Scroll"});
//             // --------------------------------------------------------------------------
//         }
// document.querySelector("#scrollable-content-coin").onscroll = function(){
//             // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
//             //Logging :: button-click interaction
//             log_click({itime: 2,message:"Scrolling 'TopCoins' leaderboard", register : log, level:1,type:"Scroll"});
//             // --------------------------------------------------------------------------
//         }
//document.querySelector("#incr-top-friendly").innerHTML = "En manteniment"
document.querySelector("#incr-top-followed").innerHTML = "En manteniment"
document.querySelector("#incr-top-views").innerHTML = "En manteniment"
// document.querySelector("#incr-top-score").innerHTML = "En manteniment"
// document.querySelector("#incr-top-level").innerHTML = "En manteniment"
// document.querySelector("#incr-top-coin").innerHTML = "En manteniment"

// fetch("https://agmodule.herokuapp.com/api/g_mechanics/14/?user=dynaimic_user&show_title=false&dynamic_index=friendly")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (myJson) {
//         document.querySelector("#incr-top-friendly").innerHTML = (myJson.html);
//         $(myJson.html).appendTo(document.body);    
//     })
//     .catch(function (error) {
//         console.log("Error: " + error);
//     });

fetch("https://agmodule.herokuapp.com/api/g_mechanics/132/?user=dynaimic_user&show_title=false&dynamic_index=followed")
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    document.querySelector("#incr-top-followed").innerHTML = (myJson.html);
                    $(myJson.html).appendTo(document.body);    
                })
                .catch(function (error) {
                    console.log("Error: " + error);
                });
fetch("https://agmodule.herokuapp.com/api/g_mechanics/133/?user=dynaimic_user&show_title=false&dynamic_index=following")
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (myJson) {
                            document.querySelector("#incr-top-views").innerHTML = (myJson.html);
                            $(myJson.html).appendTo(document.body);    
                        })
                        .catch(function (error) {
                            console.log("Error: " + error);
                        });
// fetch("https://agmodule.herokuapp.com/api/g_mechanics/11/?user=dynaimic_user&show_title=false&dynamic_index=score")
//                             .then(function (response) {
//                                 return response.json();
//                             })
//                             .then(function (myJson) {
//                                 document.querySelector("#incr-top-score").innerHTML = (myJson.html);
//                                 $(myJson.html).appendTo(document.body);    
//                             })
//                             .catch(function (error) {
//                                 console.log("Error: " + error);
//                             });
// fetch("https://agmodule.herokuapp.com/api/g_mechanics/12/?user=dynaimic_user&show_title=false&dynamic_index=level")
//                         .then(function (response) {
//                             return response.json();
//                         })
//                         .then(function (myJson) {
//                             document.querySelector("#incr-top-level").innerHTML = (myJson.html);
//                             $(myJson.html).appendTo(document.body);    
//                         })
//                         .catch(function (error) {
//                             console.log("Error: " + error);
//                         });
//  fetch("https://agmodule.herokuapp.com/api/g_mechanics/13/?user=dynaimic_user&show_title=false&dynamic_index=coin")
//                         .then(function (response) {
//                             return response.json();
//                         })
//                         .then(function (myJson) {
//                             document.querySelector("#incr-top-coin").innerHTML = (myJson.html);
//                             $(myJson.html).appendTo(document.body);    
//                         })
//                         .catch(function (error) {
//                             console.log("Error: " + error);
//                         });

    fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#prof-image-stat").innerHTML = '<hr><img id = "profile-image-stat" src="https://agmodule.herokuapp.com/media/avatars/' + myJson.social_profile.image + '.png" id="friend-profile-img" />'+
                                                                '<h2 id="uname-stat" style="margin-top:30px; text-align:center;"></h2><hr>';
            document.querySelector("#following-label").innerHTML = "<b>Following</b>";
            document.querySelector("#followers-label").innerHTML = "<b>Followers</b>";
            document.querySelector("#views-label").innerHTML = "<b>Views</b>";
            document.querySelector("#score-label").innerHTML = "<b>Score</b>";
            document.querySelector("#level-label").innerHTML = "<b>Level</b>";
            document.querySelector("#coin-label").innerHTML = "<b>$</b>";

            document.querySelector("#uname-stat").innerHTML = myJson.user.username;
            document.querySelector("#profile-image-stat").src = "https://agmodule.herokuapp.com/media/avatars/" + myJson.social_profile.image + ".png";
            document.querySelector("#following").innerHTML = myJson.social_profile.data.friends.length;
            document.querySelector("#followers").innerHTML = myJson.social_profile.data.followers;
            document.querySelector("#views").innerHTML = myJson.social_profile.data.views;
            document.querySelector("#score").innerHTML = myJson.gamer_profile.data.score;
            document.querySelector("#level").innerHTML = myJson.gamer_profile.data.level;
            document.querySelector("#coin").innerHTML = myJson.gamer_profile.data.$;

            document.querySelector("#following-label").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Label 'Following' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#followers-label").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Label 'Followers' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#views-label").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Label 'Views' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#score-label").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Label 'Score' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#level-label").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Label 'Level' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#coin-label").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Label '$' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }

            document.querySelector("#uname-stat").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Username text clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#profile-image-stat").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Avatar image clicked", register : log, level:1,type:"ImageClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#following").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Value of 'Following' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#followers").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Value of 'Followers' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#views").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Value of 'Views' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#score").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Value of 'Score' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#level").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Value of 'Level' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
            document.querySelector("#coin").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Value of '$' clicked", register : log, level:1,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });

function openTab(evt, tabName) {

  // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 1, message:"Tab button '" + tabName + "' clicked", register : log, level:1,type:"ButtonClick"});
    // --------------------------------------------------------------------------

  var i, mytabcontent, mytablinks;
  mytabcontent = document.getElementsByClassName("mytabcontent");
  for (i = 0; i < mytabcontent.length; i++) {
    mytabcontent[i].style.display = "none";
  }
  mytablinks = document.getElementsByClassName("mytablinks");
  for (i = 0; i < mytablinks.length; i++) {
    mytablinks[i].className = mytablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-pts").innerHTML = myJson.title;    
            document.querySelector("#comp").value = myJson.competitiveness;  

        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
 


      