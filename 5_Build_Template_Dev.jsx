/*

Script Name: Build_Template
Author: William Dowling
Build Date: 31 May, 2016
Description: Create a "converted template" from an existing mockup by combining mockup and prepress while
			renaming prepress pieces and putting them into position under the mockup for proper artwork placement in production.
Build number: 3.0

Progress:

	Version 3.001
		31 May, 2016
		

*/

#target Illustrator
function container()
{

	var valid = true;
	var scriptName = "build_template";

	function getUtilities()
	{
		var result = [];
		var utilPath = "/Volumes/Customization/Library/Scripts/Script_Resources/Data/";
		var ext = ".jsxbin"

		//check for dev utilities preference file
		var devUtilitiesPreferenceFile = File("~/Documents/script_preferences/dev_utilities.txt");

		if(devUtilitiesPreferenceFile.exists)
		{
			devUtilitiesPreferenceFile.open("r");
			var prefContents = devUtilitiesPreferenceFile.read();
			devUtilitiesPreferenceFile.close();
			if(prefContents === "true")
			{
				utilPath = "~/Desktop/automation/utilities/";
				ext = ".js";
			}
		}

		if($.os.match("Windows"))
		{
			utilPath = utilPath.replace("/Volumes/","//AD4/");
		}

		result.push(utilPath + "Utilities_Container" + ext);
		result.push(utilPath + "Batch_Framework" + ext);

		if(!result.length)
		{
			valid = false;
			alert("Failed to find the utilities.");
		}
		return result;

	}

	var utilities = getUtilities();
	for(var u=0,len=utilities.length;u<len;u++)
	{
		eval("#include \"" + utilities[u] + "\"");	
	}

	if(!valid)return;


	if(!valid)
	{
		return;
	}


	/*****************************************************************************/

	///////Begin/////////
	///Logic Container///
	/////////////////////

	//sendErrors Function Description
	//Display any errors to the user in a preformatted list
	function sendErrors(errorList)
	{
		alert(errorList.join("\n"));
	}

	function readConfig(code)
	{
		var btLib = btLibraryFile;

		eval("#include \"" + btLibraryPath + "\"");

		if(!templateInfo[code])
		{
			alert("No entry was found in the database for " + code + ".");
			return false;
		}
		else
		{
			config = templateInfo[code];
			if(!config.garmentCode)
			{
				config.garmentCode = code;
			}
		}

		return config;
	}

	function getSrcLay()
	{
		tbp = findSpecificLayer(layers,"to be plac","any");
		if(!tbp)
		{
			errorList.push("Sorry. You're missing the \"To Be Placed\" layer.\nYou need to copy the CAD to a layer called \"To Be Placed\"");
			valid = false;
		}
		return tbp;
	}

	//setupLayers Function Description
	//check for, validate, and save important layers to global variables
	function setupLayers()
	{
		var result = true;

		if(result)
		{
			garLay = layers[1];
			ppLay = findSpecificLayer(garLay,"Prepress","any");
			infoLay = findSpecificLayer(garLay,"Information","any");
			artLay = findSpecificLayer(garLay,"Artwork","any");
			mockLay = findSpecificLayer(garLay,"Mockup","any");
		}
	
		return result;
	}

	//sortPieces Function Description
	//Sort the contents of the "To Be Placed" layer from top to bottom.
	//Then split the result into rows based on number of pieces per garment
	//Then sort each row from left to right
	//groups = array of groups
	//count = number of pieces per garment (ie. slowpitch would be 5. front, back, left sleeve, right sleeve, collar)
	function sortPieces(groups)
	{
		var valid;
		//create array of pieces
		var pieces = [];
		for(var x=0;x<groups.length;x++)
		{
			var thisPiece = groups[x];
			pieces.push(thisPiece);
		}

		if(pieces.length == 0)
		{
			alert("There's no art on the To Be Placed layer!");
			return false;
		}

		//use these variables if the garment is not "inseam x waist" pants sizing structure
		//set sizeCount and pieceCount variables
		var sizeCount = config.sizes.length;
		var pieceCount = config.pieces.length;

		if(!config.waist)
		{
			var correctCount = sizeCount * pieceCount;
		}
		else
		{
			var correctCount = sizeCount * config.waist.length * pieceCount;
		}

		if(pieces.length != correctCount)
		{
			valid = false;
			alert("There are " + pieces.length + " groups on the TBP layer.\nThere should be " + correctCount);
			return valid;
		}
		else if(srcLay.pathItems.length > 0 || srcLay.textFrames.length > 0 || srcLay.compoundPathItems.length > 0)
		{
			valid = false;
			alert("Invalid items!\nTBP.pathItems.length = " + srcLay.pathItems.length + "\nTBP.textFrames.length = " + srcLay.textFrames.length + "\nTBP.compoundPathItems.length = " + srcLay.compoundPathItems.length);
			return valid;
		}


		var finalSorted = [];
		var verticalSorted = [];

		var rowLength;
		var rowLengthCopy;
		if(config.waist)
		{
			rowLength = rowLengthCopy = pieceCount * config.waist.length;
		}
		else
		{
			rowLength = rowLengthCopy = pieceCount;
		}


		if(config.orientation == "horizontal")
		{
			//loop all the pieces to find the leftmost piece
			//push leftMost to verticalSorted array
			//splice leftMost from pieces and repeat until pieces.length == 0
			while(pieces.length>0)
			{
				var deleteIndex = 0;
				var leftMost = pieces[0];
				var left = leftMost.left;

				for(var x = pieces.length-1;x >0; x--)
				{
					var thisPiece = pieces[x];
					if(thisPiece.left <= left)
					{
						leftMost = thisPiece;
						left = thisPiece.left;
						deleteIndex = x;
					}
				}
				verticalSorted.push(leftMost);
				pieces.splice(deleteIndex,1);

			}
		}
		else
		{
			//loop all the pieces to find the topmost piece
			//push topMost to verticalSorted array
			//splice topMost from pieces and repeat until pieces.length == 0
			while(pieces.length>0)
			{
				var deleteIndex = 0;
				var topMost = pieces[0];
				var top = topMost.top;

				for(var x = pieces.length - 1;x >0; x--)
				{
					var thisPiece = pieces[x];
					if(thisPiece.top >= top)
					{
						topMost = thisPiece;
						top = thisPiece.top;
						deleteIndex = x;
					}
				}
				verticalSorted.push(topMost);
				pieces.splice(deleteIndex,1);
				rowLength--;

			}
		}

		rowLength = rowLengthCopy;


		//for each size, take the first n pieces and push into temp array
		//this will all of pieces for a given size.
		//for example, if there are 5 pieces necessary for a garment, it will pull the next 5 pieces from the verticalSorted array
		//and push them into the temp array so they can be sorted from left to right.
		for(var a=0;a<sizeCount;a++)
		{
			var temp = [];
			var tempSorted =[];
			
			for(var b=0;b<rowLength;b++)
			{
				temp.push(verticalSorted[b]);
			}
			verticalSorted.splice(0,rowLength);

			
			while(temp.length>0)
			{
				var leftMost = temp[0];
				var left = leftMost.left;
				var deleteIndex = 0; 
				for(var b=0;b<temp.length;b++)
				{
					var thisPiece = temp[b];
					if(thisPiece.left <= left)
					{
						leftMost = thisPiece;
						left = thisPiece.left;
						deleteIndex = b;
					}
				}
				tempSorted.push(leftMost);
				temp.splice(deleteIndex,1);
			}

			finalSorted.push(sortVert(tempSorted));
				
		}
		


		return finalSorted;
	}

	function sortVert(thisRow)
	{
		var finishedSorting = [];
		var sortVertBuffer =10;

		if(thisRow.length==1)
		{
			finishedSorting.push(thisRow[0]);
			return finishedSorting;
		}
		while(thisRow.length>0)
		{
			var sharedLefts = [];
			var shared = false;
			var curLeft = thisRow[0].left;
			for(var a=thisRow.length-1;a>0;a--)
			{
				var thisGroup = thisRow[a];

				if(thisGroup.left + sortVertBuffer > curLeft && thisGroup.left - sortVertBuffer < curLeft)
				{
					//this group and thisRow[0] share a left coordinate
					sharedLefts.push(thisGroup)
					shared = true;
					thisRow.splice(a,1);
				}
			}
			
			if(!shared)
			{
				finishedSorting.push(thisRow[0])
				thisRow.splice(0,1);
			}
			else
			{
				sharedLefts.push(thisRow[0]);
				thisRow.splice(0,1);

				while(sharedLefts.length>0)
				{
					var top = sharedLefts[0].top;
					var topMost = sharedLefts[0];
					var di = 0;
					for(var t = 1;t <sharedLefts.length; t++)
					{
						var thisGroup = sharedLefts[t];
						if(thisGroup.top > top)
						{
							top = thisGroup.top;
							topMost = thisGroup;
							di = t;
						}
					}
					finishedSorting.push(topMost);
					sharedLefts.splice(di,1);
				}

			}
		}
		// $.writeln("finishedSorting = " + finishedSorting);
		return finishedSorting;
	}

	function nameThePieces(sorted)
	{
		var localValid = true;
		// var prepress = garLay.layers["Prepress"];
		var prepress = findSpecificLayer(garLay.layers,"prepress","imatch");

		
		for(var a=0;a<sorted.length;a++)
		{
			var thisArray = sorted[a];
			var theSize = config.sizes[a]
			var newSizeLayer = prepress.layers.add();
			newSizeLayer.name = theSize;
			newSizeLayer.zOrder(ZOrderMethod.SENDTOBACK);
			var thePieces = config.pieces;
			
			//this block for regular garments that follow "XL Front" type sizing structure
			if(config["waist"] == undefined)
			{
				for(var b=0;b<thisArray.length;b++)
				{
					var thisPieceName = thePieces[b];
					if(thisPieceName == null)
					{
						alert("Something's not grouped properly for the size: " + theSize);
					}
					var thisPiece = thisArray[b];
					thisPiece.name = theSize + " " + thisPieceName;
					thisPiece.moveToBeginning(newSizeLayer);

				}
			}

			//this block for pants that use "30W x 26I" (waist x inseam) sizing structure
			else
			{
				var waistCounter = 0;
				var pieceCounter = 0;
				for(var b=0;b<thisArray.length;b++)
				{
					var thisPiece = thisArray[b];
					var thisPieceName = config["pieces"][pieceCounter];
					thisPiece.name = config["waist"][waistCounter] + "x" + theSize + " " + thisPieceName;
					thisPiece.moveToBeginning(newSizeLayer);

					//increment or reset pieceCounter
					if(pieceCounter < config["pieces"].length -1)
					{
						pieceCounter++;
					}
					else
					{
						pieceCounter = 0;
						waistCounter++;
					}
				}
			}
		}
		return localValid;
	}

	function moveThePieces(layers)
	{
		var localValid = true;
		var curLay;
		var curSize;
		for(var a=0;a<layers.length;a++)
		{
			curLay = layers[a];
			curSize = curLay.name;
			var curPiece;
			var coords;
			for(var b=0;b<curLay.groupItems.length;b++)
			{
				curPiece = curLay.groupItems[b];
				coords = config.placement[curSize][curPiece.name];
				
				curPiece.left = coords[0];
				curPiece.top = coords[1];
			}
		}
		return localValid;
	}

	function bringEdgesForward()
	{
		var edgeGroup = [];

		for(var bef=0;bef<mockLay.pageItems.length;bef++)
		{
			var thisItem = mockLay.pageItems[bef];
			if(thisItem.name.toLowerCase().indexOf("edge") > -1)
			{
				edgeGroup.push(thisItem);
			}
		}

		if(edgeGroup.length > 0)
		{
			for(var bef=0;bef<edgeGroup.length;bef++)
			{
				edgeGroup[bef].zOrder(ZOrderMethod.BRINGTOFRONT);
				edgeGroup[bef].locked = true;
			}
		}
	}

	function createArtLayers()
	{
		var localValid = true;

		//remove any existing artwork layers
		while(artLay.layers.length)
		{
			artLay.layers[0].remove();
		}

		var reversed = config.artLayers.reverse();
		var newLay;
		for(var x=0,len=reversed.length;x<len;x++)
		{
			newLay = artLay.layers.add();
			newLay.name = reversed[x];
		}
		return localValid;
	}

	function cleanUp()
	{
		var localValid = true;
		var styleNum = prompt("Enter 4 digit style number", "1013");

		var garmentCodeFrame = findSpecificPageItem(infoLay,"garment code","imatch");
		var garmentCode2Frame = findSpecificPageItem(infoLay,"garment code 2","imatch");
		
		if(!garmentCodeFrame)
		{
			errorList.push("Failed to find the \"Garment Code\" text on the info layer.");
		}
		else
		{
			garmentCodeFrame.contents = config.garmentCode + "_" + styleNum;
		}

		//check for existence of "Garment Code 2" textFrame. if true, repeat last line to add styleNum
		if(garmentCode2Frame)
		{
			garmentCode2Frame.contents = config.garmentCode + "_" + styleNum;
		}

		layers["To Be Placed"].remove();
		garLay.name = code + "_" + styleNum;
		return localValid;
	}

	function clearOutPrepressLayer()
	{
		while(ppLay.layers.length)
		{
			ppLay.layers[0].remove();
		}
	}

	////////End//////////
	///Logic Container///
	/////////////////////

	/*****************************************************************************/

	///////Begin////////
	////Data Storage////
	////////////////////

	


	////////End/////////
	////Data Storage////
	////////////////////

	/*****************************************************************************/

	///////Begin////////
	///Function Calls///
	////////////////////

	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var swatches = docRef.swatches;
	var errorList = [];

	//important layer variables
	var tbp,garLay,ppLay,infoLay,artLay,mockLay,srcLay;

	var code = getCode(layers[1].name);

	//get the config data from the build template library
	var config = readConfig(code);

	if(!config)
	{
		valid = false;
	}

	if(valid)
	{
		unlockDoc(docRef);	
	}

	if(valid)
	{
		srcLay = getSrcLay();
	}

	if(valid)
	{
		valid = setupLayers();
	}

	if(valid)
	{
		clearOutPrepressLayer();
	}

	if(valid)
	{
		var sorted = sortPieces(tbp.groupItems);
		if(!sorted)
		{
			valid = false;
			errorList.push("Something went wrong while sorting the pieces.");
		}
	}

	if(valid)
	{
		if(!nameThePieces(sorted))
		{
			valid = false;
			errorList.push("Something went wrong while naming the pieces");
		}
	}

	if(valid)
	{
		if(!moveThePieces(ppLay.layers))
		{
			valid = false;
			errorList.push("Something went wrong while moving the pieces.");
		}
	}

	if(valid)
	{
		if(!createArtLayers())
		{
			valid = false;
			errorList.push("Something went wrong while creating the artwork layers.");
		}
	}

	if(valid)
	{
		bringEdgesForward();
	}

	if(valid)
	{
		if(!cleanUp())
		{
			valid = false;
			errorList.push("Something went wrong during cleanup.");
		}
		properTemplateSetup(docRef);
	}



	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/

	if(errorList.length>0)
	{
		sendErrors(errorList);
	}
	return valid

}
container();