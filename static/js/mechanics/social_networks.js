
//INTERACTION INIT -----------------------------------------------------------------------
  //Dynamic property :: Log tracking functions
  include-base-tracking
  include-onclick-tracking
  start_main_time();
  start_focus_time("main-content-snet");
  start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
  // ---------------------------------------------------------------------------------------


document.querySelector("#friend-profile-img").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Friend profile image (profile modal) clicked", register : log, level:2,type:"ImageClick"});
                // --------------------------------------------------------------------------
            }
document.querySelector("#friend-username").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Friend profile username (profile modal) clicked", register : log, level:2,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
document.querySelector("#friend-descr").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Friend profile description (profile modal) clicked", register : log, level:2,type:"TextClick"});
                // --------------------------------------------------------------------------
            }
document.querySelector("#description-input").onfocus = function(){
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: input-in interaction
        log_input({itime: 2,message:"Input field 'Description' (settings modal) focused in", register : log, level:2,type:"InputIn"});
        // --------------------------------------------------------------------------
        }
document.querySelector("#description-input").onblur = function(){
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: input-out interaction
    log_input({itime: 2,message:"Input field 'Description' (settings modal) focused out", register : log, level:2,type:"InputOut"});
    // --------------------------------------------------------------------------
    }
document.querySelector("#show-friends-of-friends-list").onclick = function(){
              // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 1, message:"Show friends of friend list button (profile modal) clicked", register : log, level:2,type:"ButtonClick"});
                // --------------------------------------------------------------------------
            }

    

function saveProfile(){
   // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 1, message:"Save profile button (settings modal) clicked", register : log, level:2,type:"ButtonClick"});
    // --------------------------------------------------------------------------
  document.querySelector("#description-input").value = document.querySelector("#description-input").value.replace(/\'/g," ");
  fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/edit_social_profile?new_image=" + document.querySelector("#profile-img").name + "&new_description=" + document.querySelector("#description-input").value)
  .then(function (response) {
      return response.json();
  })
  .then(function (myJson) {
    document.querySelector("#mydescr").innerHTML = document.querySelector("#description-input").value; 
  })
  .catch(function (error) {
      console.log("Error: " + error);
  });
  var modal = document.getElementById("settingsModal");
  modal.style.display = "none";
}

function selectAvatar(name){
   // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
  //Logging :: button-click interaction
  log_click({itime: 1, message:"Select avatar " + name + " button (settings modal) clicked", register : log, level:2,type:"ButtonClick"});
  // --------------------------------------------------------------------------
  avatars = document.querySelectorAll("img[id*='avatar']")
  console.log(avatars);
  
  for(var i = 0; i < avatars.length; i++){
    try{
       document.getElementById("avatar-" + avatars[i].name).style = "width:80%;";
    }catch(err){
      console.log(avatars[i]);
    }
  }
  console.log(name);
  document.getElementById("avatar-" + name).style = "width:100%; opacity:1;";
  document.querySelector("#profile-img").src = "https://agmodule.herokuapp.com/media/avatars/" + name + ".png";
  document.querySelector("#profile-img").name = name;
}

function followUser(uname,ids,from){

  switch(from){
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
    }

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
          document.getElementById("friends-grid").innerHTML = "";
          populateWithUsers(populateFriends,"");
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

          document.getElementById("friends-grid").innerHTML = "";
          populateWithUsers(populateFriends,"");
        }
      })
      .catch(function (error) {
          console.log("Error: " + error);
      });
  }
}

function updateUsers() {
  //alert(document.getElementById("user-search-bar").value);
  var x = document.querySelector(".user-search-bar").value;
  loadPopulateSearch("https://agmodule.herokuapp.com/api/retrieve_users_search?uname_contains=" + x);
}

function populateFriendsOfFriends(item,index,follow_text){
  document.getElementById("friend-friends-grid").innerHTML += '<button class="card shadow-1" style="" onclick="showProfileModal(\'' + item[1].username + '\',\'' + item[0].image + '\',\'' + item[0].description + '\',\'' + follow_text + '\',2)">'+
                                                              '<div class="container-fluid" style="width:100%;">'+    
                                                                '<div class="row">'+
                                                                  '<div class="col-sm-3" ><img src="https://agmodule.herokuapp.com/media/avatars/' + item[0].image + '.png" id="profile-img" style="min-width:69px;width:70px;height:69px;" /></div>'+
                                                                  '<div class="col-sm-9 " style="text-align:center;font-size: calc(2rem + 1vw);padding-top:10px; padding-right:30px;">' + item[1].username + '</div>'+
                                                                '</div>'+
                                                              '</div>'+       
                                                            '</button>';  
}

