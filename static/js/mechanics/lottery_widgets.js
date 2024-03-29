
    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("lot-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#lot-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------

document.querySelector("#lot-widget-handshake-dynamic_index").value = 1;
function render_lot(lottery){
    document.querySelector("#lot-widget-dynamic_index").innerHTML += '<div style="height:calc(0vw);"></div>';
	document.querySelector("#lot-widget-dynamic_index").innerHTML += lottery.html;
    $(lottery.html).appendTo(document.body);
    document.getElementById("spin").disabled = false;
}

function selectPolicy(list){
	return list[0]
}

url = "https://agmodule.herokuapp.com/api/lotteries/";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list))) // Select Policy: select the first (could be random, or other policy)
.then((lottery) => (console.log(lottery), 
						fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + lottery.id + "/?user=dynamic_user&show_title=false")
						.then(response => response.json())
						.then((updated_lottery) => (console.log(updated_lottery), render_lot(updated_lottery)))
						.catch(error => (console.log("Error: " + error)))))
.catch(error => (console.log("Error: " + error)))
