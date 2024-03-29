    //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-ksh");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------

  document.getElementById("main-content-ksh").innerHTML = '<div id="scrollable-content"></div>'+
                                                            '<div id="footer" class="container-fluid">'+
                                                                    '<hr>'+
                                                                      '<div id="chat-input-fields" class="container-fluid" style="background:white; margin-top:5px; margin-bottom:10px;height:30px;">'+
                                                                      '</div>'+
                                                            '</div>';
  
  document.getElementById("chat-input-fields").innerHTML = ' <textarea style="max-height:100px; height: 30px;width:70%;padding-top:5px; padding-left:5px; resize: none;float:left; overflow:auto;" id="chat-input"></textarea>'+
                        '<button class="btn btn-primary" style="background-color:#ff6666;float:right;padding-top:5px;width:18%; height:40px;" onclick="sendMessage()"><img src="https://agmodule.herokuapp.com/media/philantropy_icons/send.png" style="width:100%; min-width:15px; min-height:15px; max-height:30px; max-width:30px;"/> </button>';
 
(function() {
  $("#chat-input").focus(function() {
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: input-in interaction
    log_input({itime: 2,message:"Text input field focused in", register : log, level:1,type:"InputIn"});
    // --------------------------------------------------------------------------
      //$("#chat-input").animate({height:'120px'},300);
  }).blur(function() {
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: input-in interaction
    log_input({itime: 2,message:"Text input field focused out", register : log, level:1,type:"InputOut"});
    // --------------------------------------------------------------------------
    if(document.getElementById("chat-input").value == ""){
        $("#chat-input").animate({height:'30px'},300);
    }
  });
})();

function scrollChat(){
    document.getElementById("scrollable-content").scrollTo(0, document.getElementById("scrollable-content").scrollHeight);
    document.getElementById("scrollable-content").onscroll = function(){
      // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
      //Logging :: button-click interaction
      log_click({itime: 2,message:"Scrolling messages", register : log, level:1,type:"Scroll"});
      // --------------------------------------------------------------------------
    }
}

colors = [
            [255,102,102],
            [204, 204, 102],
            [255,204,102],
            [221,221,221],
            [204,153,102],
            [153,153,102]
        ]

function sendMessage(){
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 2,message:"Send message button clicked", register : log, level:1,type:"ButtonClick"});
    // --------------------------------------------------------------------------
    fetch("called_mechanic_url&from=dynamic_user&message=" + document.getElementById("chat-input").value ) // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
          //             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
    color = colors['dynamic_user'.split('').reduce((sum, char) => sum + char.codePointAt(0), 0) % colors.length];
    document.getElementById("scrollable-content").innerHTML += '<div class="container-fluid message" style="background:rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ', 0.5);">'+
                                                                '<h3>'+
                                                                    '<div class="row">'+
                                                                    '<div class="col-lg-12" style=""> <b>dynamic_user diu: </b>' + document.getElementById("chat-input").value + '</div>'+
                                                                    '</div>'+
                                                                '</h3>'+
                                                                '</div>';
    document.getElementById("chat-input").value = "";
     $("#chat-input").animate({height:'30px'},300);
      scrollChat();
}

fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-kshare").innerHTML = myJson.title;
            var messages = myJson.messages;
            messages.content.forEach(function(item,i){

            color = colors['dynamic_user'.split('').reduce((sum, char) => sum + char.codePointAt(0), 0) % colors.length];
            document.getElementById("scrollable-content").innerHTML += '<div class="container-fluid message"  style="">'+
                                                                            '<h3>'+
                                                                                '<div class="row">'+
                                                                                '<div class="col-lg-12" style="text-align:left;" id="message-uname-' + i + '"><b>' + messages.content[i][0] + ' diu: </b>' + messages.content[i][1] + '</div>'+
                                                                                '</div>'+
                                                                            '</h3>'+
                                                                            '</div>'; 
            });

            messages.content.forEach(function(item,i){
              document.getElementById('message-uname-' + i).onclick = function(){
                // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
                //Logging :: button-click interaction
                log_click({itime: 2,message:"Message username (at position " + i + ") clicked", register : log, level:1,type:"TextClick"});
                //console.log("Message uname (at position " + i + ") clicked");
                // --------------------------------------------------------------------------
              };
              // document.getElementById('message-text-' + i).onclick = function(){
              //   // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
              //   //Logging :: button-click interaction
              //   log_click({itime: 2,message:"Message text (at position " + i + ") clicked", register : log, level:1,type:"TextClick"});
              //   //console.log("Message text (at position " + i + ") clicked");
              //   // --------------------------------------------------------------------------
              // };
            });

            scrollChat();             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
