function logAddArtPlacement()
{
	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js";
	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js";

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

	function writeDatabaseFile()
	{
		var cenLibFile = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js");
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
		// $.writeln("var prepressInfo = " + JSON.stringify(prepressInfo).replace(parenPat,""));



	}







	var docRef = app.activeDocument;
	var layers = docRef.layers;

	var config = readConfig();
	if(!config)
	{
		return;
	}

	var aaPlacement = coord();

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
logAddArtPlacement();