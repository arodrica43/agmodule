
//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("sst-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",16);
    set_widget_defaults("#sst-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------

document.querySelector("#sst-widget-handshake-dynamic_index").value = 1;

  
function log_txt_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Title text clicked", register : log, level:1,type:"TextClick"});
           // --------------------------------------------------------------------------
          };

function log_img_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Main icon clicked", register : log, level:1,type:"ImageClick"});
           // --------------------------------------------------------------------------
          };

function render_sst(social_stat){
	document.querySelector("#sst-widget-dynamic_index").innerHTML += "<div><img onclick='log_img_click();' src='https://agmodule.herokuapp.com/media/social_icons/social_status.png'><br><br><p onclick='log_txt_click();' >You have " + social_stat[1] + " " + social_stat[0] + "!</p></div>";
}

function selectPolicy(to_select){
	// Select non social leaderboard
	var r = Math.floor(Math.random() * to_select.length);
	return to_select[r];
	
}

url = "https://agmodule.herokuapp.com/api/social_statuses/widget/dynamic_user";
fetch(url)
.then(response => response.json())
.then(res_json => (console.log(res_json),selectPolicy(res_json.results)))
.then((selected) => render_sst(selected))
.catch(error => (console.log("Error: " + error)))
