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
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	
	// Dev Utilities
	// eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Utilities_Container.js\"");
	// eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Batch_Framework.js\"");




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

	

	var userDefaults = {
		"piece_names": 
		{
			"overflow":[],
			"inUse":[],
			"file":File(defaultFilesPath + "build_template_default_piece_names.js")
		},
		"sizes":
		{
			"overflow":[],
			"inUse":[],
			"file":File(defaultFilesPath + "build_template_default_sizes.js")
		},
		"waist_sizes":
		{
			"overflow":[],
			"inUse":[],
			"file":File(defaultFilesPath + "build_template_default_waist_sizes.js")	
		},
		"locations":
		{
			"overflow":[],
			"inUse":[],
			"file":File(defaultFilesPath + "build_template_default_locations.js")
		}
	}

	for(var list in userDefaults)
	{
		if(!userDefaults[list].file.exists)
		{
			writeDefaultFile(userDefaults[list].file,MASTER_DEFAULTS[list].inUse,MASTER_DEFAULTS[list].overflow);
		}
		eval("#include \"" + userDefaults[list].file.fullName + "\"");
		userDefaults[list].inUse = inUse;
		userDefaults[list].overflow = overflow; 
	}

	

	//boolean variable to keep track of whether the
	//sizing structure contains variable inseam sizing
	//which changes how the data needs to be logged
	var varyingInseamSizing = false;

	//variable to keep track of orientation of the CAD
	var cadOrientation = "vertical";

	var configFileLoc = documentsPath + "build_template_config";
	if(!Folder(configFileLoc).exists)
	{
		Folder(configFileLoc).create();
	}
	var centralConfigLoc = "/Volumes/Customization/Library/Scripts/Script Resources/Data/";
	var config =
	{
		"garmentCode":"",
		"orientation":"",
		"pieces":[],
		"sizes":[],
		"waist":undefined,
		"artLayers":[]
	}

	var sizingStructures = ["Regular Sizing", "Pants Sizing", "Varying Inseams"];

	if(valid && makeDialog())
	{
		writeConfigFile(config);
	}






}
buildConfig();