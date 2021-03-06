function writeConfigFile(config)
{
	var overwrite = true;
	
	var configFile = new File(configFileLoc + "btconfig.js");

	if(configFile.exists)
	{
		overwrite = confirm("Do you want to overwrite the existing config file?");
	}

	if(overwrite)
	{
		//trim the parentheses from the config.toSource() return value;
		var parenPat = /[\(\)]/g;
		// var str = "var config = " + config.toSource().replace(parenPat,"");
		// str = "var config = \n" + str.replace(parenPat,"");
		var str = "var config = " + JSON.stringify(config);

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