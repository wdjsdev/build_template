function readDefaultsFile(file)
{
	var contents;
	file.open("r");
	contents = file.read();
	file.close();

	if(contents !== "")
	{
		return contents;
	}
	else
	{
		return undefined;
	}
}