
	//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("ksh-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",16);
    set_widget_defaults("#ksh-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------

swal = ""

require(['https://cdn.jsdelivr.net/npm/sweetalert2@11.1.9/dist/sweetalert2.js'], function (Swal) {
      //foo is now loaded.
        swal = Swal;
    });

document.querySelector("#ksh-widget-handshake-dynamic_index").value = 1;

  
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

function log_inp_focus(){
          // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
          //Logging :: button-click interaction
          log_click({itime: 10, message:"Text input focused", register : log, level:1,type:"FocusIn"});
           // --------------------------------------------------------------------------
          };

function send_tip(tip){
     // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 10, message:"Send tip button clicked", register : log, level:1,type:"ButtonClick"});
	if(document.getElementById("tip-input-dynamic_index").value == ""){
		  swal.fire({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool'
      })

    alert("Your tip is empty!");
	}else{
			fetch("https://agmodule.herokuapp.com/api/gift_to_all?from=dynamic_user&type=text&content=" + document.getElementById("tip-input-dynamic_index").value)
		.then(response => response.json())
		.then(res_json => (console.log(res_json), alert("Tip sent!")))
		.catch(error => (console.log("Error: " + error)));
		tip.disabled = true;
	}
}

function render_ksh(){
	document.querySelector("#ksh-widget-dynamic_index").innerHTML += "<div><p onclick='log_txt_click();'>Let's help each other</p><img onclick='log_img_click();' src='https://agmodule.herokuapp.com/media/philantropy_icons/send_tip.png'><br><div style='height:10px;'></div><input onfocus='log_inp_focus();' style='width:50%' type='text' id='tip-input-dynamic_index' value=''><br><br><button class='btn btn-light' onclick='send_tip(this)'>Send a tip to everyone!</button></div>";
}

render_ksh();
