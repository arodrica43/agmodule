

  /*var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];


  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    //location.reload();
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      //location.reload();
    }
  }*/

fetch("called_mechanic_url") // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
          //alert("entering");
            return response.json();
        })
        .then(function (myJson) {
            document.querySelector("#header-lot").innerHTML = myJson.title;
            //document.querySelector("#options").value = JSON.parse(myJson.items);
            //alert(document.querySelector("#options").value );
            //alert("Before render");
            document.querySelector("#options").value = myJson.items;
            //document.querySelector("#token").value = myJson.token;
            
            drawRouletteWheel();
            //document.querySelector("#mechanic_html").innerHTML = myJson.html;
            //$(myJson.html).appendTo(document.body); // WARNING:  enabling this turns into a recursive call to server
            //document.querySelector("#score").innerHTML = "Your " + myJson.given_by + " is " + myJson.score ;
            //document.querySelector("#uname").innerHTML = "Username: " + myJson.user ;

             
        })
        .catch(function (error) {
            console.log("Error: " + error);
        }); 

  //INTERACTION INIT -----------------------------------------------------------------------
    //Dynamic property :: Log tracking functions
    include-base-tracking
    include-onclick-tracking
    start_main_time();
    start_focus_time("main-content-lot");
    start_logs(log,"dynamic_user", "dynamic_mechanic_index",30);
    // ---------------------------------------------------------------------------------------

  document.querySelector("#button_div").innerHTML = '<input class="btn btn-light" type="button" class="btn btn-primary" value="spin" id="spin" />';
  document.querySelector("#roulette_div").innerHTML = ' <canvas id="canvas" width="' + (window.innerWidth/2) + '" height="' + (window.innerHeight/2) + '"></canvas>';
  document.querySelector("#roulette_div").onclick = function(){
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 2, message:"Roulette image clicked", register : log, level:1,type:"ImageClick"});
    // --------------------------------------------------------------------------
  }

  //Options and Arc are dynamically charged through <param>


  var ox = window.innerWidth/2 - document.getElementById("canvas").width/2;//document.getElementById("canvas").offsetLeft + 50;
  var oy = window.innerHeight/2 - document.getElementById("canvas").height/2;

  var startAngle = 0;
  var spinTimeout = null;

  var spinArcStart = 10;
  var spinTime = 0;
  var spinTimeTotal = 0;

  var ctx;

  document.getElementById("spin").addEventListener("click", spin);

  function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }

  function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }

  function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI*2/(maxitem);
    
    //red   = Math.sin(frequency*item+2+phase) * width + center;
    //green = 0;//Math.sin(frequency*item+0+phase) * width + center;
    //blue  = 0;//Math.sin(frequency*item+4+phase) * width + center;
    
    var color_idx = item % 2;
    colors = [[255,102,102],[153,204,204]];
    red = colors[color_idx][0];
    green = colors[color_idx][1];
    blue = colors[color_idx][2];

    return RGB2Color(red,green,blue);
  }

  function drawRouletteWheel() {

    var options  = JSON.parse(document.querySelector("#options").value);
    var arc = Math.PI / (options.length / 2);
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
      var reference = Math.min(canvas.width, canvas.height);
      var outsideRadius = reference/(2.5);
      var textRadius = reference/(3.5);
      var insideRadius = reference/(4.5);

      ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,500,500);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.1;

      ctx.font = 'bold 12px Helvetica, Arial';
      
      for(var i = 0; i < options.length; i++) {
        var angle = startAngle + i * arc;
        ctx.fillStyle = getColor(i, options.length);

        ctx.beginPath();
        ctx.arc(ox, oy, outsideRadius, angle, angle + arc, false);
        ctx.arc(ox, oy, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();

        ctx.save();
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur    = 0;
        ctx.shadowColor   = "rgb(220,220,220)";
        ctx.fillStyle = "black";
        ctx.translate(ox + Math.cos(angle + arc / 2) * textRadius, 
                      oy + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        var text = options[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      } 

      //Arrow
      var my_gradient = ctx.createLinearGradient(0, 0, 0, 65);
      my_gradient.addColorStop(0, "white");
      my_gradient.addColorStop(1, "black");
      ctx.fillStyle = my_gradient;
      ctx.beginPath();
      ctx.moveTo(ox - 4, oy - (1.05*outsideRadius + 5));
      ctx.lineTo(ox + 4, oy - (1.05*outsideRadius + 5));
      ctx.lineTo(ox + 4, oy - (outsideRadius - 5));
      ctx.lineTo(ox + 9, oy - (outsideRadius - 5));
      ctx.lineTo(ox + 0, oy - (outsideRadius - 13));
      ctx.lineTo(ox - 9, oy - (outsideRadius - 5));
      ctx.lineTo(ox - 4, oy - (outsideRadius - 5));
      ctx.lineTo(ox - 4, oy - (outsideRadius + 5));
      ctx.fill();
    }
  }

  function spin() {
    // INTERACTION OCCURRENCE REGISTRATION --------------------------------------
    //Logging :: button-click interaction
    log_click({itime: 1, message:"Spin button clicked", register : log, level:1,type:"ButtonClick"});
    // --------------------------------------------------------------------------
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
  }

  function rotateWheel() {
    //options  = JSON.parse(document.querySelector("#options").value);
    spinTime += 30;
    if(spinTime >= spinTimeTotal) {
      stopRotateWheel();
      return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
  }

  function stopRotateWheel() {
    var options  = JSON.parse(document.querySelector("#options").value);
    var arc = Math.PI / (options.length / 2);
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    var text = options[index]
    ctx.fillText(text, ox - ctx.measureText(text).width / 2, oy + 10);
    
      fetch("called_mechanic_url&prize=" + text) // WARNING: should be replaced by a concrete mechanic url
        .then(function (response) {
          //alert("entering");
            return response.json();
        })
        .then(function (myJson) {
            alert("You win " + text + " " + myJson.by);
        })
        .catch(function (error) {
            console.log("Error: " + error);
        }); 
    ctx.restore();
  }

  function easeOut(t, b, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
  }


      