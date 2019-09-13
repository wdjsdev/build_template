//file = File() object
//inUse and overflow variables are arrays of strings
	//eg. ["Front","Back","Collar"]
//prefix = String() representing how to prefix the variable names
	//eg. "pieceName" or "artLocation"
function writeDefaultFile(file,inUse,overflow,prefix)
{
	if(!file)
	{
		errorList.push("No defaults file was defined.");
		return;
	}
	var newStr = "";

	if(inUse.length)
	{
		newStr += "var " + prefix + "InUse = [\"" + inUse.join("\",\"") + "\"]\n\n";
	}
	else
	{
		newStr += "var " + prefix + "InUse = [];\n\n";
	}

	if(overflow.length)
	{
		newStr += "var " + prefix + "Overflow = [\"" + overflow.join("\",\"") + "\"]\n\n";
	}
	else
	{
		newStr += "var " + prefix + "Overflow = [];\n\n";
	}

	file.open("w");
	file.write(newStr);
	file.close();

}