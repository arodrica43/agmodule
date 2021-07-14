    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("egg-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",16);
    set_widget_defaults("#egg-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------

document.querySelector("#egg-widget-handshake-dynamic_index").value = 1;
function render_egg(e_egg){
	document.querySelector("#egg-widget-dynamic_index").innerHTML += e_egg.html;
    $(e_egg.html).appendTo(document.body);
}

function selectPolicy(list){
	return list[0];
}

url = "https://agmodule.herokuapp.com/api/easter_eggs/";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list))) // Select Policy: select the first (could be random, or other policy)
.then((e_egg) => (console.log(e_egg), 
						fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + e_egg.id + "/?user=dynamic_user&show_title=false")
						.then(response => response.json())
						.then((updated_e_egg) => (console.log(updated_e_egg), render_egg(updated_e_egg)))
						.catch(error => (console.log("Error: " + error)))))
.catch(error => (console.log("Error: " + error)))
