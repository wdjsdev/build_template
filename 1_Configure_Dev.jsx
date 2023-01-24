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

#target Illustrator
function buildConfig ()
{
	var valid = true;
	var scriptName = "build_template_config";

	function getUtilities ()
	{
		var utilNames = [ "Utilities_Container" ]; //array of util names
		var utilFiles = []; //array of util files
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( devUtilitiesPreferenceFile.exists && readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			var devUtilPath = "~/Desktop/automation/utilities/";
			utilFiles = [ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
			return utilFiles;
		}

		var dataResourcePath = customizationPath + "Library/Scripts/Script_Resources/Data/";

		for ( var u = 0; u < utilNames.length; u++ )
		{
			var utilFile = new File( dataResourcePath + utilNames[ u ] + ".jsxbin" );
			if ( utilFile.exists )
			{
				utilFiles.push( utilFile );
			}

		}

		if ( !utilFiles.length )
		{
			alert( "Could not find utilities. Please ensure you're connected to the appropriate Customization drive." );
			return [];
		}


		return utilFiles;

	}
	var utilities = getUtilities();

	for ( var u = 0, len = utilities.length; u < len && valid; u++ )
	{
		eval( "#include \"" + utilities[ u ] + "\"" );
	}

	if ( !valid || !utilities.length ) return;

	DEV_LOGGING = user === "will.dowling";


	/*****************************************************************************/
	//==============================  Components  ===============================//

	logDest.push( getLogDest() );

	var devComponents = desktopPath + "automation/build_template/components";
	var prodComponents = componentsPath + "build_template";
	var compPath = $.fileName.indexOf( "_Dev" ) > -1 ? devComponents : prodComponents;

	// var compFiles = includeComponents(devComponents,prodComponents,true);
	var compFiles = getComponents( compPath );

	if ( compFiles && compFiles.length )
	{
		for ( var x = 0, len = compFiles.length; x < len; x++ )
		{
			try
			{
				eval( "#include \"" + compFiles[ x ].fullName + "\"" );
			}
			catch ( e )
			{
				errorList.push( "Failed to include the component: " + compFiles[ x ].name );
				log.e( "Failed to include the component: " + compFiles[ x ].name + "::System Error Message: " + e + "::System Error Line: " + e.line );
				valid = false;
			}
		}
	}
	else
	{
		valid = false;
		errorList.push( "Failed to find any of the necessary components for this script to work." );
		log.e( "Failed to include any components. Exiting script." );
	}

	//=============================  /Components  ===============================//
	/*****************************************************************************/


	//begin global variable stuff


	//global defaults
	//used for initial default file creation
	//and resetting defaults back to global defaults
	//if personal defaults go haywire.

	var defaultFilesPath = documentsPath + "build_template_defaults/"
	var defaultFileFolder = Folder( defaultFilesPath );
	if ( !defaultFileFolder.exists )
	{
		defaultFileFolder.create();
	}

	//check to see whether the folder still doesn't exist..
	//if so, then likely there's an issue with naming of the
	//main hard drive?
	if ( !defaultFileFolder.exists )
	{
		defaultFilesPath = "~/Documents/build_template_defaults/";
		defaultFileFolder = Folder( defaultFilesPath );
		defaultFileFolder.create();
	}



	var userDefaults = {
		"pieces":
		{
			"overflow": [],
			"inUse": [],
			"file": File( defaultFilesPath + "build_template_default_piece_names.js" )
		},
		"sizes":
		{
			"overflow": [],
			"inUse": [],
			"file": File( defaultFilesPath + "build_template_default_sizes.js" )
		},
		"waist":
		{
			"overflow": [],
			"inUse": [],
			"file": File( defaultFilesPath + "build_template_default_waist_sizes.js" )
		},
		"artLayers":
		{
			"overflow": [],
			"inUse": [],
			"file": File( defaultFilesPath + "build_template_default_locations.js" )
		}
	}

	for ( var list in userDefaults )
	{
		if ( !userDefaults[ list ].file.exists )
		{
			writeDefaultFile( userDefaults[ list ].file, MASTER_DEFAULTS[ list ].inUse, MASTER_DEFAULTS[ list ].overflow );
		}
		eval( "#include \"" + userDefaults[ list ].file.fullName + "\"" );
		userDefaults[ list ].inUse = inUse;
		userDefaults[ list ].overflow = overflow;
	}



	//boolean variable to keep track of whether the
	//sizing structure contains variable inseam sizing
	//which changes how the data needs to be logged
	var varyingInseamSizing = false;

	//variable to keep track of orientation of the CAD
	var cadOrientation = "vertical";

	var configFileLoc = documentsPath + "build_template_config/";
	if ( !Folder( configFileLoc ).exists )
	{
		Folder( configFileLoc ).create();
	}



	//try to import the 
	var configFilePath = configFileLoc + "btconfig.js"
	var configFile = new File( configFilePath );

	if ( configFile.exists )
	{
		eval( "#include \"" + configFilePath + "\"" );
	}
	else
	{
		var config =
		{
			"garmentCode": "",
			"orientation": "",
			"pieces": [],
			"sizes": [],
			"waist": undefined,
			"artLayers": []
		}
	}


	var sizingStructures = [ "Regular Sizing", "Pants Sizing", "Varying Inseams" ];

	if ( valid && makeDialog() )
	{
		writeConfigFile( config );
	}






}
buildConfig();
