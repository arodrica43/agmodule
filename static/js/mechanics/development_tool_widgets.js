
 //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("dvt-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#dvt-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------

document.querySelector("#dvt-widget-handshake-dynamic_index").value = 1;

function log_img_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 2, message:"Badge icon clicked", register : log, level:1,type:"ImageClick"});
           // --------------------------------------------------------------------------
          };

function log_txt_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 2, message:"Title text clicked", register : log, level:1,type:"TextClick"});
           // --------------------------------------------------------------------------
          };

function render_dvt(modifiable){

	course_position = dynamic_position;
	console.log(dynamic_activity_progress);

	dyn_str = "";

	if(course_position <= 0.25){
		dyn_str = '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b1.svg" onclick="changeIcon(1,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b2.svg" onclick="changeIcon(2,' + modifiable.id + ');">';			
	}else if (course_position <= 0.5){
		dyn_str = '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b1.svg" onclick="changeIcon(1,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b2.svg" onclick="changeIcon(2,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b3.svg" onclick="changeIcon(3,' + modifiable.id + ');">';
	}else if (course_position <= 0.75){
		dyn_str = '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b1.svg" onclick="changeIcon(1,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b2.svg" onclick="changeIcon(2,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b3.svg" onclick="changeIcon(3,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b4.svg" onclick="changeIcon(4,' + modifiable.id + ');">';
	}else{
		dyn_str = '<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b1.svg" onclick="changeIcon(1,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b2.svg" onclick="changeIcon(2,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b3.svg" onclick="changeIcon(3,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b4.svg" onclick="changeIcon(4,' + modifiable.id + ');">' +
			'<img class="selectable-image" src="https://agmodule.herokuapp.com/media/badge_icons/b5.svg" onclick="changeIcon(5,' + modifiable.id + ');">';

	}

	
	document.querySelector("#dvt-widget-dynamic_index").innerHTML += '<div onclick="log_txt_click();">Change the icon of ' + modifiable.title + '</div>' + 
																	'<div><img onclick="log_img_click();" id="main-badge-dynamic_index" src="' + modifiable.icon + '"><br>' +
																	'<br><div>' + dyn_str + '</div></div>';
}

function selectPolicy(list){
	return list[Math.floor(Math.random() * list.length)];
}

function changeIcon(type, id){
    log_img_click();
    document.querySelector("#main-badge-dynamic_index").src = "https://agmodule.herokuapp.com/media/badge_icons/b" + type + ".svg"
    fetch("https://agmodule.herokuapp.com/api/badges/" + id + "/change_icon?option=" + type)
	.then(response => response.json())
	.then(res_json => (alert("Badge icon changed!")))
	.catch(error => (console.log("Error: " + error)))

}

modifiables = ["badges"]
mod_type =  modifiables[Math.floor(Math.random() * modifiables.length)];

url = "https://agmodule.herokuapp.com/api/" + mod_type + "/";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list)))
.then((modifiable) => ( console.log(modifiable), render_dvt(modifiable)))
.catch(error => (console.log("Error: " + error)))
