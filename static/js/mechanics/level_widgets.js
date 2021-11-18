
//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("lvl-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#lvl-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------
    

document.querySelector("#lvl-widget-handshake-dynamic_index").value = 1;
function render_lvl(level){
	document.querySelector("#lvl-widget-dynamic_index").innerHTML += level.html;
    $(level.html).appendTo(document.body);
}

function selectPolicy(list){
	return list[0]
}

url = "https://agmodule.herokuapp.com/api/levels/";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list))) // Select Policy: select the first (could be random, or other policy)
.then((level) => (console.log(level), 
						fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + level.id + "/?user=dynamic_user&show_title=false")
						.then(response => response.json())
						.then((updated_level) => (console.log(updated_level), render_lvl(updated_level)))
						.catch(error => (console.log("Error: " + error)))))
.catch(error => (console.log("Error: " + error)))
