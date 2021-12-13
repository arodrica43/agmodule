//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("gft-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#gft-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------
var rewards = [
				{'value' : 1, 'by' : 'score', 'message' : '+1 point'},
				{'value' : 5, 'by' : 'score', 'message' : '+5 points'},
				{'value' : 10, 'by' : 'score', 'message' : '+10 points'},
				{'value' : 20, 'by' : 'score', 'message' : '+20 points'},
				{'value' : 50, 'by' : 'score', 'message' : '+50 points'},
				{'value' : 1, 'by' : '$', 'message' : '+1 $'},
				{'value' : 5, 'by' : '$', 'message' : '+5 $'},
				{'value' : 10, 'by' : '$', 'message' : '+10 $'},
				{'value' : 20, 'by' : '$', 'message' : '+20 $'},
				{'value' : 50, 'by' : '$', 'message' : '+50 $'}				
]

  
function log_txt_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Gift Text clicked", register : log, level:1,type:"TextClick"});
           // --------------------------------------------------------------------------
          };

function log_img_click(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Gift Icon clicked", register : log, level:1,type:"ImageClick"});
           // --------------------------------------------------------------------------
          };

document.querySelector("#gft-widget-handshake-dynamic_index").value = 1;

function choose_reward(){
	var r = Math.floor(Math.random() * rewards.length);
	return rewards[r];	
}

function send_gift(gift){
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 10, message:"Send gift button clicked", register : log, level:1,type:"ButtonClick"});
     // --------------------------------------------------------------------------
	fetch("https://agmodule.herokuapp.com/api/gift_to_all?from=dynamic_user&type=" + gift.dataset.by + "&content=" + gift.dataset.value)
	.then(response => response.json())
	.then(res_json => (console.log(res_json), alert("Present sent!")))
	.catch(error => (console.log("Error: " + error)));
	gift.disabled = true;
}

function render_gft(){
	var reward = choose_reward();
	document.querySelector("#gft-widget-dynamic_index").innerHTML += "<div style='height:calc(5vw);'></div><div><img onclick='log_img_click();' src='https://agmodule.herokuapp.com/media/philantropy_icons/send_gift.png'><br><br><button class='btn btn-light' onclick='send_gift(this)' data-value=" + reward['value'] + " data-by='" + reward['by'] + "' >Envia " + reward['message'] + " a tothom!</button></div>";
}

render_gft();
