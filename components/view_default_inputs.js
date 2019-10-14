
function viewDefaultInputs()
{
	var result;
	var lb1Selection,lb2Selection;
	var arr = [];

	var dataFile = File(desktopPath + "/automation/build_template/data/default_inputs.js");

	eval("#include \"" + dataFile.fullName + "\"");

	for(var prop in defaultInputs)
	{
		arr.push(prop.toTitleCase());
	}

	var lbSize = [100,100,250,250];
	var di = new Window("dialog","Default Inputs");
		di.orientation = "column";
		var lbGroup = UI.group(di);
			lbGroup.orientation = "row";
			var lb1 = UI.listbox(lbGroup,lbSize,arr);
			var lb2 = UI.listbox(lbGroup,lbSize,[]);
			var selectedDefaults = UI.edit(di,"",80);
		var updateBtnGroup = UI.group(di);
			var updateBtn = UI.button(updateBtnGroup,"Update Currently Selected Defaults",function()
			{
				defaultInputs[lb1Selection][lb2Selection] = selectedDefaults.text.split(",");
				writeDatabase(dataFile);
			})
		var closeBtnGroup = UI.group(di);
			var cancel = UI.button(closeBtnGroup,"Cancel",function()
			{
				di.close();
			})
			var submit = UI.button(closeBtnGroup,"Use These Defaults",function()
			{
				result = selectedDefaults.text.split(",");
				di.close();
			})
	


	lb1.onChange = function()
	{
		if(!lb1.selection)
		{
			return;
		}
		lb1Selection = lb1.selection.text.toLowerCase();
		removeItemsFromList(lb2,lb2.items);
		var subItems = [];
		for(var prop in defaultInputs[lb1Selection])
		{
			subItems.push(prop.toTitleCase());
		}
		addItemsToList(lb2,subItems);
	}

	lb2.onChange = function()
	{
		if(!lb2.selection)
		{
			return;
		}
		lb2Selection = lb2.selection.text.toLowerCase();
		var listItems = [];
		for(var x=0,len=defaultInputs[lb1Selection][lb2Selection].length;x<len;x++)
		{
			listItems.push(defaultInputs[lb1Selection][lb2Selection][x]);
		}
		selectedDefaults.text = listItems.join(",");
	}

	function addItemsToList(list,items)
	{
		for(var x=0,len=items.length;x<len;x++)
		{
			list.add("item",items[x]);
		}
	}
	function removeItemsFromList(list)
	{
		var curListItem,curRmItem;
		for(var x = list.items.length - 1; x>=0; x--)
		{
			list.remove(list.items[x]);			
		}
		
	}
	function writeDatabase(file)
	{
		file.open(w);
		file.write(JSON.stringify(defaultInputs));
		file.close();
		// $.writeln(JSON.stringify(defaultInputs));
	}


	di.show();
	return result;


}
// viewDefaultInputs();