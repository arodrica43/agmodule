// Externally there should be a variable named "interactable_elements"

//var interactable_elements = document.getElementById("main-content-X").querySelectorAll("*");
var clickables = [];
var scrollables = [];
var focusables = [];
var all_interactables = [clickables, scrollables, focusables];
alert = function() {};

// Disable alerts to speed up the bot
//alert = function() {};

function init_auto_interactions(interactable_elements) {
    for (var i = 0; i < interactable_elements.length; i++) {
        //console.log(interactable_elements[i]);
        if (typeof interactable_elements[i].onclick === 'function') {
            // do something with the element here
            clickables.push(interactable_elements[i]);
            //console.log("Clickable " + interactable_elements[i]);
        } else if (typeof interactable_elements[i].onscroll === 'function') {
            // do something with the element here
            scrollables.push(interactable_elements[i]);
            //console.log("Scrollable " + interactable_elements[i]);
        } else if (typeof interactable_elements[i].onfocus === 'function') {
            // do something with the element here
            focusables.push(interactable_elements[i]);
            //console.log("Focusable " + interactable_elements[i]);
        }
    }
}

//Bot definition
var bot_timer;
var refresh_timer;
var refresh_count = 0;

function interact(i, j, expected_valoration) { //authomatic event firing function

    if (all_interactables[i].length > 0) {
        var elem = all_interactables[i][j];
        //alert(i + " " + j + " :: " + all_interactables.length + " " + all_interactables[i].length);
        switch (i) {
            case 0:
            	// star-5-dynamic_index
            	if((elem.id).includes("star-")){
            		if((elem.id).charAt(5) == expected_valoration){ // EXTERNAL VAR :: expected valoration 
            			elem.click();
            		}

            	}else{
                	elem.click();
            	}
                break;
            case 1:
                var scroll_w = Math.floor((Math.random() * elem.scrollWidth) + 1);
                var scroll_h = Math.floor((Math.random() * elem.scrollHeight) + 1);
                elem.scrollTo(scroll_w, scroll_h);
                break;
            case 2:
                elem.focus();
                if (elem.type == "text") {
                    elem.value = Math.floor((Math.random() * 1000) + 1);
                }
                break;
        }
    }
}

function startBot(main_content_name, interaction_speed, expected_valoration) {

	refresh_timer = setInterval(function() {
        refresh_count++;
        if (refresh_count % (15) == 0) { // every 20 seconds, refresh
            console.log("refresh!");
            window.location.reload();
        } 

    }, 1000, "JavaScript"); // EXTERNAL VAR :: interaction speed

    bot_timer = setInterval(function() {
        interactable_elements = document.getElementById(main_content_name).querySelectorAll("*");
        //console.log(interactable_elements);;
        clickables = [];
        scrollables = [];
        focusables = [];
        all_interactables = [clickables, scrollables, focusables];
        init_auto_interactions(interactable_elements);

        var type_idx = Math.floor(Math.random() * all_interactables.length);
        var elem_idx = Math.floor(Math.random() * all_interactables[type_idx].length);
        
        interact(type_idx, elem_idx, expected_valoration);
        

    }, interaction_speed*100, "JavaScript"); // EXTERNAL VAR :: interaction speed
}

function stopBot() {
    clearInterval(bot_timer);
}