function populateSearch(item,index,follow_text){
   document.getElementById("search-users-grid").innerHTML += '<li class="profilecards_item">'+
                                                            '<div class="profilecard">'+
                                                              '<div class="profilecard" style=" height:500px; cursor: pointer;" onclick="showProfileModal(\'' + item.user.username + '\',\'' + item.social_profile.image + '\',\'' + item.social_profile.description + '\',\'dynamic_follow\',1)">'+
                                                                  '<div class="profilecard_image"><img src="https://agmodule.herokuapp.com/media/avatars/' + item.social_profile.image + '.png"  style="width:100%;"></div>'+
                                                                    '<div class="profilecard_content">'+
                                                                        '<h2><div class="user-name">' + item.user.username + '</div></h2>' +  
                                                                      '<p class="profilecard_text">' + item.social_profile.description + '</p>' +
                                                                    '</div>'+
                                                              '</div>'+
                                                              '<button class="btn profilecard_btn" onClick="followUser(\'' + item.user.username + '\',\'follow-' +  item.user.username + '\',0)" id = "follow-' + item.user.username  + '">' + follow_text + '</button>'+
                                                            '</div>'+
                                                          '</li>';  
}

function populateFriends(item,index){
  document.getElementById("friends-grid").innerHTML += '<button class="card shadow-1" style="" onclick="showProfileModal(\'' + item[1].username + '\',\'' + item[0].image + '\',\'' + item[0].description + '\',\'Following\',0)">'+
                                                      '<div class="container-fluid" style="width:100%;">'+    
                                                        '<div class="row">'+
                                                          '<div class="col-sm-3" ><img src="https://agmodule.herokuapp.com/media/avatars/' + item[0].image + '.png" id="profile-img" style="min-width:69px;width:70px;height:69px;" /></div>'+
                                                          '<div class="col-sm-9 " style="text-align:center;font-size: calc(2rem + 1vw);padding-top:10px; padding-right:30px;">' + item[1].username + '</div>'+
                                                        '</div>'+
                                                      '</div>'+       
                                                    '</button>';              
}

function populateWithUsers(how, extra_args){
  fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/retrieve_friends" + extra_args)
  .then(function (response) {
      return response.json();
  })
  .then(function (myJson) {
      var friends = myJson.friends;
      friends.forEach(how);          
  })
  .catch(function (error) {
      console.log("Error: " + error);
  });
}

