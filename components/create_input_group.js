function createInputPanel(parent,listName,msg)
{
	var newPanel = parent.add("panel");
		newPanel.orientation = "column";
		var txt = UI.static(newPanel,"Please select the necessary " + listName + ".");
		var txt2 = UI.static(newPanel,"Separate each value by a comma.")
		var inputRow = UI.group(newPanel);
			var input = newPanel.input = UI.edit(inputRow,userDefaults[listName].inUse,65);
			var showListBtn = UI.button(inputRow,"Show Lists",function()
			{
				var listResult = showLists(userDefaults[listName].overflow,userDefaults[listName].inUse,listName);
				if(listResult)
				{
					input.text = listResult;
				}
			});
	return newPanel;
	
}