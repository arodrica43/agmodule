
  //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("snt-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",16);
    set_widget_defaults("#snt-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------

function log_img_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"User card clicked", register : log, level:1,type:"ImageClick"});
           // --------------------------------------------------------------------------
          };


document.querySelector("#snt-widget-handshake-dynamic_index").value = 1;

function followUser(uname,ids,from){
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 10, message:"Follow user button clicked", register : log, level:1,type:"ButtonClick"});
     // --------------------------------------------------------------------------

  /*switch(from){
      case 0: //Comes from search tab
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Follow " + uname + " button (search tab) clicked", register : log, level:1,type:"ButtonClick"});
        // --------------------------------------------------------------------------
        break;
      case 1: //Comes from modal
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Follow " + uname + " button (modal) clicked", register : log, level:2,type:"ButtonClick"});
        // --------------------------------------------------------------------------
        break;
    }*/

  if (document.getElementById(ids).innerHTML == "Follow"){
    fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/add_friend/" + uname)
    .then(function (response) {
        return response.text();
    })
    .then(function (answer) {
      if(answer == "OK"){
        //alert("You have added " + uname + " to your friends list");
          document.getElementById(ids).innerHTML = "Following";
          
          document.getElementById("follow-" + uname).innerHTML = "Following";
          //document.getElementById("friends-grid").innerHTML = "";
          //populateWithUsers(populateFriends,"");
      }
    })
    .catch(function (error) {
        console.log("Error: " + error);
    });
  }else if(document.getElementById(ids).innerHTML == "Following"){
      fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/del_friend/" + uname)
      .then(function (response) {
          return response.text();
      })
      .then(function (answer) {
        if(answer == "OK"){
          //alert("You have deleted " + uname + " from your friends list");
          document.getElementById(ids).innerHTML = "Follow";
          document.getElementById("follow-" + uname).innerHTML = "Follow";

          //document.getElementById("friends-grid").innerHTML = "";
          //populateWithUsers(populateFriends,"");
        }
      })
      .catch(function (error) {
          console.log("Error: " + error);
      });
  }
}

function emptyF(){
	console.log("click");
}

function populateSearch(item,index,follow_text){
   document.getElementById("search-users-grid").innerHTML += '<li class="profilecards_item">'+
                                                            '<div class="profilecard">'+
                                                              '<div class="profilecard" style=" height:400px;" onclick="log_img_click();">'+
                                                                  '<div class="profilecard_image"><img src="https://agmodule.herokuapp.com/media/social_icons/' + item.social_profile.image + '.png"  style="width:100%;"></div>'+
                                                                    '<div class="profilecard_content">'+
                                                                        '<h2><div class="user-name">' + item.user.username + '</div></h2>' +  
                                                                      '<p class="profilecard_text">' + item.social_profile.description + '</p>' +
                                                                    '</div>'+
                                                              '</div>'+
                                                              '<button class="btn profilecard_btn" onClick="followUser(\'' + item.user.username + '\',\'follow-' +  item.user.username + '\',0)" id = "follow-' + item.user.username  + '">' + follow_text + '</button>'+
                                                            '</div>'+
                                                          '</li>';  
}

function loadPopulateSearch(url){
  fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/")
  .then(function (response) {
      return response.json();
  })
  .then(function (myJson1) {
    /*document.querySelector("#profile-img").src = "https://agmodule.herokuapp.com/media/social_icons/" + myJson1.social_profile.image + ".png";
    document.querySelector("#profile-img").name = myJson1.social_profile.image;
    document.querySelector("#username").innerHTML = myJson1.user.username ;
    document.querySelector("#mydescr").innerHTML = myJson1.social_profile.description ;
        document.querySelector("#profile-img").onclick = function(){
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Profile image clicked", register : log, level:1,type:"ImageClick"});
        // --------------------------------------------------------------------------
    }
    document.querySelector("#username").onclick = function(){
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Username text clicked", register : log, level:1,type:"TextClick"});
        // --------------------------------------------------------------------------
    }
    document.querySelector("#mydescr").onclick = function(){
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Description text clicked", register : log, level:1,type:"TextClick"});
        // --------------------------------------------------------------------------
    }
    try{
      document.getElementById("avatar-" + myJson1.social_profile.image).style = "width:100%; opacity:1;";
    }catch(e){}
    */

    var friends =  myJson1.social_profile.data.friends;
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        document.getElementById("search-grid").innerHTML = "";
        document.getElementById("search-users-grid").innerHTML = "";
        var w =  window.innerWidth;
        //console.log(w);
        var fw = 6;
        if(w/16 < 40){
        	fw = 4;
        }else if(w/16 < 56){
        	fw = 5;
        }
        var top = Math.min( myJson.results.length, fw);
        for(var i = 0; i < top; i++){
            var follow_text = "";
            if(friends.includes(myJson.results[i].user.username)){
              follow_text = "Following";
            }else{
              follow_text = "Follow";
            }
            if( myJson.results[i].user.username != 'dynamic_user' ){
              populateSearch(myJson.results[i],i,follow_text);
            } 
        }
    })
    .catch(function (error) {
        console.log("Error: " + error);
    });
  })
  .catch(function (error) {
      console.log("Error: " + error);
  });
}


document.getElementById("snt-widget-dynamic_index").innerHTML += '<div id="Search">'+ // class="mytabcontent"
                                                              '<div id="search-scrollable-content">'+
                                                                '<ul class="profilecards" id="search-users-grid">'+
                                                                '</ul>'+
                                                              '</div>'+
                                                            '</div>';
loadPopulateSearch("https://agmodule.herokuapp.com/api/retrieve_users_search?uname_contains=");


