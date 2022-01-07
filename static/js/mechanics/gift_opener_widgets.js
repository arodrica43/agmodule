	//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("gop-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#gop-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------

document.querySelector("#gop-widget-handshake-dynamic_index").value = 1;
function render_gop(opener){
    document.querySelector("#gop-widget-dynamic_index").innerHTML += '<div style="height:calc(6vw);"></div>';
	document.querySelector("#gop-widget-dynamic_index").innerHTML += opener.html +  "<br>";
    $(opener.html).appendTo(document.body);
}

function selectPolicy(list){
	return list[0]
}

url = "https://agmodule.herokuapp.com/api/gift_openers/";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list))) // Select Policy: select the first (could be random, or other policy)
.then((opener) => (console.log(opener), 
						fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + opener.id + "/?user=dynamic_user&show_title=false&dynamic_progress=dynamic_position")
						.then(response => response.json())
						.then((updated_opener) => (console.log(updated_opener), render_gop(updated_opener)))
                        .then((dump) => (console.log(swal.fire)))
						.catch(error => (console.log("Error: " + error)))))
.catch(error => (console.log("Error: " + error)))