function openTab(evt, tabName) {
  // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 1, message:"Tab button '" + tabName + "' clicked", register : log, level:1,type:"ButtonClick"});
    // --------------------------------------------------------------------------

  if(tabName == "Profile"){
    document.getElementById("friends-grid").innerHTML = "";
    populateWithUsers(populateFriends,"");
  }
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


function loadPopulateSearch(url){
  fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/")
  .then(function (response) {
      return response.json();
  })
  .then(function (myJson1) {
    document.querySelector("#profile-img").src = "https://agmodule.herokuapp.com/media/avatars/" + myJson1.social_profile.image + ".png";
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
    }catch(e){/*Nothing*/}
    var friends =  myJson1.social_profile.data.friends;
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        document.getElementById("search-grid").innerHTML = "";
        document.getElementById("search-users-grid").innerHTML = "";
        for(var i = 0; i < myJson.results.length; i++){
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

function showSettingsModal() {
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
      //Logging :: button-click interaction
      log_click({itime: 1, message:"Open settings button clicked", register : log, level:1,type:"ButtonClick"});
      // --------------------------------------------------------------------------
    document.querySelector("#description-input").value = document.querySelector("#mydescr").innerHTML;
    var modal = document.getElementById("settingsModal");
    // Get the <span> element that closes the modal
    var span = document.getElementById("close");
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
      //Logging :: button-click interaction
      log_click({itime: 1, message:"Settings modal close (Click x button)", register : log, level:2,type:"ModalClose"});
      // --------------------------------------------------------------------------
      
      modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: modal-close interaction
        log_click({itime: 1,message:"Settings modal close (Click outside modal)", register : log, level:2,type:"ModalClose"});
        // --------------------------------------------------------------------------
        modal.style.display = "none";
      }
    }
    modal.style.display = "block";
}

  function showProfileModal(uname,image,descr,follow_text,from){

    switch(from){
      case 0: //Comes from friends list
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Open " + uname + " profile button (friends list) clicked", register : log, level:2,type:"ButtonClick"});
        // --------------------------------------------------------------------------
        break;
      case 1: //Comes from search tab
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Open " + uname + " profile button (search tab) clicked", register : log, level:2,type:"ButtonClick"});
        // --------------------------------------------------------------------------
        break;
      case 2: //Comes from friends of friends
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Open " + uname + " profile button (friends of friends list) clicked", register : log, level:3,type:"ButtonClick"});
        // --------------------------------------------------------------------------
        break;
    }
    

    var modal = document.getElementById("profileModal");
    // Get the <span> element that closes the modal
    var span = document.getElementById("close1");
      // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
      //Logging :: button-click interaction
      log_click({itime: 1, message:"Friend profile modal close (Click x button)", register : log, level:2,type:"ModalClose"});
      // --------------------------------------------------------------------------
      modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
         // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: modal-close interaction
        log_click({itime: 1,message:"Friend profile modal close (Click outside modal)", register : log, level:2,type:"ModalClose"});
        // --------------------------------------------------------------------------
        modal.style.display = "none";
      }
    }
    document.getElementById("friend-friends-grid").innerHTML = "";
    document.querySelector("#friend-username").innerHTML = uname;
    document.querySelector("#friend-profile-img").src = "https://agmodule.herokuapp.com/media/avatars/" + image + ".png";
    document.querySelector("#friend-descr").innerHTML = descr;
    if(follow_text == 'dynamic_follow'){
      follow_text =  document.getElementById("follow-" + uname).innerHTML;
    }
    document.querySelector("#friend-friend-follow").innerHTML = follow_text;
    document.querySelector("#friend-friend-follow").onclick = function followEvent(){
      followUser(uname,'friend-friend-follow',1);
    }

    fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/retrieve_friends")
      .then(function (response) {
          return response.json();
      })
      .then(function (myJson1) {
          var myfriends = myJson1.friends;
              fetch('https://agmodule.herokuapp.com/api/gamers/' + uname + '/retrieve_friends')
              .then(function (response) {
                  return response.json();
              })
              .then(function (myJson) {
                      var friend_friends = myJson.friends;  
                      for(var i = 0; i < friend_friends.length; i++){
                            funame = friend_friends[i][1].username;
                            var follow_text = "";
                            for(var j = 0; j < myfriends.length;j++){   
                                if('dynamic_user' == funame){
                                  follow_text = "---";
                                  break;
                                }else if(myfriends[j][1].username == funame){
                                  follow_text = "Following";
                                  break;
                                }else{
                                  follow_text = "Follow";
                                }
                            }
                            populateFriendsOfFriends(friend_friends[i],i,follow_text);
                      }
                      document.getElementById("profileModal").style.display = "block";
              })
              .catch(function (error) {
                  console.log("Error: " + error);
              });          
      })
      .catch(function (error) {
          console.log("Error: " + error);
      });
    }

