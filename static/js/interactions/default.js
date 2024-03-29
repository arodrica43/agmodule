try {
    var a = log["history"];
} catch (err) {
    var log = { "history": [], "main_time": 0, "focus_time": 0, "interaction_time": 0, "hidden_content_time": 0, "shown_content_time": 0, "valoration": 0.6 };

    //include_interaction_testing_tools

    //Custom alerts
    var swal = "";
    var has_evolved;
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
    	console.log("Clicked!");
        for(var i = 1; i <= 5; i++){
            if(i <= stars){
                document.querySelector("#star-" + i + "-dynamic_index").style.color = "orange"; 
            }else{
                document.querySelector("#star-" + i + "-dynamic_index").style.color = "black"; 
            }
        }
    }

    function set_widget_defaults(id, mechanic_id, link_url){
        var lvl_msg = "Newbie";
        if(dynamic_position > 0.33 && dynamic_position <= 0.66){
            lvl_msg = "Medium";
        }else if (dynamic_position > 0.66){
            lvl_msg = "Pro";
        }
        has_evolved = "dynamic_has_evolved";


        fetch("")
        .then(function(dump){
            console.log(has_evolved);
            if(has_evolved == "True"){
                swal.fire({
                    title: 'Enhorabona!',
                    text: 'Has assolit el nivell ' + lvl_msg + '. Visita la Dashboard per a veure les novetats.',
                    icon: 'success',
                    confirmButtonText: 'Continua'
                  });
            }
        })
        .catch((error) => console.log(error))

        
    	GMLabels = {
    		'badge_widgets' : ["Medalla","badges"," és una medalla!","Has obtingut una medalla, tens totes les teves medalles al Dashboard!"], 
    		'challenge_widgets' : ["Repte", "challenges","tria quin tipus de repte vols fer!","Tria quin tipus de repte vols fer, per punts o per progres en el curs."], 
    		'development_tool_widgets' : ["Modificació","development_tools","pots canviar l’aspecte d’una medalla!","Vols canviar l'aspecte d'aquesta medalla? Tria'n un de la llista i a partir d'ara els demés podran veure-la."], 
    		'easter_egg_widgets' : ["Easter Egg", "easter_eggs","tens un nou easter egg!"," Has de descobrir com interaccionar amb l’easter egg per veure el que oculta. Utilitza la Dashboard per a descobrir-ne més."], 
    		'gift_widgets' : ["Envia Regals", "gifts","pots enviar regals!","Des aquí podràs enviar un regal a tothom. Podràs enviar-ne més a qui vulguis des de la Dashboard."], 
    		'gift_opener_widgets' : ["Obre Regals", "gift_openers","pots obrir regals!","Pots obrir regals, i a partir d’ara a la Dashboard en podràs trobar-ne  més, quan algú t'envïi un. Un regal pot contenir punts o missatges. Descobreix-los!"], 
    		'knowledge_share_widgets' : ["Dona Ajuda", "knowledge_shares","pots enviar un missatge d’ajuda","Ja pots enviar un missatge d’ajuda a tothom pel xat."], 
    		'level_widgets' : ["Progrés", "levels","Ja ets " + lvl_msg,"Pots consultar el teu progrés a la Dashboard sempre que vulguis."], 
    		'lottery_widgets': ["Loteria", "lotteries"," pots jugar a la ruleta per obtenir més punts"," Pots jugar a la ruleta per obtenir més punts. Dona-li a la roda per a obtenir els punts."], 
    		'point_widgets' : ["Punts", "points","punts!","Amb els punts podràs interactuar amb més elements de jocs. Aconsegueix-ne més!"], 
    		'social_network_widgets' : ["Xarxa Social", "social_networks","ja pots afegir nous contactes a la teva xarxa social!","Pots afegir nous contactes a la teva xarxa social seleccionant-los de la llista d’usuaris. Segueix-los per saber què fan en el curs!"], 
    		'social_status_widgets' : ["Estatus Social", "social_statuses","ja pots veure el ranking social!","Pots veure el ranking dels usuaris amb més seguidors, i explorar la teva posició."], 
    		'unlockable_widgets' : ["Desbloquejable", "unlockables"," pots desbloquejar un contingut ocult!"," pots desbloquejar un contingut ocult que pot ser un acudit, un meme,  un mini-joc, etc. Tria’n un a l’atzar a veure què et surt!"], 
    		'leaderboard_widgets' : ["Competició", "leaderboards","pots veure el teu ranking!","Pots veure el ranking dels que tenen més punts, pots veure on estàs tu! Pots veure les classificacions completes a la Dashboard."]
    	};

        fetch("https://agmodule.herokuapp.com/api/statistics/get_current_valoration/dynamic_user/" + mechanic_id)
        .then(response => response.json())
        .then(res_json => (console.log(res_json), 
            document.querySelector(id).innerHTML += '<style>.grow { transition: all .2s ease-in-out; }' +
        												'.grow:hover { transform: scale(1.3); }' + 
                                                        '.help-msg {transition: visibility 0s, opacity 0.3s linear; visibility: hidden; opacity:0;}'+ 
                                                        '.help-btn:hover + .help-msg {visibility: visible;opacity:1}' +
                                                    '</style>' + 
                                                    '<p style="position: absolute; top: 0; right: 0;font-size:calc(10px + 1vw);width:100%;"> ' + 
            											'<a href="#"><img class="grow help-btn" style="padding:5px;width:8%;float:right; margin-right:0;" src="https://agmodule.herokuapp.com/media/dashboard_icons/help.png"><span style="background-color:whitesmoke;  color:black;width:40%; z-index:5; position:absolute;right:calc(-30px - 3vw);margin-top:calc(7vw); font-size:calc(6px + 1vw); text-align:center;padding:1vw;" class="help-msg">' + GMLabels[res_json.gmtype][3] + '</span></a>' + 
                                                        '<a href; font-size="' + link_url.replace(/\s/g, "+") + '" ><img style="padding:5px;width:10%;float:left; margin-right:calc(50px + 6vw);" src="https://agmodule.herokuapp.com/media/avatars/' + res_json.avatar.slice(res_json.avatar.indexOf(".") + 1, res_json.avatar.length) + '.png"></a></p>' +
                                                    '<p style="position: absolute; top: 0; right: 0;font-size:calc(10px + 1vw);width:80%;left:calc(5% + 1vw);top:calc(2.5vw);"> ' + 
            											'<a href="' + link_url.replace(/\s/g, "+") + '" ><img class="grow" style="width:6%;" src="https://agmodule.herokuapp.com/media/dashboard_icons/' + GMLabels[res_json.gmtype][1] + '.png"></a></p>' +
                                                    '<p style="position: absolute; top: 0; right: 0;font-size:calc(10px + 1vw);width:78%;left:calc(10% + 1vw);"> ' + 
                                                        'Has obtingut un premi: ' + GMLabels[res_json.gmtype][2] + '</p>' +   
                                                    '<p style="padding-right:5px;position: absolute; bottom: calc(30px + 0vw); right: 0;font-size:calc(10px + 1vw);">T\'ha agradat el premi?</p>' +	
            										'<p style="padding-right:5px;position: absolute; bottom: calc(0px + 0vw); right: 0;z-index:2">'+
                                                        '<span id="star-1-dynamic_index" onclick="valorate(1);" titxle="No m\'agrada gens!" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span>'+
                                                        '<span id="star-2-dynamic_index" onclick="valorate(2);" title="No m\'agrada" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span>'+
                                                        '<span id="star-3-dynamic_index" onclick="valorate(3);" title="M\'és indiferent" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span>'+
                                                        '<span id="star-4-dynamic_index" onclick="valorate(4);" title="M\'agrada" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span>'+
                                                        '<span id="star-5-dynamic_index" onclick="valorate(5);" title="M\'encanta!" class="grow fa fa-star" style="cursor:pointer; font-size: calc(0.8em + 0.8vw);"></span></p>',
                                                        document.querySelector(id).style.border = "20px solid #ff6666ff",
                                                      valorate(res_json['results'])))
        .catch(error => (console.log("Error: " + error)))       
    }
}