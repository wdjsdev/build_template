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
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");


	var configFileLoc = "~/Documents/";
	var centralConfigLoc = "/Volumes/Customization/Library/Scripts/Script Resources/Data/";


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

	var exampleSizing = {
		"Regular Sizing" : "XS,S,M,L,XL,2XL,3XL,4XL,5XL",
		"Pants Sizing" : "24x26,26x19,26x28,28x20,28x28,30x21,30x28",
		"Varying Inseams" : "22I,24I,26I,28I,30I,32I,34I",
		"Waist Sizing" : "26W,28W,30W,32W,34W,36W"
	}

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
	function makeAssets(group,src,assetType,func)
	{
		var result = [];
		for(var cb=0;cb<src.length;cb++)
		{
			var name = src[cb];
			result[cb] = group.add(assetType, undefined, name);
			if(func)
			{
				result[cb].onClick = func;
			}
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
			var gcPat = /^[A-Z]{2}[-_][0-9]{3,5}([A-Z]*)?$/;

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
				selectSizeStructureGroup.orientation = "row";
				var sssgTxt = selectSizeStructureGroup.add("statictext", undefined, "Select the appropriate sizing format.");

				makeAssets(selectSizeStructureGroup, possibleSizing,"radiobutton",function()
					{
						sgInput.text = exampleSizing[this.text];
						if(this.text === "Varying Inseams")
						{
							varyingInseamSizing = true;
							sgWaistInput.enabled = true;
						}
						else
						{
							varyingInseamSizing = false;
							sgWaistInput.enabled = false;
						}
					});


			//group for input of available sizes
			var sizeGroup = w.add("panel");
				sizeGroup.orientation = "column";
				var sgTxt = sizeGroup.add("statictext", undefined, "Enter the sizes [in order] needed for this garment.");
				var sgTxt2 = sizeGroup.add("statictext", undefined, "Separate each value by a comma.");
				var sgInput = UI.edit(sizeGroup,"S,M,L,XL,SM-MD,30x32,30Ix32W",100);
				var sgWaistTxt = sizeGroup.add("statictext", undefined, "Enter the waist sizes [in order] needed for this garment.");
				var sgWaistTxt2 = sizeGroup.add("statictext", undefined, "Separate each value by a comma.");
				var sgWaistInput = UI.edit(sizeGroup,exampleSizing["Waist Sizing"],100);
					sgWaistInput.enabled = false;

				

			//group for selection of necessary art layers
			var artLocGroup = w.add("panel");
				artLocGroup.orientation = "column";
				var artLocInputTxt = UI.static(artLocGroup,"Enter the artwork locations needed for this garment.");
				var artLocInputTxt2 = UI.static(artLocGroup,"Separate each value by a comma.");
				// var artLocInput = artLocGroup.add("edittext", undefined, "Front Logo, Front Number, Player Name, Back Number");
				var artLocInput = UI.edit(artLocGroup,"Front Logo, Front Number, Player Name, Back Number",100);

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