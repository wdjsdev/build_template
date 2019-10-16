
function viewDefaultInputs(listName)
{
	var result;
	var lb1Selection;
	var arr = [];

	//for development
	// var dataFile = File(desktopPath + "/automation/build_template/data/default_inputs.js");
	var dataFile = File(dataPath + "/default_template_builder_inputs.js")

	eval("#include \"" + dataFile.fullName + "\"");

	//check to make sure there's data..
	if(!defaultInputs[listName])
	{
		alert("No data found for " + listName.toTitleCase());
		return;
	}

	for(var prop in defaultInputs[listName])
	{
		arr.push(prop.toTitleCase());
	}

	var lbSize = [100,100,250,250];
	var di = new Window("dialog",listName.toTitleCase() + " Default Inputs");
		di.orientation = "column";
		var lbGroup = UI.group(di);
			lbGroup.orientation = "row";
			var lb1 = UI.listbox(lbGroup,lbSize,arr);

		var currentItemsGroup = UI.group(di);
			currentItemsGroup.orientation = "column";
			var selectedDefaultsTxt = UI.static(currentItemsGroup,"Current Selected Items");
			var selectedDefaults = UI.edit(di,"",80);

		var updateBtnGroup = UI.group(di);
			var updateBtn = UI.button(updateBtnGroup,"Update Currently Selected Defaults",function()
			{
				defaultInputs[listName][lb1Selection] = selectedDefaults.text.split(",");
				writeDatabase(dataFile);
			})
		
		var newDefaultGroup = UI.panel(di);
			newDefaultGroup.orientation = "column";
			var newDefaultText = UI.static(newDefaultGroup,"Add a new default group:");
			var labelGroup = UI.group(newDefaultGroup);
				labelGroup.orientation = "row";
				var labelTxt = UI.static(labelGroup,"Enter a label");
				var labelInput = UI.edit(labelGroup,"",15);
			var itemGroup = UI.group(newDefaultGroup);
				var itemTxt = UI.static(itemGroup,"Enter the Items");
				var itemInput = UI.edit(itemGroup,"",60);
			var addBtn= UI.button(newDefaultGroup,"Add",function()
			{
				if(!labelInput.text)
				{
					alert("Error:\nPlease input a label. For example: \"Full Zip\"");
					return;
				}
				if(!itemInput.text)
				{
					alert("Error:\nPlease input the items, separated by commas. For example:\nFront Left, Front Right, Back, Left Sleeve, Right Sleeve, etc.");
					return;
				}
				if(defaultInputs[listName][labelInput.text.toLowerCase()])
				{
					alert("Error:\nThere is already an entry for " + labelInput.text +".\nPlease use the Update Currently Selected Defaults button instead.");
					return;
				}
				var label = labelInput.text.toLowerCase();
				var items = trimSpaces(itemInput.text);
				defaultInputs[listName][label] = items.split(",");
				writeDatabase(dataFile);
				lb1.add("item",label.toTitleCase());
				lb1.selection = lb1.find(label.toTitleCase());
				selectedDefaults.text = items;
				arr.push(label.toTitleCase());
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
		var inputs = defaultInputs[listName][lb1Selection];
		if(!inputs)
		{
			return;
		}
		var defaultItems = [];

		for(var x=0,len=inputs.length;x<len;x++)
		{	
			defaultItems.push(inputs[x]);
		}
		selectedDefaults.text = trimSpacesArray(defaultItems).join(", ");
	}

	lb1.addEventListener("keydown",function(k)
	{
		if(!lb1.selection)
		{
			return;
		}
		if(k.keyName === "Backspace" || k.keyName === "Delete")
		{
			if(!lb1.selection.text)
			{
				return;
			}
			var cd = new Window("dialog","Confirm Delete");
				var txt = UI.static(cd,"Are you sure you want to delete the entry for: " + lb1.selection.text + "?");
				var btnGroup = UI.group(cd);
					var yes = UI.button(btnGroup,"Yes",function()
					{
						var txt = lb1.selection.text.toLowerCase();
						delete defaultInputs[listName][txt];
						arr.splice(arr.indexOf(txt.toTitleCase()),1);
						populateListbox(lb1,arr);
						lb1.items[0].selected = true;
						lb1Selection = lb1.items[0].text;
						selectedDefaults.text = defaultInputs[listName][lb1.items[0].text.toLowerCase()];
						writeDatabase(dataFile);
						cd.close();
					})
					var no = UI.button(btnGroup,"No",function()
					{
						cd.close();
					})
			cd.show();
		}
	})

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
		file.open("w");
		file.write("var defaultInputs = " + JSON.stringify(defaultInputs));
		file.close();
		alert("Defaults for " + listName.toTitleCase() + " have been updated.");
	}
	function populateListbox(lb,items)
	{
		for(var x = lb.items.length - 1; x>=0; x--)
		{
			lb.remove(lb.items[x]);
		}

		for(var x=0,len=items.length;x<len;x++)
		{
			lb.add("item",items[x]);
		}
		
	}


	di.show();
	return trimSpacesArray(result);


}