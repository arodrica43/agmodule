
    // TO DO :: Serve as a mechanic and log interactions
    var modal = document.getElementById("details-modal-dynamic_index");
    var span = document.getElementsByClassName("close")[0];
    var global_vars = {};
    span.onclick = function() {
      modal.style.display = "none";
      document.getElementById("main-modal").style.display="none";
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("main-modal").style.display="none";
      }
    }
    function showBadgeDetails(object){
        console.log(object.dataset);
        var locked_style = "";
        if(object.dataset.unlocked == "false"){
            locked_style = 'style="-webkit-filter: brightness(1%);filter: brightness(1%);"';
        }
        document.querySelector("#modal-content-body-dynamic_index").innerHTML = '<div>' + 
                                                                                     '<img ' + locked_style + ' src="' + object.src + '">' +
                                                                                     '<div><h2>' + object.dataset.name + '</h2></div>' +
                                                                                     '<div style="margin:20px;"><h3>Increase ' + object.dataset.by + ' over ' + object.dataset.threshold + '</h3></div>' +
                                                                                    '</div>';
        modal.style.display = "block";
    }

    function showUnlockableDetails(object){
        console.log(object.dataset);
        if(object.dataset.unlocked == "true"){
            document.querySelector("#modal-content-body-dynamic_index").innerHTML = object.dataset.locked_content;
            //$(object.dataset.locked_content).appendTo(document.body);
            modal.style.display = "block";
        }  
    }

    function claimReward(object){
        fetch("https://agmodule.herokuapp.com/api/challenges/claim_reward/" + object.dataset.id + "/dynamic_user")
        .then(response => response.json())
        .then(res_json => (res_json.results))
        .then(function(ok){
            if(ok == "OK"){
                object.innerHTML = "Claimed!";
                object.disabled = true;
            }
        })
        .catch(error => (console.log("Error: " + error)))

    }

function loadMechanic(mechanic){
    try{
         global_vars["mech_title"] = mechanic.dataset.title; 
    }catch{
        global_vars["mech_title"] = 0;   
    }
   
	fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + mechanic.dataset.id + "/?user=dynamic_user")
	    .then((response)  => (response.json()))
	    .then(function (myJson) {

	        document.querySelector("#modal-content-body-dynamic_index").innerHTML = myJson.html;
	        $(myJson.html).appendTo(document.body);
        	modal.style.display = "block";
	        
	    })
	    .catch((error) => console.log("Error: " + error));
}

function populateNaiveGrid(item,index){
    fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + item.id + "/?user=dynamic_user")
        .then((response)  => (response.json()))
        .then(function (myJson) {
            document.querySelector("#modal-content-body-dynamic_index").innerHTML = myJson.html;
            $(myJson.html).appendTo(document.body);
            modal.style.display = "block";            
        })
        .catch((error) => console.log("Error: " + error));

    //document.querySelector("#links-dynamic_index").innerHTML += '<p style="text-align:center;"><button onclick="loadMechanic(this);" data-id=' + item.id + '>' + item.title + '</button></p>';
}

function populateDevToolsGrid(item,index){
    document.querySelector("#links-dynamic_index").innerHTML += '<p style="text-align:center;"><button onclick="loadMechanic(this);" data-id=' + item.id + ' data-title=\"' + item.title + '\">' + item.title + '</button</p>';
}

function populateEEggGrid(item,index){

    r = (index % 15) + 1;
    icon = "https://agmodule.herokuapp.com/media/easter_egg_icons/EasterEggs_" + r + ".png";
    
    document.querySelector("#h-grid-dynamic_index").innerHTML += '<div><img style="height:130px;" onclick="loadMechanic(this);" data-id=' + item.id + ' src="' + icon + '"></div>';
}

function populateLevelsGrid(item,index){
    document.querySelector("#links-dynamic_index").innerHTML += '<p style="text-align:center;"><button onclick="alert(1);">' + item.title + '</button</p>';
}


