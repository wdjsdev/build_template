#target Illustrator
function logCoords ()
{
	var valid = true;
	var scriptName = "log_template_placement";

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


	//file locations
	var configFile = new File( documentsPath + "build_template_config/btconfig.js" );

	//logic container
	function readConfig ()
	{
		if ( !configFile.exists )
		{
			alert( "No Configuration file was found. Please run the configuration script first." );
			return false;
		}

		eval( "#include \"" + configFile.fullName + "\"" );

		return config;
	}

	function writeConfigFile ( config )
	{
		var result = true;

		var btConfigLog = btLibraryFile;

		var str = "var config = " + JSON.stringify( config );

		configFile.open( "w" );
		configFile.write( str );
		configFile.close();

		//import the existing data file
		eval( "#include \"" + btLibraryPath + "\"" );

		var btData, person;
		var curGarCode = config.garmentCode;
		var curGarCodeConverted = config.garmentCode.replace( "-", "_" );
		var overwrite = true;
		var dataExists;

		//check for existence of database entry for this garment code
		if ( templateInfo[ curGarCode ] )
		{
			btData = templateInfo[ curGarCode ];
			dataExists = true;
		}
		else if ( templateInfo[ curGarCodeConverted ] )
		{
			curGarCode = curGarCodeConverted;
			btData = curGarCode;
			dataExists = true;
		}

		if ( btData && btData.createdBy )
		{
			person = btData.createdBy;
		}
		else
		{
			person = "somebody";
		}

		if ( dataExists )
		{
			overwrite = confirm( "Woops. It looks like " + person + " has already created a database entry for " + curGarCode +
				".\nPlease check with them to make sure you're not both working on the same thing at the same time.\n" +
				"Do you want to overwrite the existing data?" );
		}

		if ( overwrite )
		{
			templateInfo[ curGarCode ] = config;
			var newContents = "var templateInfo = " + JSON.stringify( templateInfo );
			writeDatabase( btConfigLog, newContents );
		}
		else
		{
			alert( 'No change was made to the data.' );
			result = false;
		}
		return result;

	}

	var docRef = app.activeDocument;
	var layers = docRef.layers;

	if ( valid )
	{
		var config = readConfig();
		if ( !config )
		{
			valid = false;
		}
	}
	if ( valid )
	{
		var ppLay = getPPLay( layers );
		if ( !ppLay )
		{
			errorList.push( "Failed to find the prepress layer. Please check your layer structure and try again.." );
			valid = false;
		}
	}
	if ( valid )
	{
		if ( config.rotate )
		{
			//reverse get the inverse rotation values
			//for add artwork we want to rotate one direction,
			//but for rebuild template we need to rotate the
			//opposite direction. the btlibrary database is
			//used for rebuild template, so let's flip the angles
			for ( var x = 0; x < config.rotate.length; x++ )
			{
				config.rotate[ x ].angle *= -1;
			}
		}
		config.placement = coord( ppLay );
		config.createdBy = user;
		config.createdOn = logTime();
	}



	if ( valid )
	{
		if ( writeConfigFile( config ) )
		{
			alert( "Successfully added the placement data to your config file. You should be ready to build some templates!!! =)" );
		}
	}

	if ( errorList.length > 0 )
	{
		sendErrors( errorList );
	}
	return valid;

}
logCoords();