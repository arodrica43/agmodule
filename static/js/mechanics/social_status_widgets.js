
//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("sst-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#sst-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------

document.querySelector("#sst-widget-handshake-dynamic_index").value = 1;
function render_ldb(leadboard){
  document.querySelector("#sst-widget-dynamic_index").innerHTML += '<div style="height:calc(4vw);"></div>'
  document.querySelector("#sst-widget-dynamic_index").innerHTML += leadboard.html;
    $(leadboard.html).appendTo(document.body);
}

function selectPolicy(list){
  // Select non social leaderboard
  console.log(list);
  var new_list = [];
  for(var i = 0; i < list.length; i++){
    if(list[i].sort_by == "following" || list[i].sort_by == "followers"){
      new_list.push(list[i]);
    }
  }
  return new_list[Math.floor(Math.random() * new_list.length)];
}

url = "https://agmodule.herokuapp.com/api/leaderboards/";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list))) // Select Policy: select the first (could be random, or other policy)
.then((leadboard) => (console.log(leadboard), 
            fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + leadboard.id + "/?user=dynamic_user&show_title=false&dynamic_index=dynamic_index&only_me=yes")
            .then(response => response.json())
            .then((updated_leadboard) => (console.log(updated_leadboard), render_ldb(updated_leadboard)))
            .catch(error => (console.log("Error: " + error)))))
.catch(error => (console.log("Error: " + error)))
