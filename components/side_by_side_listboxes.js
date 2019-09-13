// function test()
// {
// 	// //Production Utilities
// 	// eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
// 	// eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	
// 	//Dev Utilities
// 	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Utilities_Container.js\"");
// 	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Batch_Framework.js\"");
	

// 	var xtraLocsDefaults = ["Right Cowl", "Left Cowl", "Left Leg", "Right Leg", "Right Hood", "Left Hood", "Front Pocket", "Collar Art", "Right Front Leg", "Left Front Leg"];
// 	var stdLocsDefaults = ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Locker Tag","Additional Artwork"];
// 	var resetGlobalDefaults = false;

// 	//the locations should be found in this location and opened at runtime
// 	//to allow users to change the defaults at their leisure
// 	//for now let's let each user set their own personal defaults.
// 	//if no defaults file exists on their machine, create one and use the values above.
// 	//if file does exist, eval(#include) it and it will overwrite the values above
// 	if(!defaultLocsFile.exists)
// 	{
// 		// alert("creating defaults file");
// 		writeDefaultLocsFile(xtraLocsDefaults,stdLocsDefaults);
// 	}

// 	eval("#include \"" + defaultLocsFile.fullName + "\"");


// 	// var lbSize = undefined;
// 	var lbSize = [100,100,300,350];
// 	var activeListbox;

// 	//array of strings to return back to the configure script
// 	//example result = ["Front Logo","Front Number","Player Name"];
// 	var result = [];

// 	var w = new Window("dialog","hello");
// 		var lbGroup = UI.group(w);
// 			lbGroup.orientation = "row";
// 			var lbExtraLocs = UI.listbox(lbGroup,lbSize,xtraLocs,{multiselect:true});
// 				lbExtraLocs.onChange = function()
// 				{
// 					lbInUse.selection = [];
// 					activeListbox = lbExtraLocs;
// 				}
// 			var lbInUse = UI.listbox(lbGroup,lbSize,stdLocs,{multiselect:true});
// 				lbInUse.onChange = function()
// 				{
// 					lbExtraLocs.selection = [];
// 					activeListbox = lbInUse;
// 				}

// 		var dlGroup = UI.group(w);
// 			var deleteArtLocBtn = UI.button(dlGroup,"Delete Selected",function()
// 			{
// 				if(lbExtraLocs.selection)
// 				{
// 					for(var x=0,len=lbExtraLocs.selection.length;x<len;x++)
// 					{
// 						lbExtraLocs.remove(lbExtraLocs.selection[x]);
// 					}
// 				}
// 				if(lbInUse.selection)
// 				{
// 					for(var x=0,len=lbInUse.selection.length;x<len;x++)
// 					{
// 						lbInUse.remove(lbInUse.selection[x]);
// 					}
// 				}

// 			});

// 		var nlGroup = UI.group(w);
// 			var newArtLocInput = UI.edit(nlGroup,"",15);
// 			var newArtLocBtn = UI.button(nlGroup,"Add Location",function()
// 			{
// 				if(newArtLocInput.text !== "")
// 				{
// 					lbInUse.add("item",newArtLocInput.text);
// 					newArtLocInput.text = "";
// 				}
// 			})
			

// 		var btnGroup = UI.group(w);
// 			var restoreDefaultBtn = UI.button(btnGroup,"Restore Default",function()
// 			{
// 				//dialog to ask user whether they want to load their personal defaults
// 				//or the standard global default locations list
// 				var whichDefaults = new Window("dialog","Choose Default Set");
// 					var wdBtnGroup = UI.group(whichDefaults);
// 						var localDefaults = UI.button(wdBtnGroup,"My Defaults",function()
// 						{
// 							whichDefaults.close();
// 						});
// 						var globalDefaults = UI.button(wdBtnGroup,"Standard Defaults",function()
// 						{
// 							resetGlobalDefaults = true;
// 							writeDefaultLocsFile(xtraLocsDefaults,stdLocsDefaults);
// 							whichDefaults.close();
// 						})
// 				whichDefaults.show();



