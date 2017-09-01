
function logCoords()
{
	//logic container
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

	function writeConfigFile(config)
	{
		var result = true;
		var configFile = new File(configFileLoc + "/btconfig.js");

		var btConfigLog = new File(centralConfigLoc + "/build_template_library.js");

		//trim the parentheses from the config.toSource() return value;
		var parenPat = /[\(\)]/g;
		var str = "var config = " + config.toSource().replace(parenPat,"");

		configFile.open("w");
		configFile.write(str);
		configFile.close();

		//import the existing data file
		// #include "/Volumes/Customization/Library/Scripts/Script Resources/Data/btconfiglog.js";
		#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/build_template_library.js";

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

		if(!overwrite)
		{
			alert('No change was made to the data.');
			result = false;
		}
		else
		{
			templateInfo[curGarCode] = config;
			btConfigLog.open("w");
			btConfigLog.write("var templateInfo = " + templateInfo.toSource().replace(parenPat,""));
			btConfigLog.close();
		}
		return result;
		
	}


	function coord()
	{
		var coords = {};
		var layer;

		if(layers[0].name == "To Be Placed")
		{
			layer = layers[1].layers["Prepress"];
		}
		else
		{
			layer = docRef.layers[0].layers["Prepress"];
		}

	
		for(var a=0;a<layer.layers.length;a++)
		{
			var curSize = layer.layers[a].name;
			coords[curSize] = {};
			for(var b=0;b<layer.layers[a].groupItems.length;b++)
			{
				var thisPiece = layer.layers[a].groupItems[b];
				var pieceName = thisPiece.name;
				coords[curSize][pieceName] = [];
				coords[curSize][pieceName][0] = (Math.floor(thisPiece.left *1000)/1000);
				coords[curSize][pieceName][1] = (Math.floor(thisPiece.top *1000)/1000);
			}
				
		}
		return coords;
	}

	//add in the utilities container
	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js";

	//file locations
	var configFileLoc = "~/Documents/";
	var centralConfigLoc = "/Volumes/Customization/Library/Scripts/Script Resources/Data/";

	var docRef = app.activeDocument;
	var layers = docRef.layers;
	
	var config = readConfig();
	if(!config)return;

	config.placement = coord();
	config.createdBy = user;
	config.createdOn = logTime();

	if(writeConfigFile(config))
		alert("Successfully added the placement data to your config file. You should be ready to build some templates!!! =)");

}
logCoords();