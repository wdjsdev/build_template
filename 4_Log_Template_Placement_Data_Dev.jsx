
function logCoords()
{
	var valid = true;
	var scriptName = "log_template_placement";

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


	//file locations
	var configFile = new File(documentsPath + "build_template_config/btconfig.js");

	//logic container
	function readConfig()
	{
		if(!configFile.exists)
		{
			alert("No Configuration file was found. Please run the configuration script first.");
			return false;
		}

		eval("#include \"" + configFile.fullName + "\"");

		return config;
	}

	function writeConfigFile(config)
	{
		var result = true;

		var btConfigLog = btLibraryFile;

		var str = "var config = " + JSON.stringify(config);

		configFile.open("w");
		configFile.write(str);
		configFile.close();

		//import the existing data file
		eval("#include \"" + btLibraryPath + "\"");

		var btData, person;
		var curGarCode = config.garmentCode;
		var curGarCodeConverted = config.garmentCode.replace("-","_");
		var overwrite = true;
		var dataExists;

		//check for existence of database entry for this garment code
		if(templateInfo[curGarCode])
		{
			btData = templateInfo[curGarCode];
			dataExists = true;
		}
		else if(templateInfo[curGarCodeConverted])
		{
			curGarCode = curGarCodeConverted;
			btData = curGarCode;
			dataExists = true;
		}

		if(btData && btData.createdBy)
		{
			person = btData.createdBy;
		}
		else
		{
			person = "somebody";
		}

		if(dataExists)
		{
			overwrite = confirm("Woops. It looks like " + person + " has already created a database entry for " + curGarCode + 
				".\nPlease check with them to make sure you're not both working on the same thing at the same time.\n" + 
				"Do you want to overwrite the existing data?");
		}

		if(overwrite)
		{
			templateInfo[curGarCode] = config;
			var newContents = "var templateInfo = " + JSON.stringify(templateInfo);
			writeDatabase(btConfigLog,newContents);
		}
		else
		{
			alert('No change was made to the data.');
			result = false;
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
			errorList.push("Failed to find the prepress layer. Please check your layer structure and try again..");
			valid = false;
		}
	}
	if(valid)
	{
		config.placement = coord(ppLay);
		config.createdBy = user;
		config.createdOn = logTime();
	}

	

	if(valid)
	{
		if(writeConfigFile(config))
		{
			alert("Successfully added the placement data to your config file. You should be ready to build some templates!!! =)");
		}
	}

	if(errorList.length > 0)
	{
		sendErrors(errorList);
	}
	return valid;

}
logCoords();