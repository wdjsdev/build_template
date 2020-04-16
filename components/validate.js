function validate(garmentCode,pieces,sizes,waistSizes,artLocs)
{
	var result = true;
	var errors = "";

	//comma + space regex
	var rmSpacesPat = /[\s]*\,[\s]*/g;

	//valid garment code regex
	var gcPat = /^[A-Z]{2}[-_][0-9]{3,5}([A-Z]*)?$/;


	//validate the garment code
	garmentCode = garmentCode.toUpperCase();
	garmentCode = garmentCode.replace("_","-");
	// if(!gcPat.test(garmentCode))
	// {
	// 	result = false;
	// 	errors += "The garment code you entered was not in the correct format.\n";
	// }
	// else
	// {
	// 	config.garmentCode = garmentCode;
	// }

	//removed the validation because there are too many possible formats at this time.
	config.garmentCode = garmentCode;

	//set orientation preference
	config.orientation = cadOrientation;

	//validate the piecenames
	processInputBox(pieces,"pieces");

	//validate the sizes
	processInputBox(sizes,"sizes");

	//validate the waist sizes
	if(varyingInseamSizing)
	{
		processInputBox(waistSizes,"waist")
	}

	//validate the artwork locations
	processInputBox(artLocs,"artLayers");


	//display errors if any
	if(errors != "")
	{
		alert("The following issues exist. Please try again:\n" + errors);
	}

	return result;


	function processInputBox(txt,label)
	{
		if(txt === "")
		{
			result = false;
			errors += "The input box for " + label + " cannot be empty.";
			return;
		}
		
		txt = txt.replace(rmSpacesPat,",");
		var newArray = txt.split(",");
		if(label === "sizes" || label === "waistSizes")
		{
			for(var x=0,len=newArray.length;x<len;x++)
			{
				newArray[x] = newArray[x].toUpperCase();
			}
		}
		else
		{
			for(var x=0,len=newArray.length;x<len;x++)
			{
				newArray[x] = newArray[x].toTitleCase();
			}
		}
		
		config[label] = newArray;
	}

}