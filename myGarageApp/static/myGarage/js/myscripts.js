function loadXMLDoc() {
	var xmlhttp;
	if (window.XMLHttpRequest) {
	  // code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else {
	  // code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	    document.getElementById("secDiv").innerHTML="The selected car is ";
	    document.getElementById("myDiv").innerHTML=xmlhttp.responseText;		    
	  }
	}
	var e = document.getElementById("selectedCar"); 
	var strCar = e.options[e.selectedIndex].value; 
	//alert(strCar);
	xmlhttp.open("GET","/garage/" + strCar,true);
	xmlhttp.send();
}


function setItemMenuActive(hrefValue) {
	if(window.location.href.indexOf(hrefValue) > -1) {			       
       var selectedItemDiv = $('.imgListItemBinding').has('a[href="/'+hrefValue+'/"]');			       
       $(selectedItemDiv).attr('id', 'active');
       $(selectedItemDiv).find('#arrow').css("visibility", "visible");			       
       $(selectedItemDiv).prev().find('li a').css( "border-bottom", "none" );
       
       addOrangeImages();			       
    }		   
}
		   
function addOrangeImages() {		    
	var initialSrc = $('#active').find('img').attr('src');	   		
	var n = initialSrc.lastIndexOf("/");
	var shortPath = initialSrc.substring(n+1);	   		
	var newShortPath = "orange_" + shortPath;
	var newSrc = initialSrc.substring(0, n+1) + newShortPath;
	//alert(newSrc);	   		
	$('#active').find('img').attr('src', newSrc);	   		
}	  
	   

function removeValidationAlert(x) {				
	$(x).removeClass('validationAlert'); 
	$(x).addClass('noValidationAlert'); 
}		

function addValidation() {
	var elements = document.getElementsByClassName('pop');		  
    var index;
    for (index = 0; index < elements.length; ++index) {
  	  if (elements[index].getAttribute("data-content")){
  	      elements[index].className = elements[index].className.replace( /(?:^|\s)noValidationAlert(?!\S)/g , '' )
  		  elements[index].className += " validationAlert";		  				  		
  	  }		  	
    }		  
  		  	
    $(".pop").popover({ trigger: 'focus', html: 'true'});		  
    $('.validationAlert').filter(':visible:first').focus();	
}


function addNewRow() {		   		
	var tempRow = $("#operations").find('#newRow table').find('tbody:last tr');		   		
	var columnNames = $('.records').find('thead').find("th");
	
	for (i=0; i< columnNames.length; i++) {		   			
		var columnName = $(columnNames[i]).text();		
		var inputName = getNameForTableInput(columnName);
		var newId = "id_";
		var cssProperty = "";
		var cssValue = "";
	    if(columnName.indexOf("date") > -1) {
	    	newId = newId + "datepicker";	    	
	    	cssProperty = "width";
	    	cssValue = "85%";
	    	inputName = inputName + '_userOnly';
	    }	
	    else {
	    	newId = newId + "" + inputName;
	    }
				
		//generate the tempFields		   			
		tempRow.append($('<td>')
			   .append($('<input>')		   					
				   .prop('type', 'text')
				   .attr('class', 'tempInput')
				   .css(cssProperty, cssValue)
				   .attr('name', inputName)
				   .attr('id', newId)));  
				   
	}
	
	tempRow.find('td').first().append($('<input>')		   					
				   .prop('type', 'hidden')			   
				   .attr('name', 'refuel_date')
				   .attr('id', 'altDateField'));
	
	$("#id_datepicker").datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		dateFormat: 'dd M. yy',
		altField: "#altDateField",
		altFormat: "yy-mm-dd",
		showOn: "both",
		buttonText: 'Show Date',
		buttonImageOnly: true,
		buttonImage: "/myGarageApp/static/myGarage/img/calendar.png"						
	});
	
	
	 $(".ui-datepicker-trigger").mouseover(function() {
        $(this).css('cursor', 'pointer');
    });
    
    // for every tempField bind the appropriate validation 
     $('.tempInput ').not("#id_datepicker").each(function(index, element) {
     		var elementID = $(element).attr('id');     		    		
     		if( digitsOnlyValidationArray.indexOf(elementID) > -1) {     								
					$('#' + elementID).keyup(digitsOnlyValidation);					
			}	
			//else if in stringOnlyValidationArray etc			
		   								
     });
     
     
    
     
     
     //$('#id_sum_refuelled').keyup(digitsOnlyValidation);

	$('#addRecord').attr('disabled', 'disabled');	   		
	diminishMainTableAppearace();		   		  			   		
	$("#operations").find('#newRow').css('display', 'block');	   										
}

