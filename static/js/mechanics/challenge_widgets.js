
    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("chl-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#chl-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------
  
function log_txt_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Challenge Text clicked", register : log, level:1,type:"TextClick"});
           // --------------------------------------------------------------------------
          };

function log_img_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Challenge Icon clicked", register : log, level:1,type:"ImageClick"});
           // --------------------------------------------------------------------------
          };

function log_bar_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Progress bar clicked", register : log, level:1,type:"ImageClick"});
           // --------------------------------------------------------------------------
          };

 function claimReward(object){
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
      //Logging :: button-click interaction
      log_click({itime: 10, message:"Claim reward button clicked", register : log, level:1,type:"ButtonClick"});
       // --------------------------------------------------------------------------
    fetch("https://agmodule.herokuapp.com/api/challenges/claim_reward/" + object.dataset.id + "/dynamic_user")
    .then(response => response.json())
    .then(res_json => (res_json.results))
    .then(function(ok){
        if(ok == "OK"){
            object.innerHTML = "Claimed!";
            object.disabled = true;
        }
    })
    .catch(error => (console.log("Error: " + error)))
}
document.querySelector("#chl-widget-handshake-dynamic_index").value = 1;
function choose_chl(challenge){
	var locked_style = '<button  style="float:right;margin:15px; width:50%;" onclick="claimReward(this)" data-id=' + challenge[0].id + '>Claim</button>';
	if(!challenge[1]){
	    locked_style = '<progress onclick="log_bar_click();" style="float:right;margin:15px; width:50%;" value="' + challenge[2] + '" max="' + challenge[0].threshold + '"></progress>';
	}else if(challenge[3]){
	    locked_style = '<button  style="float:right;margin:15px; width:50%;" onclick="claimReward(this)" data-id=' + challenge[0].id + ' disabled>Claimed!</button>';
	}
	document.querySelector("#chl-widget-dynamic_index").innerHTML += '<div style="height:calc(25vw);"><h4 style=""><div style="height:calc(30px + 7vw);"></div>' +
                                                                    '<img width=100 height=100 onclick="log_img_click();" style="width:20vw;height:20vw;margin-top:-3vw" src="https://agmodule.herokuapp.com/media/challenge_icons/Challenge_01.gif">' + locked_style + '</h4>' +
                                                                    '<h4 style="float:right;margin:15px; width:50%;margin-top:calc(-12vw);;"><p onclick="log_txt_click();"> ' + challenge[0].by + ' : ' + challenge[2] + ' / ' + challenge[0].threshold + ' </p></h4> ' +
                                                                    '<h4 style="float:right;margin:15px; width:50%;margin-top:calc(-9vw);"><p onclick="log_txt_click();"> Recompensa : +' + challenge[0].reward_value + ' ' + challenge[0].reward_by + ' </p></h4> ' +
                                                                ' </div></div>';
}
url = "https://agmodule.herokuapp.com/api/challenges/retrieve_for_user/dynamic_user?course_id=dynamic_course_id";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (list[Math.floor(Math.random() * list.length)]))
.then((random_element) => (choose_chl(random_element)))
.catch(error => (console.log("Error: " + error)))
