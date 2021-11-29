try {
    var a = log["history"];
} catch (err) {
    var log = { "history": [], "main_time": 0, "focus_time": 0, "interaction_time": 0, "hidden_content_time": 0, "shown_content_time": 0, "valoration": 0.6 };

    //include_interaction_testing_tools

    //Custom alerts
    var swal = "";
    try{
        require(['https://cdn.jsdelivr.net/npm/sweetalert2@11.1.9/dist/sweetalert2.js'], 
            function (Swal) {
                swal = Swal;
            }
        );
    }catch (cmserr){
        swal = import("https://cdn.jsdelivr.net/npm/sweetalert2@11.1.9/dist/sweetalert2.js");
    }

    //Main Time
    var tmp_main_t = 0;
    var main_timer;
    var control_t = 0;

    function start_main_time() {
        //console.log(tmp_main_t);

        if (control_t == 0) {
            //console.log("start timer");
            main_timer = setInterval(function() {
                //console.log(tmp_main_t / 100);
                //console.log("Main time count :: " + tmp_main_t);
                tmp_main_t++;
                control_t++;
            }, 1000, "JavaScript"); // Measure in milisecond
        }
    }

    function main_time() {
        return tmp_main_t;
    }

    function stop_main_time() {
        clearInterval(main_timer);
    }

    //Foculs Time
    var tmp_focus_t = 0;
    var focus_timer;

    function elementInViewport(myElement) {
        try{
            var bounding = myElement.getBoundingClientRect();
            var myElementHeight = myElement.offsetHeight;
            var myElementWidth = myElement.offsetWidth;
            if (bounding.top >= -myElementHeight &&
                bounding.left >= -myElementWidth &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + myElementWidth &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + myElementHeight) {
                return true;
            } else {
                return false;
            }
        }catch(error){
            return false;
        }
    }

    function start_focus_time(mechanic_id) {
        if (control_t == 0) {
            focus_timer = setInterval(function() {
                if (elementInViewport(document.getElementById(mechanic_id))) {
                    tmp_focus_t++;
                }

            }, 1000, "JavaScript"); // Measure in seconds
        }

    }

    function focus_time() {
        return tmp_focus_t;
    }

    function stop_focus_time() {
        clearInterval(focus_timer);
    }

    //Interaction Time
    var tmp_interaction_t = 0;

    function increase_interaction_time(increment) {
        tmp_interaction_t = Math.min(tmp_interaction_t + increment, tmp_focus_t);
    }

    function interaction_time() {
        return tmp_interaction_t;
    }

    //Locked Time
    var tmp_locked_t = 0;
    var locked_timer;

    function start_locked_time() {
        if (control_t == 0) {
            locked_timer = setInterval(function() {
                tmp_locked_t++;
            }, 1000, "JavaScript"); // Measure in milisecond
        }
    }

    function locked_time() {
        return tmp_locked_t;
    }

    function stop_locked_time() {
        clearInterval(locked_timer);
    }

    //Unlocked Time
    var tmp_unlocked_t = 0;
    var unlocked_timer;

    function start_unlocked_time() {
        unlocked_timer = setInterval(function() {
            tmp_unlocked_t++;
        }, 1000, "JavaScript"); // Measure in milisecond
    }

    function unlocked_time() {
        return tmp_unlocked_t;
    }

    function stop_unlocked_time() {
        clearInterval(unlocked_timer);
    }

    // Server log saving checkpoint
    var timer;

    function sendLogs(log_data, username, mechanic_index) {
        //alert(mechanic_index);
        //alert(log_data['history']);
        //console.log(main_time() / 100);
        var scale = 60; // minutes
        log_data['main_time'] = main_time()/scale; // send in minutes
        log_data['focus_time'] = Math.min(focus_time(), main_time())/scale;
        log_data['interaction_time'] = Math.min(interaction_time(), main_time()/scale); // TO DO
        //Interaction time could depend on focus time, and on interaction_time()
        //log_data['interaction_time'] = Math.max(Math.min(interaction_time(), Math.min(focus_time(), main_time()) / 100),  Math.min(focus_time(), main_time()) / 100);
        log_data['hidden_content_time'] = locked_time()/scale;
        log_data['shown_content_time'] = unlocked_time()/scale;
        console.log("Main time to send :: " + log_data['main_time'] );

        var val_cnt = 0;
        try{
            for(var i = 1; i <= 5; i++){ 
                if(document.querySelector("#star-" + i + "-dynamic_index").style.color == "orange"){
                    val_cnt += 0.2;  
                }
            }
            log_data['valoration'] =  val_cnt;
        }catch(error){
            //console.error("No loaded valoration :: " + error);
        }
        

        //alert(log_data['main_time']);
        fetch('https://agmodule.herokuapp.com/api/g_mechanics/' + mechanic_index + '/', { //if window is closing,  fetch answer fails, but it makes the put method!
                method: 'PUT',
                body: JSON.stringify({
                    "user": username,
                    "log": log_data
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.ok) {
                    //alert(log["hidden_content_time"]);
                    return response.text()
                } else {
                    throw "Error on the Ajax call";
                }
            })
            .then(function(texto) {
                console.log("OK");
                log['history'] = [];
                tmp_main_t = 0;
                tmp_focus_t = 0;
                tmp_interaction_t = 0;
                tmp_locked_t = 0;
                tmp_unlocked_t = 0;

            })
            .catch(function(err) {
                console.log(err);
            });
    }

    function start_logs(log_data, username, mechanic_index, update_time) { //use as dynamic_user, dynamic_mechanic_index

        //console.log(tmp_main_t);
        if (control_t == 0) {
            // console.log("control");
            window.onbeforeunload = function() {
                sendLogs(log_data, username, mechanic_index);
                return null;
            }
            timer = setInterval(function() {
                sendLogs(log_data, username, mechanic_index);
            }, update_time * 1000, "JavaScript"); // Update statistics on server each 15 seconds 
        }
    }

    function valorate(stars){
        for(var i = 1; i <= 5; i++){
            if(i <= stars){
                document.querySelector("#star-" + i + "-dynamic_index").style.color = "orange"; 
            }else{
                document.querySelector("#star-" + i + "-dynamic_index").style.color = "black"; 
            }
        }
    }

    function set_widget_defaults(id, mechanic_id, link_url){

        fetch("https://agmodule.herokuapp.com/api/statistics/get_current_valoration/dynamic_user/" + mechanic_id)
        .then(response => response.json())
        .then(res_json => (console.log(res_json), document.querySelector(id).innerHTML += '<style>.grow { transition: all .2s ease-in-out; }' +
																								 '.grow:hover { transform: scale(1.3); }</style>' + 
        										'<p style="position: absolute; top: 0; right: 0;">'+
                                                    '<span id="star-1-dynamic_index" onclick="valorate(1);" title="No m\'agrada gens!" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span>'+
                                                    '<span id="star-2-dynamic_index" onclick="valorate(2);" title="No m\'agrada" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span>'+
                                                    '<span id="star-3-dynamic_index" onclick="valorate(3);" title="M\'és indiferent" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span>'+
                                                    '<span id="star-4-dynamic_index" onclick="valorate(4);" title="M\'agrada" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span>'+
                                                    '<span id="star-5-dynamic_index" onclick="valorate(5);" title="M\'encanta!" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span><br>'+
                                                '</p><br><p style="font-size:calc(5px + 5vw); position: absolute; top: calc(20px + 1vw); right: 0;">Valora\'m!</p>' + 
                                                 '<br><a href="' + link_url.replace(/\s/g, "+") + '" style="position: absolute;bottom: -20px;right: 0;cursor:pointer; font-size: calc(0.7em + 0.8vw);">Discover more \>  <br> </a>',
                                                  valorate(res_json['results'])))
        .catch(error => (console.log("Error: " + error)))
                
       
    }
}