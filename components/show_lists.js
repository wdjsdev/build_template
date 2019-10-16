function showLists(overflow,inUse,listName)
{

	// var lbSize = undefined;
	var lbSize = [100,100,300,350];
	var activeListbox;

	//trim all the leading/trailing spaces from each element
	//of the overflow and inUse arrays
	overflow = trimSpacesArray(overflow);
	inUse = trimSpacesArray(inUse);


	var selectedDefaults;

	//array of strings to return back to the configure script
	//example result = ["Front Logo","Front Number","Player Name"];
	var result = [];

	//show list dialog // sld
	var sld = new Window("dialog",listName.replace("_"," "));
		
		
		//
		//LISTBOXES
		//
		var lbGroup = UI.group(sld);
			lbGroup.orientation = "row";

			var lbInUseGroup = UI.group(lbGroup);
				lbInUseGroup.orientation = "column";

				//in use label
				var lbInUseLabel = UI.static(lbInUseGroup,"In Use");

				//in use listbox - these are considered the default items that will be
				//automatically input in the edit text box of the configure dialog.
				var lbInUse = UI.listbox(lbInUseGroup,lbSize,inUse,{multiselect:true});
					lbInUse.onChange = function()
					{
						lbOverflow.selection = [];
						activeListbox = lbInUse;
					}
					lbInUse.addEventListener("keydown",function(k)
					{
						if(k.keyName === "Delete" || k.keyName === "Backspace")
						{
							moveToOverflow();
						}
					});

			var lbOverflowGroup = UI.group(lbGroup);
				lbOverflowGroup.orientation = "column";
				
				//overflow label
				var lbOverflowLabel = UI.static(lbOverflowGroup,"Overflow - Not Used");

				//overflow listbox
				var lbOverflow = UI.listbox(lbOverflowGroup,lbSize,overflow,{multiselect:true});
					lbOverflow.onChange = function()
					{
						lbInUse.selection = [];
						activeListbox = lbOverflow;
					}

		
		//	
		//NAV BUTTONS
		//
		var navigationBtnGroup = UI.group(sld);
			navigationBtnGroup.orientation = "row";
			
			//add the selection to the in use listbox
			var addBtn = UI.button(navigationBtnGroup,"\u219E",moveToInUse);	
			
			var upDownArrowGroup = UI.group(navigationBtnGroup);
				upDownArrowGroup.orientation = "column";
				var upBtn = UI.button(upDownArrowGroup,"\u219F",function()
				{
					if(!activeListbox.selection)
					{
						return;
					}
					if(activeListbox.selection.length >1)
					{
						alert("Please select one item at a time.");
						return;
					}
					var index = activeListbox.selection[0].index;
					swap(activeListbox,index,"up");
				});

				var downBtn = UI.button(upDownArrowGroup,"\u21A1",function()
				{
					if(!activeListbox.selection)
					{
						return;
					}
					if(activeListbox.selection > 1)
					{
						alert("Please select one item at a time.");
						return;
					}
					var index = activeListbox.selection[0].index;
					swap(activeListbox,index,"down");
				});
			
			//remove the selection from the inUse listbox and place it in the overflow
			var rmBtn = UI.button(navigationBtnGroup,"\u21A0",moveToOverflow);


			var upDownArrowGroup = UI.group(navigationBtnGroup);
				upDownArrowGroup.orientation = "column";
				


		//
		//NEW ITEM INPUT
		//
			

		//group for adding/deleting a value to the listbox from input text from the user
		var editListGroup = UI.group(sld);
			var newInput = UI.edit(editListGroup,"",15);
				newInput.addEventListener("keydown",function(k)
				{
					if(k.keyName === "Enter")
					{
						addItem(newInput.text);
						newInput.active = true;
					}
				})
			var newArtLocBtn = UI.button(editListGroup,"Add New Item",function()
			{
				addItem(newInput.text);
				newInput.active = true;
			})

			

		function addItem(txt)
		{
			if(txt !== "")
			{
				lbInUse.add("item",txt);
			}
			newInput.text = "";
			newInput.active = true;
		}


		//
		//BUTTONS
		//



		var defaultActionsGroup = UI.group(sld)
			var defaultsBtn = UI.button(defaultActionsGroup,"Defaults",function()
			{
				var action;
				var whichDefaults = new Window("dialog","Choose Default Set");
					var wdBtnGroup = UI.group(whichDefaults);
						wdBtnGroup.orientation = "column";
						var saveDefaults = UI.button(wdBtnGroup,"Save My Defaults",function()
						{
							action = "save";
							whichDefaults.close();
						})
						var localDefaults = UI.button(wdBtnGroup,"Load My Defaults",function()
						{
							action = "user";
							whichDefaults.close();
						});
						// var globalDefaults = UI.button(wdBtnGroup,"Load Standard Defaults",function()
						// {
						// 	selectedDefaults = viewDefaultInputs(listName);
						// 	if(!selectedDefaults)
						// 	{
						// 		action = undefined;
						// 	}
						// 	else
						// 	{
						// 		action = "standard";
						// 	}
						// 	whichDefaults.close();
						// });
						// var globalDefaults = UI.button(wdBtnGroup,"Load Standard Defaults",function()
						// {
						// 	action = "standard";
						// 	writeDefaultFile(userDefaults[listName].file,MASTER_DEFAULTS[listName].inUse,MASTER_DEFAULTS[listName].overflow);
						// 	whichDefaults.close();
						// });
				whichDefaults.show();

				if(action === "save")
				{
					var newOverflow = [];
					var newInUse = [];
					var curItemText;
					for(var x=0,len=lbOverflow.items.length;x<len;x++)
					{
						curItemText = lbOverflow.items[x].text;
						if(curItemText !== "")
						{
							newOverflow.push(curItemText);
						}
					}

					for(var x=0,len=lbInUse.items.length;x<len;x++)
					{
						curItemText = lbInUse.items[x].text
						if(curItemText !== "")
						{
							newInUse.push(curItemText);
						}
					}

					writeDefaultFile(userDefaults[listName].file,newInUse,newOverflow);
					userDefaults[listName].overflow = newOverflow;
					userDefaults[listName].inUse = newInUse;
					alert("Defaults successfully overwritten.");
				}
				else
				{
					if(action === "standard")
					{
						if(!selectedDefaults)
						{
							inUse = MASTER_DEFAULTS[inUse];
							overflow = MASTER_DEFAULTS[overflow];
						}
						else
						{
							inUse = trimSpacesArray(selectedDefaults);
							// overflow = [];
						}
					}
					else if(action === "user")
					{
						// eval("#include \"" + userDefaults[listName].file.fullName + "\"");
						overflow = userDefaults[listName].overflow;
						inUse = userDefaults[listName].inUse;
					}
					else
					{
						return;
					}


					//reset extraLocs listbox
					for(var x = lbOverflow.items.length - 1; x>=0; x--)
					{
						lbOverflow.remove(lbOverflow.items[x]);
					}
					for(var x=0,len=overflow.length;x<len;x++)
					{
						lbOverflow.add("item",overflow[x]);
					}

					//reset inUse listbox
					for(var x = lbInUse.items.length - 1; x>=0; x--)
					{
						lbInUse.remove(lbInUse.items[x]);
					}
					for(var x=0,len=inUse.length;x<len;x++)
					{
						lbInUse.add("item",inUse[x]);
					}
				}
			})
			var standardInputs = UI.button(defaultActionsGroup,"Standard Inputs",function()
			{
				selectedDefaults = viewDefaultInputs(listName);
				if(selectedDefaults)
				{
					inUse = selectedDefaults;
				}
				removeItemsFromList(lbInUse);
				addItemsToList(lbInUse,inUse);
			})

		var closeBtnsGroup = UI.group(sld);

			var cancelBtn = UI.button(closeBtnsGroup,"Cancel",function()
			{
				result = undefined;
				sld.close();
			})
			var submitBtn = UI.button(closeBtnsGroup,"Submit", function()
			{
				result = [];
				for(var x=0,len=lbInUse.items.length;x<len;x++)
				{
					if(lbInUse.items[x].text !== "")
					{
						result.push(lbInUse.items[x].text);
					}
				}
				sld.close();
				
			})
			
	sld.show();

	return result;


	//functions

	function moveToOverflow()
	{
		if(lbOverflow.selection && lbOverflow.selection.length)
		{
			return;
		}
		else if(lbInUse.selection && lbInUse.selection.length)
		{
			var curText,removeItems = [];
			for(var x = lbInUse.selection.length - 1; x>=0; x--)					
			{
				curText = lbInUse.selection[x].text;
				lbOverflow.add("item",lbInUse.selection[x].text);
				removeItems.push(curText);
				// lbInUse.remove(lbInUse.find(curText));
			}
			removeItemsFromList(lbInUse,removeItems);
			selectItemsFromList(lbOverflow,removeItems);
			removeItems = [];
		}
	}

	function moveToInUse()
	{
		if(lbInUse.selection && lbInUse.selection.length)
		{
			return;
		}
		else if(lbOverflow.selection && lbOverflow.selection.length)
		{
			var curText,removeItems = [];
			for(var x = lbOverflow.selection.length - 1; x>=0; x--)					
			{
				curText = lbOverflow.selection[x].text;
				lbInUse.add("item",curText);
				removeItems.push(curText);
				// lbOverflow.remove(lbOverflow.selection[x]);
			}
			removeItemsFromList(lbOverflow,removeItems);
			selectItemsFromList(lbInUse,removeItems);
			removeItems = [];
		}
	}


	function swap (listbox,index,direction)
	{
		var x = listbox.items[index];
		var temp = x.text;
		var y;
		if(direction === "up" && index > 0)
		{
			y = listbox.items[index-1];
		}
		else if (direction = "down" && index < listbox.items.length)
		{
			y = listbox.items[index + 1];
		}

		x.text = y.text;
		y.text = temp;
		y.selected = true;
		x.selected = false;
	}
	
}