
//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("pnt-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",16);
    set_widget_defaults("#pnt-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------
    
  
function log_txt_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Main text clicked", register : log, level:1,type:"TextClick"});
           // --------------------------------------------------------------------------
          };

document.querySelector("#pnt-widget-handshake-dynamic_index").value = 1;
function render_pnt(point, point_by, reward){
	document.querySelector("#pnt-widget-dynamic_index").innerHTML += '<div onclick="log_txt_click();">Your won a reward!</div>' +
                                                                        '<div onclick="log_txt_click();">+' + reward + ' ' + point_by + '</div>';
}

function selectPolicy(list){
	return list[Math.floor(Math.random() * list.length)];
}

function chooseReward(){
    values =  [5,10,15,20];
	return values[Math.floor(Math.random() * values.length)];
}

url = "https://agmodule.herokuapp.com/api/points/";
reward = chooseReward();
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list))) // Select Policy: select the first (could be random, or other policy)
.then((point) => (console.log(point), 
						fetch("https://agmodule.herokuapp.com/api/points/" + point.id + "/?user=dynamic_user&show_title=false&increase=" + reward + "&dynamic_progress=dynamic_progress")
						.then(response => response.json())
						.then((updated_point) => (console.log(updated_point), render_pnt(updated_point, point.given_by, reward)))
						.catch(error => (console.log("Error: " + error)))))
.catch(error => (console.log("Error: " + error)))
