//INTERACTION INIT -----------------------------------------------------------------------
  //Dynamic property :: Log tracking functions
  include-base-tracking
  include-onclick-tracking
  start_main_time();
  start_focus_time("main-content-gifting");
  start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
  // ---------------------------------------------------------------------------------------

document.getElementById("main-content-gifting").innerHTML = '<div class="container-fluid"  style="width:100%;">'+
                                                          '<div class="grid-container">'+
                                                            '<div id="gift-elements"></div>'+
                                                            '<div class="label1" id="label1"></div>'+
                                                            '<div class="item1" id="item1"></div>'+
                                                            '<div class="label2" id="label2"></div>'+
                                                            '<div class="item2" id="gift-input"></div>'+
                                                            '<div class="item3" id="item3"></div>'+
                                                            '<div class="users">'+
                                                              '<div style="text-align:center;" id="label3"></div>'+
                                                              '<div id="scrollable-users"></div>'+
                                                            '</div>'+
                                                            '<div class="item5" id="item5"></div>'+
                                                          '</div>'+
                                                        '</div>';

document.getElementById("item3").innerHTML = '<div><img style="width:70px;height:70px;" src="https://agmodule.herokuapp.com/media/dashboard_icons/gifts.png" ></div>'//'<a href="#" onclick="openMyGifts()"><img src="https://img.icons8.com/bubbles/2x/gift.png" style="width:50px; height:50px;">&nbsp; My Gifts <br><br></a>';
document.getElementById("label1").innerHTML = '<label for="gift-options" style="font-size:2vw;">Type of gift: &nbsp; </label>';
document.getElementById("item1").innerHTML = '<select name="gift-options" id="gift-options" style="width:93%; font-size:2vw;" onchange="updateInput()">'+
                                                '<option value="score" style=" ">Points</option>'+
                                                '<option value="text">Text</option>'+
                                              '</select>';
document.getElementById("label2").innerHTML = '<label for="gift-input-instance" id="gift-input-instance-label" style="font-size:2vw;">Amount: &nbsp; </label>';
document.getElementById("gift-input").innerHTML = '<input id="gift-input-instance" type="number" value="10" style="width:93%; text-align:center; font-size:2vw;">';
document.getElementById("label3").innerHTML = '<b>Send gift to: </b>';
document.getElementById("scrollable-users").innerHTML = ' <div id="scrollable-content" style="border-style:groove; border-width:1px;"><div style="border-x:groove; border-width:1px;margin:10px;">'+
                                                '<input type="checkbox" id="select-all" class="largeCheckbox" name="vehicle1" value="Bike" style="" onclick="selectAll(this);">'+
                                                '<div style="font-size:1.5rem; text-align:center; font-size:2vw;">All users</div>'+
                                                  '<hr>'+
                                              '</div><div style="text-align:center" id ="loading-gif"><img src="https://i.pinimg.com/originals/23/35/32/23353292cc60b2bcb3f015ee362eeb74.gif"  width=250/></div></div>';
document.getElementById("item5").innerHTML = '<button class="btn btn-primary" style="font-size:2vw;width:80%;height:80%;" onclick="sendGifts()">Envia regals</button>';
document.getElementById("gift-input-instance").onfocus = function(){
   // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: input-in interaction
    log_input({itime: 2,message:"Input field 'Amount' focused in", register : log, level:1,type:"InputIn"});
    // --------------------------------------------------------------------------
}
document.getElementById("gift-input-instance").onblur = function(){
   // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: input-in interaction
    log_input({itime: 2,message:"Input field 'Amount' focused out", register : log, level:1,type:"InputOut"});
    // --------------------------------------------------------------------------
}
document.getElementById("gift-options").onfocus = function(){
   // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: input-in interaction
    log_input({itime: 2,message:"Input field 'Type of Gift' focused in", register : log, level:1,type:"InputIn"});
    // --------------------------------------------------------------------------
}
document.getElementById("gift-options").onblur = function(){
   // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: input-in interaction
    log_input({itime: 2,message:"Input field 'Type of Gift' focused out", register : log, level:1,type:"InputOut"});
    // --------------------------------------------------------------------------
}
document.querySelector("#scrollable-content").onscroll = function(){
            // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
            //Logging :: button-click interaction
            log_click({itime: 2,message:"Scrolling 'Users List' content", register : log, level:1,type:"Scroll"});
            // --------------------------------------------------------------------------
        }


        // fetch("https://agmodule.herokuapp.com/api/g_mechanics/20/?user=dynamic_user&show_title=false")
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(function (myJson) {
        //         document.querySelector("#mygifts-body-incr").innerHTML = (myJson.html);
        //         $(myJson.html).appendTo(document.body);    
        //     })
        //     .catch(function (error) {
        //         console.log("Error: " + error);
        //     });

function openMyGifts(){
  // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 1, message:"My gifts button clicked", register : log, level:1,type:"ButtonClick"});
    // --------------------------------------------------------------------------
  var modal = document.getElementById("myGiftsModal");
            // Get the <span> element that closes the modal
  var span = document.getElementById("close-mygifts");

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
      //Logging :: modal-close interaction
      log_click({itime: 2,message:"My gifts modal close (Click x button)", register : log, level:2,type:"ModalClose"});
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
        //Logging :: modal-close interaction
        log_click({itime: 2,message:"My gifts modal close (Click outside modal)", register : log, level:2,type:"ModalClose"});
        // --------------------------------------------------------------------------
      modal.style.display = "none";
    }
  }
  modal.style.display = "block";
}

