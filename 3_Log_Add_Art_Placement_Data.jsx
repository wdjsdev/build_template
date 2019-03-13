function logAddArtPlacement()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js\"");

	function readConfig()
	{
		var configFile = new File("~/Documents/btconfig.js");

		if(!configFile.exists)
		{
			alert("No Configuration file was found. Please run the configuration script first.");
			return false;
		}

		eval("#include \"" + configFile.fsName + "\"");

		return config;
	}

	function getMockupSize()
	{
		var result;
		var sizes = [];

		for(var x=0,len=ppLay.layers.length;x<len;x++)
		{
			sizes.push(ppLay.layers[x].name);
		}

		var w = new Window("dialog","Choose Mockup Size");
			var txt = UI.static(w,"Select the proper mockup size.");
			var ddList = UI.dropdown(w,sizes);
			var btnGroup = UI.group(w);
				var cancel = UI.button(btnGroup,"Cancel",function()
				{
					w.close();
				})
				var submit = UI.button(btnGroup,"Submit", function()
				{
					if(ddList.selection)
					{
						result = ddList.selection.text;
						w.close();
					}
					else
					{
						alert("Make a selection");
					}
				})
		w.show();
		return result;
	}

	function writeDatabaseFile()
	{
		var cenLibFile = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js");
		var thisGarInfo = {};

		var parenPat = /[\(\)]/g;

		// thisGarInfo.mockupSize = prompt("Enter the mockup size.","XL").toUpperCase();
		thisGarInfo.mockupSize = getMockupSize();
		if(!thisGarInfo.mockupSize)
		{
			errorList.push("Failed to get the proper mockup size.");
			return;
		}
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