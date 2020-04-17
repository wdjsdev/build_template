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
	var scriptName = "build_template_config";

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


	/*****************************************************************************/
	//==============================  Components  ===============================//

	logDest.push(getLogDest());

	var devComponents = desktopPath + "automation/build_template/components";
	var prodComponents = componentsPath + "build_template";

	var compFiles = includeComponents(devComponents,prodComponents,false);
	if(compFiles && compFiles.length)
	{
		for(var x=0,len=compFiles.length;x<len;x++)
		{
			try
			{
				eval("#include \"" + compFiles[x].fullName + "\"");
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

	var defaultFilesPath = documentsPath + "build_template_defaults/"
	var defaultFileFolder = Folder(defaultFilesPath);
	if(!defaultFileFolder.exists)
	{
		defaultFileFolder.create();
	}

	//check to see whether the folder still doesn't exist..
	//if so, then likely there's an issue with naming of the
	//main hard drive?
	if(!defaultFileFolder.exists)
	{
		defaultFilesPath = "~/Documents/build_template_defaults/";
		defaultFileFolder = Folder(defaultFilesPath);
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