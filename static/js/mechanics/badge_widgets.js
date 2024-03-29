
    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("bdg-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#bdg-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------
    
document.querySelector("#bdg-widget-handshake-dynamic_index").value = 1;
function log_bdg_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Badge icon clicked", register : log, level:1,type:"ImageClick"});
           // --------------------------------------------------------------------------
          };
function log_txt_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Badge Text clicked", register : log, level:1,type:"TextClick"});
           // --------------------------------------------------------------------------
          };
function choose_bdg(badge){
	var locked_style = "";
    // if(badge[1]){
    //     locked_style = 'The last badge you won: ' + badge[0].title; 
    // }else{
    // 	  locked_style = 'You won a new badge: ' + badge[0].title;
    // } 
    
   	document.querySelector("#bdg-widget-dynamic_index").innerHTML += '<div><img onclick="log_bdg_click();" id="bdg-icon-dynamic_index" src="' + badge[0].icon + '"><div>Medalla de superació de la classificació ' + badge[0].name + '</div></div>';
}
url = "https://agmodule.herokuapp.com/api/badges/retrieve_for_user/dynamic_user?unlock=true&widget_id=dynamic_index";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (list.sort((a, b) => a[0].id - b[0].id),list[0]))
.then((badge) => (choose_bdg(badge)))
.catch(error => (console.log("Error: " + error)))