function populateBadgesGrid(item,index){
    var locked_style = "";
    if(!item[1]){
        locked_style = 'style="-webkit-filter: brightness(1%);filter: brightness(1%);"';
    }
    document.querySelector("#h-grid-dynamic_index").innerHTML += '<div><img ' + locked_style + ' src="' + item[0].icon + 
                                                                '" onclick="showBadgeDetails(this);" data-unlocked=' + item[1] +
                                                                    ' data-id=' + item[0].id +
                                                                    ' data-by=' + item[0].by +
                                                                    ' data-threshold=' + item[0].threshold +
                                                                    ' data-name="' + item[0].name + '"' +
                                                                ' ></div>';
}

function populateUnlockablesGrid(item,index){
    console.log("Unlocked :: " + item[1]);
    var icon = "";
    if(item[1]){
        icon = item[0].icon;
    }else{
        icon = "https://agmodule.herokuapp.com/media/badge_icons/locked.png";
    }
    console.log(item[0].name);
    document.querySelector("#h-grid-dynamic_index").innerHTML += '<div><img src="' + icon + 
                                                                '" onclick="showUnlockableDetails(this);" data-unlocked=' + item[1] +
                                                                    ' data-id=' + item[0].id +
                                                                    ' data-by=' + item[0].by +
                                                                    ' data-threshold=' + item[0].threshold +
                                                                    ' data-name="' + item[0].name + '"' +
                                                                    ' data-locked_content=\'' + item[0].locked_html.replace(/\'/g," ") + '\'' +
                                                                ' ></div>';
}

function populateChallengesGrid(item,index){
    console.log("Unlocked :: " + item[1]);
    var locked_style = '<button  style="float:right;margin:15px; width:50%;" onclick="claimReward(this)" data-id=' + item[0].id + '>Claim</button>';
    if(!item[1]){
        locked_style = '<progress style="float:right;margin:15px; width:50%;" value="' + item[2] + '" max="' + item[0].threshold + '"></progress>';
    }else if(item[3]){
        locked_style = '<button  style="float:right;margin:15px; width:50%;" onclick="claimReward(this)" data-id=' + item[0].id + ' disabled>Claimed!</button>';
    }
    console.log(item[0].name);
    console.log(item);
    document.querySelector("#v-grid-dynamic_index").innerHTML += '<div style="text-align:center; position:relative;"><h3 style="position:relative;top:0;">Repte ' + index + '</h3>' +
                                                                    '<img style="float:left; width:30%; padding-left:20px;margin-top:-20px" src="https://agmodule.herokuapp.com/media/challenge_icons/Challenge_01.gif">' + locked_style +  
                                                                    '<h4 style="position:absolute;bottom: 25px; right: 20px;"> ' + item[0].by + ' : ' + item[2] + ' / ' + item[0].threshold + ' </h4> ' +
                                                                    '<h4 style="position:absolute;bottom: 0; right: 20px;"> Reward : +' + item[0].reward_value + ' ' + item[0].reward_by + ' </h4> ' +
                                                                ' </div>';
}
fetch("called_mechanic_url")
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        var url = "";
        var populate_grid = "";
        if(myJson.mechanic == "badges" || myJson.mechanic == "unlockables" || myJson.mechanic == "challenges"){
            url = "https://agmodule.herokuapp.com/api/" + myJson.mechanic + "/retrieve_for_user/dynamic_user?course_id=dynamic_course_id";
            if(myJson.mechanic == "badges") {
                populate_grid = populateBadgesGrid;
            }else if(myJson.mechanic == "unlockables") {
                populate_grid = populateUnlockablesGrid;
            }else if(myJson.mechanic == "challenges") {
                populate_grid = populateChallengesGrid;
            }
        }else{
            url = "https://agmodule.herokuapp.com/api/" + myJson.mechanic + "/" 
            populate_grid = populateNaiveGrid;
             if(myJson.mechanic == "easter_eggs") {
                populate_grid = populateEEggGrid;
            } else if(myJson.mechanic == "development_tools"){
                populate_grid = populateDevToolsGrid;
            }
        }
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(res_json => (res_json.results))
            .then((list) => (list.forEach(populate_grid)))
            .catch(error => (console.log("Error: " + error)))
    })
    .catch(function (error) {
        console.log("Error: " + error);
    });
