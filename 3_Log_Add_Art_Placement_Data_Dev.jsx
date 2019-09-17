function logAddArtPlacement()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js\"");

	function readConfig()
	{
		var configFile = new File("~/Documents/build_template_config/btconfig.js");

		if(!configFile.exists)
		{
			alert("No Configuration file was found. Please run the configuration script first.");
			return false;
		}

		eval("#include \"" + configFile.fsName + "\"");

		return config;
	}

	function writeDatabaseFile()
	{
		var cenLibFile = centralLibraryFile;
		var thisGarInfo = {};

		var parenPat = /[\(\)]/g;

		thisGarInfo.mockupSize = prompt("Enter the mockup size.","XL").toUpperCase();
		thisGarInfo.scaleFrontLogo = confirm("Should the front logo follow .5\" scaling rule?");
		thisGarInfo.placement = aaPlacement;
		thisGarInfo.createdOn = logTime();
		thisGarInfo.createdBy = user;

		prepressInfo[garCode] = thisGarInfo;

		cenLibFile.open("w");
		cenLibFile.write("var prepressInfo = " + JSON.stringify(prepressInfo).replace(parenPat,""));
		cenLibFile.close();
	}

	var docRef = app.activeDocument;
	var layers = docRef.layers;

	if(valid)
	{
		var config = readConfig();
		if(!config)
		{
			valid = false;
		}
	}

	if(valid)
	{
		var ppLay = getPPLay(layers);
		if(!ppLay)
		{
			errorList.push("Failed to determine the Prepress layer. Check your layer structure.");
			valid = false;
		}
	}
	if(valid)
	{
		var aaPlacement = coord(ppLay);
		var garCode = config.garmentCode;
		var garCodeUnderscore = garCode.replace("-","_");
		var overwrite = true;
		var aaData = prepressInfo[garCodeUnderscore];

		if(!aaData)
		{
			aaData = prepressInfo[garCode];
		}

		if(aaData)
		{
			overwrite = confirm("A database entry exists for " + garCode + ". Do you want to overwrite it?");
		}

		if(overwrite)
		{
			writeDatabaseFile();

			alert("Successfully added " + garCode + " to database. You should be ready to run add_artwork.");
		}
	}

	if(errorList.length>0)
	{
		sendErrors(errorList);
	}
	
	return valid;
	

}
logAddArtPlacement();