// 				eval("#include \"" + defaultLocsFile.fullName + "\"");
// 				//reset extraLocs listbox
// 				for(var x = lbExtraLocs.items.length - 1; x>=0; x--)
// 				{
// 					lbExtraLocs.remove(lbExtraLocs.items[x]);
// 				}
// 				for(var x=0,len=xtraLocs.length;x<len;x++)
// 				{
// 					lbExtraLocs.add("item",xtraLocs[x]);
// 				}

// 				//reset stdLocs listbox
// 				for(var x = lbInUse.items.length - 1; x>=0; x--)
// 				{
// 					lbInUse.remove(lbInUse.items[x]);
// 				}
// 				for(var x=0,len=stdLocs.length;x<len;x++)
// 				{
// 					lbInUse.add("item",stdLocs[x]);
// 				}
				
// 			});

// 			var arrowBtnGroup = UI.group(btnGroup);
// 				var leftBtn = UI.button(arrowBtnGroup,"<",function()
// 				{
// 					for(var x = lbInUse.selection.length - 1; x>=0; x--)
// 					{
// 						lbExtraLocs.add("item",lbInUse.selection[x].text);
// 						lbInUse.remove(lbInUse.selection[x]);
// 					}
					
// 				});

// 				var upDownArrowGroup = UI.group(arrowBtnGroup);
// 					upDownArrowGroup.orientation = "column";
// 					var upBtn = UI.button(upDownArrowGroup,"/\\",function()
// 					{
// 						if(!activeListbox.selection)
// 						{
// 							return;
// 						}
// 						if(activeListbox.selection.length >1)
// 						{
// 							alert("Please select one item at a time.");
// 							return;
// 						}
// 						var index = activeListbox.selection[0].index;
// 						swap(activeListbox,index,"up");
// 					});

// 					var downBtn = UI.button(upDownArrowGroup,"\\/",function()
// 					{
// 						if(!activeListbox.selection)
// 						{
// 							return;
// 						}
// 						if(activeListbox.selection > 1)
// 						{
// 							alert("Please select one item at a time.");
// 							return;
// 						}
// 						var index = activeListbox.selection[0].index;
// 						swap(activeListbox,index,"down");
// 					});

// 				var rightBtn = UI.button(arrowBtnGroup,">",function()
// 				{
// 					for(var x = lbExtraLocs.selection.length - 1; x>=0; x--)
// 					{
// 						lbInUse.add("item", lbExtraLocs.selection[x].text);
// 						lbExtraLocs.remove(lbExtraLocs.selection[x]);
// 					}
					
// 				});

// 			var setDefault = UI.button(btnGroup,"Set Defaults",function()
// 			{
// 				var newExtras = [];
// 				var newStd = [];

// 				for(var x=0,len=lbExtraLocs.items.length;x<len;x++)
// 				{
// 					newExtras.push(lbExtraLocs.items[x].text);
// 				}

// 				for(var x=0,len=lbInUse.items.length;x<len;x++)
// 				{
// 					newStd.push(lbInUse.items[x].text);
// 				}

// 				writeDefaultLocsFile(newExtras,newStd);
// 				alert("Defaults successfully overwritten.");
// 			})
// 		var closeBtnsGroup = UI.group(w);
// 			var cancelBtn = UI.button(closeBtnsGroup,"Cancel",function()
// 			{
// 				result = undefined;
// 				w.close();
// 			})
// 			var submitBtn = UI.button(closeBtnsGroup,"Submit", function()
// 			{
// 				result = [];
// 				for(var x=0,len=lbInUse.items.length;x<len;x++)
// 				{
// 					result.push(lbInUse.items[x].text);
// 				}
// 				w.close();
				
// 			})
			
// 	w.show();


// 	function swap (listbox,index,direction)
// 	{
// 		var x = listbox.items[index];
// 		var temp = x.text;
// 		var y;
// 		if(direction === "up" && index > 0)
// 		{
// 			y = listbox.items[index-1];
// 		}
// 		else if (direction = "down" && index < listbox.items.length)
// 		{
// 			y = listbox.items[index + 1];
// 		}

// 		x.text = y.text;
// 		y.text = temp;
// 		y.selected = true;
// 		x.selected = false;
// 	}
	
// }
// test();