document.getElementById("main-content-snet").innerHTML =  '<div style="text-align:center;">'+
                                                              '<h2 id = "header-net"></h2>'+
                                                          '</div>'+
                                                          '<div class="mytab">'+
                                                                '<button class="mytablinks" onclick="openTab(event, \'Profile\')" id="defaultOpen" style="width:50%; max-height:100px; min-width:50px;"><img src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/19339625881548233621-512.png" style="width:20%;min-width:20px;min-height:20px;max-width:80px;"/></button>'+
                                                                '<!-- <button class="mytablinks" onclick="openCity(event, \'Paris\')" style="width:33.333%;max-height:100px; min-width:50px;"><img src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/16908487151582799501-512.png" style="width:20%;min-width:20px;min-height:20px;"/></button> -->'+
                                                                '<button class="mytablinks" onclick="openTab(event, \'Search\')" style="width:50%;max-height:100px; min-width:50px;"><img src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/13416400251535694869-512.png" style="width:20%;min-width:20px;min-height:20px;max-width:80px;"/></button>'+
                                                            '</div>'+
                                                            '<div id="Profile" class="mytabcontent" style="text-align:center;">'+
                                                                '<div style="width:100%; text-align:right;padding-top:20px;padding-right:20px;">'+ 
                                                                  '<a id="link-ep" href="#" onclick="showSettingsModal()" style="width:10%;">'+
                                                                    '<img src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/11818001221556279759-512.png" id="profile-edit" style="width:4%;" />'+
                                                                  '</a>'+
                                                                '</div>'+
                                                                '<img src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/19339625881548233621-512.png" name="diamond" id="profile-img" style="width:20%;" />'+
                                                                '<br><br>'+
                                                                '<h2 id="username" style="text-align:center;"></h2>'+
                                                                '<hr>'+
                                                                  '<div id="mydescr"></div>'+
                                                                '<hr>'+
                                                                  '<button id="show-friends-list-dropdown-button" data-toggle="collapse" data-target="#friends" class="btn btn-primary" style="text-align:center; width:100%; background: #2C2C2C; border-color:#2C2C2C;">Friends List</button>'+
                                                                  '<div id="friends" class="collapse" style="text-align:center;">'+
                                                                    '<br>'+
                                                                    '<div id="scrollable-content">'+
                                                                        '<div class="all">'+
                                                                          '<div class="cards" id = "friends-grid">'+        
                                                                          '</div>'+
                                                                        '</div>'+              
                                                                    '</div>'+
                                                                  '</div>'+
                                                            '</div>'+
                                                            '<div id="Search" class="mytabcontent">'+
                                                              '<div style= "height:66px; text-align:center;padding-top:10px;">'+
                                                                  '<input id="search-input-field" type="text" class="user-search-bar" placeholder="Search friends..." name="search2" oninput="updateUsers()" value="">'+
                                                              '</div>'+
                                                              '<main class="grid" id="search-grid">'+
                                                              '</main>'+
                                                              '<div id="search-scrollable-content">'+
                                                                '<ul class="profilecards" id="search-users-grid">'+
                                                                '</ul>'+
                                                              '</div>'+
                                                            '</div>'+
                                                          '</div>';
document.querySelector("#show-friends-list-dropdown-button").onclick = function(){
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: button-click interaction
        log_click({itime: 1, message:"Open friends list button clicked", register : log, level:1,type:"ButtonClick"});
        // --------------------------------------------------------------------------
    }
document.querySelector("#search-input-field").onfocus = function(){
        // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: input-in interaction
        log_input({itime: 2,message:"Input field 'Search Users' focused in", register : log, level:2,type:"InputIn"});
        // --------------------------------------------------------------------------
        }
document.querySelector("#search-input-field").onblur = function(){
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: input-out interaction
    log_input({itime: 2,message:"Input field 'Search Users' focused out", register : log, level:2,type:"InputOut"});
    // --------------------------------------------------------------------------
    }
document.querySelector("#search-scrollable-content").onscroll = function(){
            // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
            //Logging :: button-click interaction
            log_click({itime: 2,message:"Scrolling 'Search' content", register : log, level:2,type:"Scroll"});
            // --------------------------------------------------------------------------
        }
document.querySelector("#scrollable-content").onscroll = function(){
            // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
            //Logging :: button-click interaction
            log_click({itime: 2,message:"Scrolling 'Friends list' content", register : log, level:2,type:"Scroll"});
            // --------------------------------------------------------------------------
        }
document.querySelector("#friend-scrollable-content").onscroll = function(){
            // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
            //Logging :: button-click interaction
            log_click({itime: 2,message:"Scrolling 'Friends of friend list' content", register : log, level:3,type:"Scroll"});
            // --------------------------------------------------------------------------
        }
document.getElementById("defaultOpen").click();
loadPopulateSearch("https://agmodule.herokuapp.com/api/retrieve_users_search?uname_contains=");
fetch("called_mechanic_url")
.then(function (response) {
    return response.json();
})
.then(function (myJson) {
    document.querySelector("#header-net").innerHTML = (myJson.title);
  
})
.catch(function (error) {
    console.log("Error: " + error);
});