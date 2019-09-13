/*
	
	Script Name: Configure_Build_Template.js
	Author: William Dowling
	Build Date: 31 May, 2017
	Description: Build a config file to be stored on the user's machine that holds
					all the necessary data for a given garment. This config file will
					be accessed by the build_template script.
					Config file will include:
						Garment Code
						CAD layout orientation (vertical or horizontal)
							This determines how the sort function operates.
						Piece Names (in order of how they should be sorted)
						Available Sizes
						Artwork Layer Names

*/

function buildConfig()
{
	var valid = true;

	// //Production Utilities
	// eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	// eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	
	//Dev Utilities
	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Utilities_Container.js\"");
	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Batch_Framework.js\"");



	/*****************************************************************************/
	//==============================  Components  ===============================//

	if(user === "will.dowling")
	{
		logDest.push(File(desktopPath + "/automation/logs/bt_configure_dev_log.txt"));
	}
	else
	{
		logDest.push(File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/bt_configure_log.txt"));
	}

	var devComponents = desktopPath + "/automation/build_template/components";
	var prodComponents = "/Volumes/Customization/Library/Scripts/Script Resources/components/build_template";

	var compFiles = includeComponents(devComponents,prodComponents,false);
	if(compFiles && compFiles.length)
	{
		for(var x=0,len=compFiles.length;x<len;x++)
		{
			try
			{
				eval("#include \"" + compFiles[x].fsName + "\"");
			}
			catch(e)
			{
				errorList.push("Failed to include the component: " + compFiles[x].name);
				log.e("Failed to include the component: " + compFiles[x].name + "::System Error Message: " + e + "::System Error Line: " + e.line);
				valid = false;
			}
		}
	}
	else
	{
		valid = false;
		errorList.push("Failed to find any of the necessary components for this script to work.");
		log.e("Failed to include any components. Exiting script.");
	}

	//=============================  /Components  ===============================//
	/*****************************************************************************/





	//make an asset (checkbox or radio button etc) for each item in the src array
	function makeAssets(group,src,assetType,func)
	{
		var result = [];
		for(var cb=0;cb<src.length;cb++)
		{
			var name = src[cb];
			result[cb] = group.add(assetType, undefined, name);
			if(func)
			{
				result[cb].onClick = func;
			}
		}
		return result;
	}

	function removeEmpties(arr)
	{
		var result = arr;
		for(var re = result.length-1;re >-1; re--)
		{
			if(result[re] == "")
			{
				result.splice(re,1);
			}
		}
		return result;
	}

	function validate(gc,orient,names,sizes,artLocs,artLocInput,selectedWaistSizes)
	{

		var valid = true;
		var errors = "";

		//comma + space regex
		var rmSpacesPat = /[\s]*\,[\s]*/g;

		/////////////////////////
		//validate garment code//
		/////////////////////////
			//valid garment code regex
			var gcPat = /^[A-Z]{2}[-_][0-9]{3,5}([A-Z]*)?$/;

			//set gc to uppercase
			gc = gc.text.toUpperCase();
			if(!gcPat.test(gc))
			{
				valid = false;
				errors += "The garment code you entered was not in the correct format.\n";
			}
			else
			{
				config.garmentCode = gc;
			}

		////////////////////////
		//validate orientation//
		////////////////////////
			//find the selected orientation radio button
			if(orient.children[0].value)
			{
				config.orientation = orient.children[0].text.toLowerCase();;
			}
			else if(orient.children[1].value)
			{
				config.orientation = orient.children[1].text.toLowerCase();
			}
			else
			{
				errors += "The CAD orientation was not properly identified...\n";
				valid = false;
			}

		////////////////////////
		//validate piece names//
		////////////////////////
			
			//remove any spaces preceding or following commas if exist
			names = names.text.replace(rmSpacesPat,",");

			//convert the names string to an array
			names = names.split(",");

			//make sure the length of the new names array is greater than 0
			if(names.length == 0)
			{
				errors += "You must enter all of the piece names.\n";
				valid = false;
			}
			else
			{
				config.pieces = removeEmpties(names);
			}

		//////////////////
		//validate sizes//
		//////////////////
			var sizeArray = [];
			var waistSizeArray = [];

			for(var s=0;s<sizes.children.length;s++)
			{
				var thisChild = sizes.children[s];
				if(thisChild.value)
				{
					sizeArray.push(thisChild.text.toUpperCase());
				}
			}

			if(selectedWaistSizes)
			{
				for(var w=0;w<selectedWaistSizes.children.length;w++)
				{
					var thisChild = selectedWaistSizes.children[w];
					if(thisChild.value)
					{
						waistSizeArray.push(thisChild.text.toUpperCase());
					}
				}
			}

			//make sure there's at least one size
			if(sizeArray.length == 0)
			{
				errors += "You must check a box for each available size.\n";
				valid = false;
			}
			else
			{
				config.sizes = sizeArray;
			}

			if(waistSizeArray.length > 0)
			{
				config.waist = waistSizeArray;
			}

		//////////////////////////
		//validate art locations//
		//////////////////////////
			var locs = [];
			//loop the children of artLocs group
			//push true results to locs
			for(var s=0;s<artLocs.children.length;s++)
			{
				var thisChild = artLocs.children[s];
				if(thisChild.value)
				{
					locs.push(thisChild.text);
				}
			}

			//add in any manually entered locs
			if(artLocInput.text.indexOf("No worries") == -1)
			{
				config.newArtLayers = true;
				artLocInput = artLocInput.text.replace(rmSpacesPat,",");
				artLocInput = artLocInput.split(",");
				for(var ali=0;ali<artLocInput.length;ali++)
				{
					locs.push(artLocInput[ali]);
				}
			}

			//make sure there's at least one art location
			if(locs.length == 0)
			{
				errors += "You must enter or choose at least one artwork location.\n";
				valid = false;
			}
			else
			{
				config.artLayers = removeEmpties(locs);
			}

		//display errors if any
		if(errors != "")
		{
			alert("The following issues exist. Please try again:\n" + errors);
		}

		return valid;

	}

	function deleteExistingChildren(group)
	{
		for(var dec = group.children.length-1;dec >-1; dec--)
		{
			group.remove(group.children[dec]);
		}
	}

	

	function writeConfigFile(config)
	{
		var overwrite = true;

		var configFile = new File(configFileLoc + "/btconfig.js");

		var btConfigLog = new File(centralConfigLoc + "/btconfiglog.txt");

		if(configFile.exists)
		{
			overwrite = confirm("Do you want to overwrite the existing config file?");
		}

		if(overwrite)
		{
			//trim the parentheses from the config.toSource() return value;
			var parenPat = /[\(\)]/g;
			var str = "var config = " + config.toSource().replace(parenPat,"");
			// str = "var config = \n" + str.replace(parenPat,"");

			configFile.open("w");
			configFile.write(str);
			configFile.close();
			alert("Config file has been successfully written.");
		}
		else
		{
			alert("Config file has remained unchanged.");
		}
	}





//end logic container
	


//begin global variable stuff


	//global defaults
	//used for initial default file creation
	//and resetting defaults back to global defaults
	//if personal defaults go haywire.

	var defaultFilesPath = documentsPath + "/build_template_defaults/"
	var defaultFileFolder = Folder(defaultFilesPath);
	if(!defaultFileFolder.exists)
	{
		defaultFileFolder.create();
	}

	//piece names
	var pieceNameOverflowDefaults = ["Left Leg Panel","Right Leg Panel","Fly","Garage"];
	var pieceNameInUseDefaults = ["Front","Back","Left Sleeve","Right Sleeve","Collar"];
	var userDefaultPieceNamesFile = File(defaultFilesPath + "build_template_default_locations.js");
	if(!userDefaultPieceNamesFile.exists)
	{
		writeDefaultFile(userDefaultPieceNamesFile,pieceNameInUseDefaults,pieceNameOverflowDefaults,"pieceName");
	}
	eval("#include \"" + userDefaultPieceNamesFile.fullName + "\"");

	//sizes
	var sizeOverflowDefaults = ["XXXS","XXS","4XL","5XL","24x26","26x19","26x28","28x20","28x28","30x21","30x28","22I","24I","26I","28I","30I","32I","34I"];
	var sizeInUseDefaults = ["XS","S","M","L","XL","2XL","3XL"];
	var userDefaultSizesFile = File(defaultFilesPath + "build_template_default_sizes.js");
	if(!userDefaultSizesFile.exists)
	{
		writeDefaultFile(userDefaultSizesFile,sizeInUseDefaults,sizeOverflowDefaults,"size");
	}

	//waist sizes
	var waistSizeOverflowDefaults = ["27W","29W","31W","33W","35W","42W","44W"];
	var waistSizeInUseDefaults = ["26W","28W","30W","32W","34W","36W","38W","40W"];
	var userDefaultwaistSizesFile = File(defaultFilesPath + "build_template_default_waist_sizes.js");
	if(!userDefaultwaistSizesFile.exists)
	{
		writeDefaultFile(userDefaultwaistSizesFile,waistSizeInUseDefaults,waistSizeOverflowDefaults,"waistSize");
	}

	//artwork locations
	var locationOverflowDefaults = ["Right Cowl", "Left Cowl", "Left Leg", "Right Leg", "Right Hood", "Left Hood", "Front Pocket", "Collar Art", "Right Front Leg", "Left Front Leg"];
	var locationsInUseDefaults = ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Locker Tag","Additional Artwork"];
	var userDefaultLocationsFile = File(defaultFilesPath + "build_template_default_locations.js");
	if(!userDefaultLocationsFile.exists)
	{
		writeDefaultFile(userDefaultLocationsFile,sizeInUseDefaults,sizeOverflowDefaults,"size");
	}

	var configFileLoc = "~/Documents/build_template_config";
	var centralConfigLoc = "/Volumes/Customization/Library/Scripts/Script Resources/Data/";

	//boolean variable to keep track of whether the
	//sizing structure contains variable inseam sizing
	//which changes how the data needs to be logged
	var varyingInseamSizing = false;

	var config =
	{
		"garmentCode":"",
		"orientation":"",
		"pieces":[],
		"sizes":[],
		"artLayers":[],
		"newArtLayers":false
	}

	var sizingStructures = ["Regular Sizing", "Pants Sizing", "Varying Inseams"];

	if(valid && makeDialog())
	{
		writeConfigFile(config);
	}






}
buildConfig();