function digitsOnlyValidation() { 	      
	var inputValue = $(this).val();	
	var elementID = $(this).attr('id');	
	var isnum = /^\d+$/.test(inputValue); 
	if (inputValue === "") {
		isnum = true;
	}	
	addObjToValidationsArray(validationsArray, elementID, isnum, 'digitsOnly');		
	var falseDigitsOnlyArray = validateTempFieldsByType('digitsOnly');	
	
	if(!isnum ) {	
		var name =  getNameFromId(elementID);			
		$('.addNewRecordTip').text('Only numbers allowed for '+ name +' !');
		$('#' + elementID).css('outline', '1px solid red');			
	} 				
	else {		
		$('.addNewRecordTip').text('');
		$('#' + elementID).css('outline', '');	
			
		if(falseDigitsOnlyArray.length > 0) {			
			var lastElem = falseDigitsOnlyArray[falseDigitsOnlyArray.length-1];
			var name = getNameFromId(lastElem);
			$('.addNewRecordTip').text('Only numbers allowed for '+ name +' !');		
		} 				
	}  	
}

function getNameFromId(id) {
	var firstOccurrenceOfUnderline = id.indexOf('_');
	var name = id.substring(firstOccurrenceOfUnderline+1);
	name = name.replace("_"," ");
	name = name.charAt(0).toUpperCase() + name.slice(1);
	return name;
}


function addObjToValidationsArray(array, property, value, validationType) {	
	// if id already exists replace it's value
	// otherwise add new obj
	
	var i, object = {};
	for (i = 0; i < array.length; i++) { 	  	
    	if(array[i].hasOwnProperty(property)){    		
    		 array[i][property] = value; 
    		 return;   		 
    	}     	  	
    }	
    object[property] = value;
    object['validationTypeKey'] =  validationType;
    array.push(object);         
}


function setColumnsWidth() {
	var columnNames = $('.records').find('thead').find("th");
	var widthValue = 100/(columnNames.length) + "%";
	$('.records').find('thead').find("th").css('width', widthValue);
	$('.records').find('tbody').find("td").css('width', widthValue);
	

}


function closeNewRow() {
	restoreMainTableAppearance();		   	
		
	$("#operations").find('#newRow').css('display', 'none');		   		
	$('#tempTable').find('tbody tr').find('td').remove();
	$('#addRecord').removeAttr('disabled');
}
		   
		   
function restoreMainTableAppearance() {
	//restore initial css style
	$('#operations').css('background-color', ' #ffffff');
	$('#operations').removeClass('diminishedBorderShade').addClass("addBorderShade");
	$( "tbody tr:odd" ).css( "background-color", "#F0FFD6" );
	$('.records').find('thead').css('background-color', '#8a9772');
	$('.records').find('th').css('border', '1px solid #8a9772');
	$('.records').find('td').css('border', '1px solid #8a9772');
}		   
		   
function diminishMainTableAppearace() {
	$('#newRow').attr('class', 'addBorderShade');
	$('#operations').removeClass('addBorderShade').addClass("diminishedBorderShade");
	$('#operations').css('background-color', ' #f9fafc'); 	
	$( "#operations").find("tbody tr:odd" ).css( "background-color", "#f9fafc" );	   		
	$('.records').find('thead').css('background-color', '#a4ae91');
	$('.records').find('th').css('border', '1px solid #a4ae91');
	$('.records').find('td').css('border', '1px solid #a4ae91');
}


function getNameForTableInput(columnName) {
	var firstLetter = columnName.charAt(0).toLowerCase();		   		
	var tempName = firstLetter + columnName.substring(1);		   		
	var name = tempName.replace(/ /g,"_");			   			
	return name;   
}
		   

 function validateTempFields(){			   		   			   		
	//check validationsArray if it has a false value in it		
	// also check for empty fields   			
		   					   					        	
	for (var i=0; i<validationsArray.length; i++) {	
		for (var key in validationsArray[i]) {	
			   if (key === "validationTypeKey") {	
			   		continue;
			   }				   
			   else if(!validationsArray[i][key]){										
			   		return false;						   										  							 
			   }
		}				
	}
	
	// check for empty fields
	$('.tempInput ').each(function(index, element) {
		var elemValue = $(element).val();
		if (elemValue === "") {
			$('.addNewRecordTip').text('All fields are required!');
			return false;
		}
	});					
	
	return true;				
}			   
		   
function validateTempFieldsByID(id) {
	//returns boolean 
	//checks if elementId is valid or not
	
	for (var i=0; i<validationsArray.length; i++) {	
		for (var key in validationsArray[i]) {
			   if (key === "validationTypeKey") {	
			   		continue;
			   }							   
			   else if(!validationsArray[i][key] && key === id){										
					return false;								  							 
			   }
		}				
	}
	return true;			
} 
		   
function validateTempFieldsByType(validationTypeArg) {
	// returns an array containing the elements' id with false status		   			
    var idsArray = []; 	
    var status = true;	
    var elementID = "";		   	    
		
	for (var i=0; i<validationsArray.length; i++) {	
	    status = true;
		for (var key in validationsArray[i]) {
			   if (key === "validationTypeKey") {
			   		 if(!status && validationsArray[i]['validationTypeKey'] === validationTypeArg) {
			   		 	idsArray.push(elementID);
			   		 }
			   }		  
			   else if(!validationsArray[i][key]){										
					status = false;		
					elementID = key;						  								  
			   }
		}				
	}
	return idsArray;			
}		   





