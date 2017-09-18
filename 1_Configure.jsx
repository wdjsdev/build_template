/*
	
	Script Name: Configure_Build_Template.js
	Author: William Dowling
	Build Date: 31 May, 2017
	Description: Build a config file to be stored on the user's machine that holds
					all the necessary data for a given garment. This config file will
					be accessed by the build_template script.
					Config file will include:
						Garment Code
						CAD layout orientation (vertical or horizontal)
							This determines how the sort function operates.
						Piece Names (in order of how they should be sorted)
						Available Sizes
						Artwork Layer Names

*/

function buildConfig()
{
	var valid = true;
	//add in the utilities container
	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js";


	var configFileLoc = "~/Documents/";
	var centralConfigLoc = "/Volumes/Customization/Library/Scripts/Script Resources/Data/";

	var standardSizing = 
						[
							"YXXXS",
							"YXXS",
							"YXS",
							"YS",
							"YM",
							"YL",
							"YXL",
							"Y2XL",
							"Y3XL",
							"XXXS",
							"XXS",
							"XS",
							"S",
							"M",
							"L",
							"XL",
							"2XL",
							"3XL",
							"4XL",
							"5XL"
						];

	var pantsSizing = 
					[
						"16x14",
						"18x15",
						"20x16",
						"22x17",
						"24x18",
						"26x19",
						"28x20",
						"30x21",
						"32x22",
						"34x23",
						"36x24",
						"38x24",
						"40x24",
						"42x24",
						"44x24"
					];

	var varyingInseams = 
					[
						"22I",
						"24I",
						"26I",
						"28I",
						"30I",
						"32I",
						"34I",
						"36I",
						"38I",
						"40I",
						"42I"
					]

	var waistSizes = 
					[
						"22W",
						"24W",
						"26W",
						"28W",
						"30W",
						"32W",
						"34W",
						"36W",
						"38W",
						"40W",
						"42W",
						"44W"
					]
	var possibleArtLocs = ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Locker Tag", "Right Cowl", "Left Cowl", "Left Leg", "Right Leg", "Right Hood", "Left Hood", "Front Pocket", "Collar Art", "Right Front Leg", "Left Front Leg", "Additional Artwork"];

	var possibleSizing = ["Regular Sizing", "Pants Sizing", "Varying Inseams"];

	//boolean variable to keep track of whether the
	//user input a new/custom art location. these will need to be
	//attended to because the add artwork script/central library 
	//may need to be updated to accomodate the new art location.
	var newArtLocs = false;

	//boolean variable to keep track of whether the
	//sizing structure contains variable inseam sizing
	//which changes how the data needs to be logged
	var varyingInseamSizing = false;

	var config =
	{
		"garmentCode":"",
		"orientation":"",
		"pieces":[],
		"sizes":[],
		"artLayers":[],
		"newArtLayers":false
	}

	//make an asset (checkbox or radio button etc) for each item in the src array
	function makeAssets(group,src,assetType)
	{
		var result = [];
		for(var cb=0;cb<src.length;cb++)
		{
			var name = src[cb];
			result[cb] = group.add(assetType, undefined, name);
		}
		return result;
	}

	function removeEmpties(arr)
	{
		var result = arr;
		for(var re = result.length-1;re >-1; re--)
		{
			if(result[re] == "")
			{
				result.splice(re,1);
			}
		}
		return result;
	}

	function validate(gc,orient,names,sizes,artLocs,artLocInput,selectedWaistSizes)
	{

		var valid = true;
		var errors = "";

		//comma + space regex
		var rmSpacesPat = /[\s]*\,[\s]*/g;

		/////////////////////////
		//validate garment code//
		/////////////////////////
			//valid garment code regex
			var gcPat = /^[A-Z]{2}[-_][0-9]{3,4}[A-Z]?$/;

			//set gc to uppercase
			gc = gc.text.toUpperCase();
			if(!gcPat.test(gc))
			{
				valid = false;
				errors += "The garment code you entered was not in the correct format.\n";
			}
			else
			{
				config.garmentCode = gc;
			}

		////////////////////////
		//validate orientation//
		////////////////////////
			//find the selected orientation radio button
			if(orient.children[0].value)
			{
				config.orientation = orient.children[0].text.toLowerCase();;
			}
			else if(orient.children[1].value)
			{
				config.orientation = orient.children[1].text.toLowerCase();
			}
			else
			{
				errors += "The CAD orientation was not properly identified...\n";
				valid = false;
			}

		////////////////////////
		//validate piece names//
		////////////////////////
			
			//remove any spaces preceding or following commas if exist
			names = names.text.replace(rmSpacesPat,",");

			//convert the names string to an array
			names = names.split(",");

			//make sure the length of the new names array is greater than 0
			if(names.length == 0)
			{
				errors += "You must enter all of the piece names.\n";
				valid = false;
			}
			else
			{
				config.pieces = removeEmpties(names);
			}

		//////////////////
		//validate sizes//
		//////////////////
			var sizeArray = [];
			var waistSizeArray = [];

			for(var s=0;s<sizes.children.length;s++)
			{
				var thisChild = sizes.children[s];
				if(thisChild.value)
				{
					sizeArray.push(thisChild.text.toUpperCase());
				}
			}

			if(selectedWaistSizes)
			{
				for(var w=0;w<selectedWaistSizes.children.length;w++)
				{
					var thisChild = selectedWaistSizes.children[w];
					if(thisChild.value)
					{
						waistSizeArray.push(thisChild.text.toUpperCase());
					}
				}
			}

			//make sure there's at least one size
			if(sizeArray.length == 0)
			{
				errors += "You must check a box for each available size.\n";
				valid = false;
			}
			else
			{
				config.sizes = sizeArray;
			}

			if(waistSizeArray.length > 0)
			{
				config.waist = waistSizeArray;
			}

		//////////////////////////
		//validate art locations//
		//////////////////////////
			var locs = [];
			//loop the children of artLocs group
			//push true results to locs
			for(var s=0;s<artLocs.children.length;s++)
			{
				var thisChild = artLocs.children[s];
				if(thisChild.value)
				{
					locs.push(thisChild.text);
				}
			}

			//add in any manually entered locs
			if(artLocInput.text.indexOf("No worries") == -1)
			{
				config.newArtLayers = true;
				artLocInput = artLocInput.text.replace(rmSpacesPat,",");
				artLocInput = artLocInput.split(",");
				for(var ali=0;ali<artLocInput.length;ali++)
				{
					locs.push(artLocInput[ali]);
				}
			}

			//make sure there's at least one art location
			if(locs.length == 0)
			{
				errors += "You must enter or choose at least one artwork location.\n";
				valid = false;
			}
			else
			{
				config.artLayers = removeEmpties(locs);
			}

		//display errors if any
		if(errors != "")
		{
			alert("The following issues exist. Please try again:\n" + errors);
		}

		return valid;

	}

	function deleteExistingChildren(group)
	{
		for(var dec = group.children.length-1;dec >-1; dec--)
		{
			group.remove(group.children[dec]);
		}
	}

	/* beautify ignore:start */
	function makeDialog()
	{
		var dialogSuccess = false;

		var w = new Window("dialog", "Config Setup:");
			var topTxt = w.add("statictext", undefined, "Please input the necessary information for the garment.");

			//group for garment code entry:
			// var gcGroup = w.add("group");
			var gcGroup = w.add("panel");
				var gcTxt = gcGroup.add("statictext", undefined, "Enter The Garment Code: ");
				var gcInput = gcGroup.add("edittext", undefined, "eg. FD-161Y");
					gcInput.active = true;
					gcInput.characters = 12;

			//group for orientation of CAD:
			var oriGroup = w.add("panel");
				var oriTxt = oriGroup.add("statictext", undefined, "Select the orientation of the CAD layout.");
				//group for radio buttons
				var oriRadioGroup = oriGroup.add("group");
					var oriVert = oriRadioGroup.add("radiobutton", undefined, "Vertical");
						oriVert.value = true;
					var oriHorz = oriRadioGroup.add("radiobutton", undefined, "Horizontal");

			//group for entry of piece names:
			var pieceNameGroup = w.add("panel");
				pieceNameGroup.orientation = "column";
				var pngTxt = pieceNameGroup.add("statictext", undefined, "Enter the names of the pieces in the order they appear in the CAD.");
				var pngTxt2 = pieceNameGroup.add("statictext", undefined, "Separate each value by a comma.");
				var pngInput = pieceNameGroup.add("edittext", undefined, "Front, Back, Right Sleeve, Left Sleeve, Collar");
					pngInput.characters = 100;

			//group for selection of sizing structure
			var selectSizeStructureGroup = w.add("panel");
				var sssgTxt = selectSizeStructureGroup.add("statictext", undefined, "Select the appropriate sizing format.");
				makeAssets(selectSizeStructureGroup, possibleSizing,"radiobutton");
				var sizeBtn = selectSizeStructureGroup.add("button", undefined, "Submit");
					sizeBtn.onClick = function()
					{
						deleteExistingChildren(sizeCheckboxGroup);
						deleteExistingChildren(sizeCheckboxGroup2);
						if(selectSizeStructureGroup.children[1].value)
						{
							makeAssets(sizeCheckboxGroup, standardSizing, "checkbox");
							varyingInseamSizing = false;
							w.layout.layout(true);
						}
						else if(selectSizeStructureGroup.children[2].value)
						{
							makeAssets(sizeCheckboxGroup,pantsSizing,"checkbox");
							varyingInseamSizing = false;
							w.layout.layout(true);
						}
						else if(selectSizeStructureGroup.children[3].value)
						{
							makeAssets(sizeCheckboxGroup,varyingInseams,"checkbox");
							makeAssets(sizeCheckboxGroup2, waistSizes,"checkbox");
							varyingInseamSizing = true;
							w.layout.layout(true);
						}
					}

			//group for selection of available sizes
			var sizeGroup = w.add("panel");
				sizeGroup.orientation = "column";
				var sgTxt = sizeGroup.add("statictext", undefined, "Select the sizes that are available for this garment.");
				//a group to hold the checkboxes
				var sizeCheckboxGroup = sizeGroup.add("group");
				var sizeCheckboxGroup2 = sizeGroup.add("group");
				

			//group for selection of necessary art layers
			var artLocGroup = w.add("panel");
				artLocGroup.orientation = "column";
				var algTxt = artLocGroup.add("statictext", undefined, "Select the artwork layers you need.");
				var artLocCheckboxGroup = artLocGroup.add("group");
					artLocCheckboxGroup.orientation = "column";
					makeAssets(artLocCheckboxGroup,possibleArtLocs, "checkbox");
				var artLocInputTxt = artLocGroup.add("statictext", undefined, "But wait! The art layer I need doesn't have a checkbox!");
				var artLocInput = artLocGroup.add("edittext", undefined, "No worries. Enter any additional layers you need here, separated by a comma:");

			//group for buttons
			var btnGroup = w.add("group");
				var submit = btnGroup.add("button", undefined, "Submit");
					submit.onClick = function()
					{
						if(validate(gcInput,oriRadioGroup,pngInput,sizeCheckboxGroup,artLocCheckboxGroup,artLocInput,sizeCheckboxGroup2))
						{
							dialogSuccess = true;
							w.close();
						}
						else{};
					}
				var cancel = btnGroup.add("button", undefined, "Cancel");
					cancel.onClick = function()
					{
						dialogSuccess = false;
						w.close();
					}
		w.show();

		return dialogSuccess;
	}
	/* beautify ignore:end */

	function writeConfigFile(config)
	{
		var overwrite = true;

		var configFile = new File(configFileLoc + "/btconfig.js");

		var btConfigLog = new File(centralConfigLoc + "/btconfiglog.txt");

		if(configFile.exists)
		{
			overwrite = confirm("Do you want to overwrite the existing config file?");
		}

		if(overwrite)
		{
			//trim the parentheses from the config.toSource() return value;
			var parenPat = /[\(\)]/g;
			var str = "var config = " + config.toSource().replace(parenPat,"");
			// str = "var config = \n" + str.replace(parenPat,"");

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

	if(valid && makeDialog())
	{
		writeConfigFile(config);
	}






}
buildConfig();