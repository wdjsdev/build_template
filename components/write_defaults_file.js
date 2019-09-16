//file = File() object
//inUse and overflow variables are arrays of strings
	//eg. ["Front","Back","Collar"]
function writeDefaultFile(file,inUse,overflow)
{
	if(!file)
	{
		errorList.push("No defaults file was defined.");
		return;
	}
	var newStr = "";

	if(inUse.length)
	{
		newStr += "var inUse = [\"" + inUse.join("\",\"") + "\"];\n\n";
	}
	else
	{
		newStr += "var inUse = [];\n\n";
	}

	if(overflow.length)
	{
		newStr += "var overflow = [\"" + overflow.join("\",\"") + "\"];\n\n";
	}
	else
	{
		newStr += "var overflow = [];\n\n";
	}

	file.open("w");
	file.write(newStr);
	file.close();

}