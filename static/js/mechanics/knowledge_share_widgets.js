
	//INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("ksh-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    set_widget_defaults("#ksh-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------


document.querySelector("#ksh-widget-handshake-dynamic_index").value = 1;


function render_ksh(ksh){
  document.querySelector("#ksh-widget-dynamic_index").innerHTML += ksh.html;
    $(ksh.html).appendTo(document.body);
}

function selectPolicy(list){
  return list[0]
}

url = "https://agmodule.herokuapp.com/api/knowledge_shares/";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list))) // Select Policy: select the first (could be random, or other policy)
.then((ksh) => (console.log(ksh), 
            fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + ksh.id + "/?user=dynamic_user&show_title=false&dynamic_progress=dynamic_position")
            .then(response => response.json())
            .then((updated_ksh) => (console.log(updated_ksh), render_ksh(updated_ksh)))
            .catch(error => (console.log("Error: " + error)))))
.catch(error => (console.log("Error: " + error)))

  
// function log_txt_click(){
//           // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
//           //Logging :: button-click interaction
//           log_click({itime: 10, message:"Title text clicked", register : log, level:1,type:"TextClick"});
//            // --------------------------------------------------------------------------
//           };

// function log_img_click(){
//           // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
//           //Logging :: button-click interaction
//           log_click({itime: 10, message:"Main icon clicked", register : log, level:1,type:"ImageClick"});
//            // --------------------------------------------------------------------------
//           };

// function log_inp_focus(){
//           // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
//           //Logging :: button-click interaction
//           log_click({itime: 10, message:"Text input focused", register : log, level:1,type:"FocusIn"});
//            // --------------------------------------------------------------------------
//           };

// function send_tip(tip){
//      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
//     //Logging :: button-click interaction
//     log_click({itime: 10, message:"Send tip button clicked", register : log, level:1,type:"ButtonClick"});
// 	if(document.getElementById("tip-input-dynamic_index").value == ""){
// 		  swal.fire({
//         title: 'Error!',
//         text: 'Your tip is empty',
//         icon: 'error',
//         confirmButtonText: 'Retry'
//       })

//     alert("Your tip is empty!");
// 	}else{
// 			fetch("https://agmodule.herokuapp.com/api/gift_to_all?from=dynamic_user&type=text&content=" + document.getElementById("tip-input-dynamic_index").value)
// 		.then(response => response.json())
// 		.then(res_json => (console.log(res_json), swal.fire({
//                                                 title: 'Success!',
//                                                 text: 'Tip sent!',
//                                                 icon: 'success',
//                                                 confirmButtonText: 'Continue'
//                                               })))
// 		.catch(error => (console.log("Error: " + error)));
// 		tip.disabled = true;
// 	}
// }

// function render_ksh(){
// 	document.querySelector("#ksh-widget-dynamic_index").innerHTML += "<div style='height:calc(0vw);'></div><div><img onclick='log_img_click();' src='https://agmodule.herokuapp.com/media/philantropy_icons/send_tip.png'><br><div style='height:10px;'></div><input onfocus='log_inp_focus();' style='width:50%' type='text' id='tip-input-dynamic_index' value=''><br><br><button class='btn btn-primary' onclick='send_tip(this)'>Envia un missatge d'ajuda a tothom!</button></div>";
// }

// render_ksh();
