
 //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("unk-widget-dynamic_index");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",16);
    set_widget_defaults("#unk-widget-dynamic_index", "dynamic_mechanic_index", "dynamic_link_url");
    // ---------------------------------------------------------------------------------------
  
document.querySelector("#unk-widget-handshake-dynamic_index").value = 1;

function render_unk(unlockable){
	document.querySelector("#unk-widget-dynamic_index").innerHTML += unlockable.html;
    $(unlockable.html).appendTo(document.body);
}

function selectPolicy(list){
	select = [];
	for (let i = 0; i < Math.min(5, list.length); i++) {
	  select.push(list[i]);
	}
	return select
}

// function whichTransitionEvent(el){
  

//   var transitions = {
//     "transition"      : "transitionend",
//     "OTransition"     : "oTransitionEnd",
//     "MozTransition"   : "transitionend",
//     "WebkitTransition": "webkitTransitionEnd"
//   }

//   for (t in transitions){
//     if (el.style[t] !== undefined){
//       return transitions[t];
//     }
//   }
// }



function unlock(unlockable){

   // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 10, message:"Unlockable card clicked", register : log, level:1,type:"ButtonClick"});
     // --------------------------------------------------------------------------
	fetch("https://agmodule.herokuapp.com/api/unlockables/" + unlockable.dataset.id + "/unlock_for/dynamic_user?index=dynamic_index")
	.then(function(){
		//unlockable.querySelector(".card-inner").style.transition = 'all 0.7s';
		//unlockable.querySelector(".card-inner").style.zIndex = 1;
		/*var w_width = window.innerWidth ;
		var x = unlockable.querySelector(".card-inner").offsetLeft;
		var w = unlockable.querySelector(".card-inner").offsetWidth;
		var lambda = 4;
		var x_incr = (-w_width/2 + x + w/2)/lambda;	
		unlockable.querySelector(".card-inner").style.transform = 'rotateY(180deg) scaleX(' + lambda + ') scaleY(' + (lambda-2) + ') translateX(' + x_incr + 'px) translateY(30px)';
		var transitionEvent = whichTransitionEvent(unlockable);
		$(this).one(transitionEvent,
		    function(event) {
		    	document.getElementById("unk-widget-dynamic_index").innerHTML = unlockable.dataset.locked_content;
				document.getElementById("unk-widget-dynamic_index").style.height = "300px";
			});
			*/
		unlockable.getElementsByTagName('img')[0].src = "https://agmodule.herokuapp.com/media/unlockable_icons/unlocked.png";
		setTimeout(function(){
		    document.getElementById("unk-widget-dynamic_index").innerHTML = unlockable.dataset.locked_content;
		}, 3000);
		

	})
	.catch(error => (console.log("Error: " + error)))
}

function fillHTML(data){
document.getElementById("unk-widget-dynamic_index").innerHTML += '<div id="unk-' + data.id + '" class="grid-item" onclick="unlock(this)" data-id=' + data.id + ' data-locked_content=\'' + data.locked_html + '\' >'+
																	/*'<div class="card-inner">'+
																	    '<div class="card-front">'+*/
																	      '<img src="https://agmodule.herokuapp.com/media/unlockable_icons/locked.png" alt="Avatar" style="width:100%;height:100%;">'+
																	/*    '</div>'+
																	    '<div class="card-back">'+
																	      '<div id="locked-content-div"></div> '+
																	    '</div>'+
																	'</div>'+*/
																 '</div>';

}

url = "https://agmodule.herokuapp.com/api/unlockables/retrieve_for_user/dynamic_user?index=dynamic_index";
fetch(url)
.then(response => response.json())
.then(res_json => (res_json.results))
.then((list) => (selectPolicy(list))) // Select Policy: select the first (could be random, or other policy)
.then((unlockables) => (console.log(unlockables),
						document.getElementById("unk-widget-dynamic_index").innerHTML +=  '<div class="grid-container">',
						unlockables.length > 0 ? unlockables.forEach((item,index) => (fillHTML(item))) : document.getElementById("unk-widget-dynamic_index").innerHTML += "<div>This widget has alredy been used</div>",
						document.getElementById("unk-widget-dynamic_index").innerHTML += '</div>'))
.catch(error => (console.log("Error: " + error)))
