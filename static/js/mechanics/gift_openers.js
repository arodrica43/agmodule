//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-gift_openers");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------


document.getElementById("body-gifts-content").innerHTML = '<div class="scrollable-content-gifts" id = "gifts-content"></div>';
document.getElementById("gifts-content").onscroll = function(){
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
      //Logging :: button-click interaction
      log_click({itime: 2,message:"Scrolling gifts", register : log, level:1,type:"Scroll"});
      // --------------------------------------------------------------------------
    }
function openGift(gift,index){
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    //console.log("Gift icon (at position " + index + ") clicked");
    log_click({itime: 1, message:"Open gift button (at position " + index + ") clicked", register : log, level:1,type:"ButtonClick"});
    // --------------------------------------------------------------------------
    fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/open_gift?index=" + gift.value) // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            if(myJson.results == 'OK'){
                gift.innerHTML = "Opened!";
                gift.disabled = true;
                for(var i = 0; i < document.getElementById("num-gifts").value; i++){
                    var g = document.getElementById("open-button-" + i);
                    if(g.value != "-"){
                        if(g.value > gift.value){
                            //alert("Before: " + g.value);
                            g.value--;
                            //alert("After: " + g.value);
                        }
                    }
                }
                gift.value = "-";
                swal.fire({
                    title: 'Success!',
                    text: myJson.message,
                    icon: 'success',
                    confirmButtonText: 'Continue'
                  })
            }
             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
}

function log_txt_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Text clicked", register : log, level:1,type:"TextClick"});
           // --------------------------------------------------------------------------
       }


    fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-gift-opener").innerHTML = myJson.title;
             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });

    fetch("https://agmodule.herokuapp.com/api/gamers/dynamic_user/") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            
            var gifts = myJson.gamer_profile.data.gifts;
         
            document.getElementById("num-gifts").value = gifts.length;
            if(gifts.length == 0){
                document.querySelector("#gifts-content").innerHTML += "<div onclick='log_txt_click();' style='text-align:center;font-size:calc(1rem + 1.2vw);'>You have no gifts to open</div>";
            }
            gifts.forEach(function(item,index){
                document.querySelector("#gifts-content").innerHTML += '<h3><div class="row" style="background:whitesmoke; margin:10px;">'+
                                                                        '<div class="col-md-4"><img id="gift-icon-' + index + '" style="width:60px;height:60px;" src="https://agmodule.herokuapp.com/media/dashboard_icons/gift_openers.png" ></div>'+
                                                                        '<div id="gift-text-' + index + '" class="col-md-4" style="margin-top:15px;">Gift from ' + item[0] + '</div>'+
                                                                        '<div class="col-md-4" style="text-align:right;"><button style="margin-top:10px;" class="btn btn-primary" name="' + item[0] + '" value="' + index + '" onclick="openGift(this,' + index + ')" id="open-button-' + index + '"> Open </button> </div>'+
                                                                      '</div></h3>';
            });
            gifts.forEach(function(item,index){
                document.querySelector('#gift-icon-' + index).onclick = function(){
                    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                    //Logging :: button-click interaction
                    log_click({itime: 1, message:"Gift icon (at position " + index + ") clicked", register : log, level:1,type:"ImageClick"});
                    // --------------------------------------------------------------------------
                }
                document.querySelector('#gift-text-' + index).onclick = function(){
                    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                    //Logging :: button-click interaction
                    log_click({itime: 1, message:"Gift text (at position " + index + ") clicked", register : log, level:1,type:"TextClick"});
                    // --------------------------------------------------------------------------
                }
            });             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });


      