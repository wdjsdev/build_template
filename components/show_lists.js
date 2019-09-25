function showLists(overflow,inUse,listName)
{

	// var lbSize = undefined;
	var lbSize = [100,100,300,350];
	var activeListbox;

	//trim all the leading/trailing spaces from each element
	//of the overflow and inUse arrays
	overflow = trimSpacesArray(overflow);
	inUse = trimSpacesArray(inUse);

	//array of strings to return back to the configure script
	//example result = ["Front Logo","Front Number","Player Name"];
	var result = [];

	//show list dialog // sld
	var sld = new Window("dialog",listName.replace("_"," "));
		
		//group to hold the listboxes
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

		
		
			
		//group for buttons.. obviously
		var navigationBtnGroup = UI.group(sld);
			
			var addRemoveGroup = UI.group(navigationBtnGroup);
				addRemoveGroup.orientation = "column";
				//add the selection to the in use listbox
				var addBtn = UI.button(addRemoveGroup,"Add Item(s)",function()
				{
					if(lbInUse.selection && lbInUse.selection.length)
					{
						return;
					}
					else if(lbOverflow.selection && lbOverflow.selection.length)
					{
						for(var x = lbOverflow.selection.length - 1; x>=0; x--)					
						{
							lbInUse.add("item",lbOverflow.selection[x].text);
							lbOverflow.remove(lbOverflow.selection[x]);
						}
					}
				});


				//remove the selection from the inUse listbox and place it in the overflow
				var rmBtn = UI.button(addRemoveGroup,"Remove Item(s)",function()
				{
					if(lbOverflow.selection && lbOverflow.selection.length)
					{
						return;
					}
					else if(lbInUse.selection && lbInUse.selection.length)
					{
						for(var x = lbInUse.selection.length - 1; x>=0; x--)					
						{
							lbOverflow.add("item",lbInUse.selection[x].text);
							lbInUse.remove(lbInUse.selection[x]);
						}
					}
				});

			var upDownArrowGroup = UI.group(navigationBtnGroup);
				upDownArrowGroup.orientation = "column";
				var upBtn = UI.button(upDownArrowGroup,"Move Up",function()
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

				var downBtn = UI.button(upDownArrowGroup,"Move Down",function()
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


			




			// var navigationBtnGroup = UI.group(btnGroup);
			// 	var leftBtn = UI.button(arrowBtnGroup,"<",function()
			// 	{
			// 		for(var x = lbOverflow.selection.length - 1; x>=0; x--)
			// 		{
			// 			lbInUse.add("item",lbOverflow.selection[x].text);
			// 			lbOverflow.remove(lbOverflow.selection[x]);
			// 		}
					
			// 	});

				

				// var rightBtn = UI.button(arrowBtnGroup,">",function()
				// {
				// 	for(var x = lbInUse.selection.length - 1; x>=0; x--)
				// 	{
				// 		lbInUse.add("item", lbInUse.selection[x].text);
				// 		lbInUse.remove(lbInUse.selection[x]);
				// 	}
					
				// });

			

		//group for adding a value to the listbox from input text from the user
		var nlGroup = UI.group(sld);
			var newInput = UI.edit(nlGroup,"",15);
				newInput.addEventListener("keydown",function(k)
				{
					if(k.keyName === "Enter")
					{
						addItem(newInput.text);
					}
				})
			var newArtLocBtn = UI.button(nlGroup,"Add Item",function()
			{
				addItem(newInput.text);
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



		var closeBtnsGroup = UI.group(sld);

			//delete the selected items from whichever listbox they reside
			var deleteArtLocBtn = UI.button(closeBtnsGroup,"Delete Selected",function()
			{
				if(lbOverflow.selection)
				{
					for(var x = lbOverflow.selection.length - 1; x>=0; x--)
					{
						lbOverflow.remove(lbOverflow.selection[x]);
					}
				}
				if(lbInUse.selection)
				{
					for(var x = lbInUse.selection.length - 1; x>=0; x--)
					{
						lbInUse.remove(lbInUse.selection[x]);
					}
				}

			});

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
					result.push(lbInUse.items[x].text);
				}
				sld.close();
				
			})



		var defaultActionsGroup = UI.group(sld)
		{
			var restoreDefaultBtn = UI.button(defaultActionsGroup,"Restore Default",function()
			{
				//dialog to ask user whether they want to load their personal defaults
				//or the standard global default locations list
				var whichDefaults = new Window("dialog","Choose Default Set");
					var wdBtnGroup = UI.group(whichDefaults);
						var localDefaults = UI.button(wdBtnGroup,"My Defaults",function()
						{
							whichDefaults.close();
						});
						var globalDefaults = UI.button(wdBtnGroup,"Standard Defaults",function()
						{
							writeDefaultFile(userDefaults[listName].file,MASTER_DEFAULTS[listName].inUse,MASTER_DEFAULTS[listName].overflow);
							whichDefaults.close();
						});
				whichDefaults.show();



				eval("#include \"" + userDefaults[listName].file.fullName + "\"");
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
				
			});

			var setDefault = UI.button(defaultActionsGroup,"Set Defaults",function()
			{
				var newOverflow = [];
				var newInUse = [];

				for(var x=0,len=lbOverflow.items.length;x<len;x++)
				{
					newOverflow.push(lbOverflow.items[x].text);
				}

				for(var x=0,len=lbInUse.items.length;x<len;x++)
				{
					newInUse.push(lbInUse.items[x].text);
				}

				writeDefaultFile(userDefaults[listName].file,newInUse,newOverflow);
				userDefaults[listName].overflow = newOverflow;
				userDefaults[listName].inUse = newInUse;
				alert("Defaults successfully overwritten.");
			})
		}
			
	sld.show();

	return result;


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