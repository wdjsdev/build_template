function logAddArtPlacement()
{
	var valid = true;
	var scriptName = "log_add_art_placement";


	function getUtilities()
	{
		var result;
		var networkPath,utilPath;
		if($.os.match("Windows"))
		{
			networkPath = "//AD4/Customization/";
		}
		else
		{
			networkPath = "/Volumes/Customization/";
		}


		utilPath = decodeURI(networkPath + "Library/Scripts/Script Resources/Data/");

		
		if(Folder(utilPath).exists)
		{
			result = utilPath;
		}

		return result;

	}

	var utilitiesPath = getUtilities();
	if(utilitiesPath)
	{
		eval("#include \"" + utilitiesPath + "Utilities_Container.jsxbin" + "\"");
		eval("#include \"" + utilitiesPath + "Batch_Framework.jsxbin" + "\"");
	}
	else
	{
		alert("Failed to find the utilities..");
		return false;	
	}



	function readConfig()
	{
		var configFile = new File(documentsPath + "build_template_config/btconfig.js");

		if(!configFile.exists)
		{
			alert("No Configuration file was found. Please run the configuration script first.");
			return false;
		}

		eval("#include \"" + configFile.fullName + "\"");

		return config;
	}


	function getAdditionalInfo()
	{
		var result = {};
		var w = new Window("dialog");
			var mockSizeGroup = UI.group(w);
				mockSizeGroup.orientation = "row";
				var msLabel = UI.static(mockSizeGroup,"Choose the Mockup Size: ");
				var msDropdown = UI.dropdown(mockSizeGroup,getSizeLayers());
					msDropdown.selection = 0;
			var logoScalingGroup = UI.group(w);
				var lsLabel = UI.static(logoScalingGroup,"Should the front logo follow .5\" scaling rule?");
				var lsYes = UI.radio(logoScalingGroup,"Yes");
					lsYes.value = true;
				var lsNo = UI.radio(logoScalingGroup,"No");
			var btnGroup = UI.group(w);
				var submit = UI.button(btnGroup,"Submit",validate);

		w.show();

		return result;

		function validate()
		{
			if(msDropdown.selection && (lsYes.value || lsNo.value))
			{
				result.mockupSize = msDropdown.selection.text;
				result.scale = lsYes.value;
				w.close();
			}
			else
			{
				alert("Make sure you've chosen a Mockup Size and a Logo Scaling option.");
			}
		}
	}

	function getSizeLayers()
	{
		var result = [];
		for(var sl=0,len=ppLay.layers.length;sl<len;sl++)
		{
			result.push(ppLay.layers[sl].name);
		}
		return result;
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
		eval("#include \"" + centralLibraryPath + "\"");
		var aaPlacement = coord(ppLay);
		var garCode = config.garmentCode;
		var garCodeUnderscore = garCode.replace("-","_");
		var overwrite = true;
		var aaData = prepressInfo[garCodeUnderscore];
		var additionalInfo;

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
			var thisGarInfo = {};
			additionalInfo = getAdditionalInfo();
			thisGarInfo.mockupSize = additionalInfo.mockupSize;
			thisGarInfo.scaleFrontLogo = additionalInfo.scale;
			thisGarInfo.placement = aaPlacement;
			thisGarInfo.createdOn = logTime();
			thisGarInfo.createdBy = user;
			prepressInfo[garCode] = thisGarInfo;
			var newContents = "var prepressInfo = " + JSON.stringify(prepressInfo);
			
			writeDatabase(centralLibraryFile,newContents);

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