function updateInput() {
  var x = document.getElementById("gift-options").value;
  if(x == "score" || x == "$"){
       document.getElementById("gift-input-instance-label").innerHTML = "Amount: &nbsp; ";
       document.getElementById("gift-input").innerHTML = '<input id="gift-input-instance" type="number" value="10" style="width:93%; text-align:center;">';
       
  }else{
       document.getElementById("gift-input-instance-label").innerHTML = "Text: &nbsp; ";
       document.getElementById("gift-input").innerHTML = '<textarea style="height:5vw;width:80%;" class="gift-textarea" id="gift-input-instance" placeholder="Hi! That\'s my text-like gift!"></textarea>';
  }
}

function selectAll(cb){
  // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 1, message:"Checkbox 'Select All' clicked", register : log, level:1,type:"ButtonClick"});
    // --------------------------------------------------------------------------
  usernames = JSON.parse(document.getElementById("usernames").value);
  usernames.forEach(function(item,index){
    document.getElementById("checkbox-" + item).checked = cb.checked;
  });
}


function sendGift(to){
    //alert(to);
    var type = document.getElementById("gift-options").value;
    var content = document.getElementById("gift-input-instance").value;
    
    fetch("https://agmodule.herokuapp.com/api/gamers/" + to + "/add_gift?from=dynamic_user&type=" + type + "&content=" + content) 
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            //alert("answer from" + to);
             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
}

function sendGifts(){
  // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 1, message:"Send gifts button clicked", register : log, level:2,type:"ButtonClick"});
    // --------------------------------------------------------------------------
  var count = 0;
   usernames = JSON.parse(document.getElementById("usernames").value);
   usernames.forEach(function(item,index){
     ucb = document.getElementById("checkbox-" + item);
     if(ucb.checked){
       sendGift(item);
       count++;
     }
   });


  if(count == 0){
    //alert("You haven't selected any user!");
    swal.fire({
        title: 'Oops!',
        text: "No has seleccionat cap usuari",
        icon: 'error',
        confirmButtonText: 'Continua'
      })
  }else if(count == 1){
    //alert("You have sent a gift!");
    swal.fire({
        title: 'Enviat!',
        text: "Has enviat un regal a l'usuari seleccionat",
        icon: 'success',
        confirmButtonText: 'Continua'
      })
  }else if(count > 1){
    //alert("You have sent a gift to every selected user!");
    swal.fire({
        title: 'Enviat!',
        text: "Has enviat un regal a cada usuari seleccionat",
        icon: 'success',
        confirmButtonText: 'Continua'
      })
  }
   
 
}

    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-gift").innerHTML = myJson.title;
            //document.querySelector("#score").innerHTML = "Your " + myJson.given_by + " is " + myJson.score ;
            //document.querySelector("#uname").innerHTML = "Username: " + myJson.user ;
             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });

    fetch("https://agmodule.herokuapp.com/api/gamers/") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            myJson = myJson.results;
            var usernames = []
            document.getElementById("loading-gif").innerHTML = "";
            myJson.forEach(function(item,i){
              if(myJson[i].user.username != "dynamic_user"){
                usernames.push('"' + myJson[i].user.username + '"');
                document.getElementById("scrollable-content").innerHTML +=  '<div style="border-x:groove; border-width:1px;margin:10px;">'+
                                                                            '<input type="checkbox" id="checkbox-' + myJson[i].user.username  + '" class="largeCheckbox" name="' + myJson[i].user.username  + '" value="'+ myJson[i].user.username  + '">'+
                                                                            '<div style="text-align:center;font-size:2vw; margin-left:4vw;">' + myJson[i].user.username  + '</div>'+
                                                                          '</div>';
              }
            });

            myJson.forEach(function(item,i){
              if(myJson[i].user.username != "dynamic_user"){
                document.getElementById('checkbox-' + myJson[i].user.username).onclick = function(){
                  // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                    //Logging :: button-click interaction
                    log_click({itime: 1, message:"Checkbox 'Select " + myJson[i].user.username  + "' clicked", register : log, level:1,type:"ButtonClick"});
                    //alert("Checkbox 'Select " + myJson[i].user.username  + "' clicked");
                    // --------------------------------------------------------------------------
                }
              } 
            });
          

            document.getElementById("usernames").value = "["  + usernames  + "]";
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });


      