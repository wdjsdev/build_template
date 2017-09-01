/*
//Converted Templates Rebuild

Please use the old "universal_template.jsx" for any garments that have already been converted
	baseball, softball, fastpitch, hoodies, full buttons, 2 buttons etc.

/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~
_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~

Script Name: Build_Template.js
Author: William Dowling
Build Date: 01 June, 2016
Description: Convert prepress file into scriptable template
Build number 2.000

Progress:
	
	Version: 2.001
		01 June, 2016
		Initial build. Set up containers and begin defining functions
		Set up script global variables and begin library object
	
	Version: 2.002
		02 June, 2016
		Fixes and adjustments to library object due to typos.
		added newly rebuilt rowSort function.
		added test logic to rename pieces per data from library object
		rowSort function is working properly
		**NOTE**
			Make sure to include a check for improper grouping
		Testing new object oriented placement data structure.
	
	Version: 2.003
		02 June, 2016
		functions added to name and place the pieces
			tested and working
		added function to create artwork layers
		added function to remove unnecessary layers and input styleNumber information
		currently working all the way through to create a converted template for football jerseys

	Version: 2.004
		06 July, 2016
		Fixed football 5411 artwork layer name, "Sponser Logo". Updated to correct spelling of "Sponsor Logo";
		Added football 250 to library object.
		Added youth football 250.

	Version: 2.005
		11 July, 2016
		Added soccer FD_858 to library
		Added FD_BASK_RV to library

	Version: 2.006
		15 July, 2016
		Added FDWH to library
		Added functionality to duplicate art to mockup layer if there is no sewn together mockup to speak of.

	Version: 2.007
		18 July, 2016
		Added FD_BASKY_RV to library

	Version: 2.008
		22 July, 2016
		Added FD_SOC_SS to library
			Styles:
			858, 3061, 3062, 3063, 3064

	Version: 2.009
		25 July, 2016
		Added FD_SOCY_SS to library
			Styles:
			858Y, 3061Y, 3062Y, 3063Y, 3064Y
	
	Version: 2.010
		26 July, 2016
		Added FD_SOC_LSK to library
			Adult and youth
		Added FD_SOC_SH to library
			adult and youth

	Version: 2.011
		28 July, 2016
		Added FD_VOL_CS to library

	Version: 2.012
		25 August, 2016
		Added contingency for multiple garment codes
			Example: basketball uniforms that have tops and shorts in the same file.
				tops and shorts have different style numbers, and thus need 2 separate text frames for style numbers
		Added FD_210_211 (mens basketball uniform) to library
		Updated "Cleanup" function to simply append the style number to the end of the garment code textframe rather than replacing all the text.
			Future templates will need to be set up accordingly.

	Version: 2.013
		29 August, 2016
		Added FD_210W_211W (women's basektball uniform) to library.

	Version: 2.014
		01 September, 2016
		Added FD_137 (mens basketball shooting shirt).

	Version: 2.015
		29 September, 2016
		Added new sizes for youth 250 and 5411 as well as binding piece

	Version: 2.016
		05 October, 2016
		Added FD_7025 to library
			7025 is 1/4zip pullover
		Added extra function to correctly sort pieces in the same row that share a left coordinate.
		Updated path to mockLabels file since i updated my local filesystem naming convention.

	Version 2.017
		05 October, 2016
		Updated sortVert function to use a buffer variable rather than a hard coded number for more versatility.

	Version 2.018
		06 October, 2016
		Experimenting with improvements to rowsort function
			instead of using group center +/- buffer, determine the top and bottom of the row, then look for items within that range +/- buffer
		**cancel. this isn't going to work without much more thought.

	Version 2.019
		07 October, 2016
		Added FD_597 to library

	Version 2.020
		17 October, 2016
		Centralized library
			new location ~/Desktop/automation/javascript/_new_cad_workflow/central_library/coords_library.js

	Version 2.021
		26 October, 2016
		Split centralized library between "add artwork" and "build template".

	Version 2.021
		28 October, 2016
		Added clipping mask functionality for mockup pieces.

	Version 2.022
		08 October, 2016
		Updated sort function for smoother operation and fewer errors.
			Sorted all pieces from top to bottom first and then determine row by number of pieces expected per size.

	Version 2.023
		09 October, 2016
		Added a check at the beginning of the sortPieces function.
		Checking for paths, text or compound paths (of which there should be none)
		If any are found, alert and exit.
		Also checking that the number of groups matches the number that it should be (pieceCount * sizeCount = total groups needed).
		If those don't match, alert and exit.

	Vresion 2.024
		14 December, 2016
		Adding conditional deletion of rmfront and rmback etc so i don't have to change it all the time.

	Version 2.025
		17 January, 2017
		Adding functionailty for naming ps pants pieces
		Failure. Reverting to 2.024 and starting over to add ps pants functionality

	Version 2.026
		17 January, 2017
		Starting over on attempting to add ps pants functionality.
		Sort function now works properly.
		Naming function now works properly.

*/

function container()	
{
	///////Begin/////////
	///Logic Container///
	/////////////////////



	//sortPieces Function Description
	//Sort the contents of the "To Be Placed" layer from top to bottom.
	//Then split the result into rows based on number of pieces per garment
	//Then sort each row from left to right
	//groups = array of groups
	//count = number of pieces per garment (ie. slowpitch would be 5. front, back, left sleeve, right sleeve, collar)
	function sortPieces(groups)
	{

		//create array of pieces

		var pieces = [];
		for(var x=0;x<groups.length;x++)
		{
			var thisPiece = groups[x];
			pieces.push(thisPiece);
		}


		//use these variables if the garment is not "inseam x waist" pants sizing structure
		//set sizeCount and pieceCount variables
		var sizeCount = thisGarment.sizes.length;
		var pieceCount = thisGarment.pieces.length;
		var correctCount = sizeCount * pieceCount;


		if(thisGarment["waist"] != undefined)
		{
			//this garment does not use standard sizing structure
			//re-set the pieceCount and correctCount variables to account for waist and inseam combinations
			pieceCount = thisGarment.waist.length * thisGarment.pieces.length;
			correctCount = sizeCount * pieceCount;
		}

		if(pieces.length != correctCount)
		{
			valid = false;
			alert("There are " + pieces.length + " groups on the TBP layer.\nThere should be " + correctCount);
			return;
		}
		else if(sourceLayer.pathItems.length > 0 || sourceLayer.textFrames.length > 0 || sourceLayer.compoundPathItems.length > 0)
		{
			valid = false;
			alert("Invalid items!\nTBP.pathItems.length = " + sourceLayer.pathItems.length + "\nTBP.textFrames.length = " + sourceLayer.textFrames.length + "\nTBP.compoundPathItems.length = " + sourceLayer.compoundPathItems.length);
		}


		var finalSorted = [];
		var verticalSorted = [];

		//loop all the pieces to find the topmost piece
		//push topMost to verticalSorted array
		//splice topMost from pieces and repeat until pieces.length == 0
		while(pieces.length>0)
		{
			var deleteIndex = 0;
			var topMost = pieces[0];
			var top = topMost.top;

			for(var x = pieces.length-1;x >0; x--)
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

		}


		//for each size, take the first n pieces and push into temp array
		//this will all of pieces for a given size.
		//for example, if there are 5 pieces necessary for a garment, it will pull the next 5 pieces from the verticalSorted array
		//and push them into the temp array so they can be sorted from left to right.
		for(var a=0;a<sizeCount;a++)
		{
			var temp = [];
			var tempSorted =[];
			
			for(var b=0;b<pieceCount;b++)
			{
				temp.push(verticalSorted[b]);
			}
			verticalSorted.splice(0,pieceCount);

			
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
		var sortVertBuffer =20;

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
		try
		{
			//unlock the garment layer
			garmentLayer.locked = false;

			for(var a=0;a<sorted.length;a++)
			{
				var thisArray = sorted[a];
				var theSize = thisGarment.sizes[a]
				var newSizeLayer = prepress.layers.add();
				newSizeLayer.name = theSize;
				newSizeLayer.zOrder(ZOrderMethod.SENDTOBACK);
				var thePieces = thisGarment.pieces;

				// //temp block for raglan hoodies

				// if(theSize == "5XL")
				// {
				// 	thePieces = thisGarment.piecesb;
				// }
				// else
				// {
				// 	thePieces = thisGarment.pieces;
				// }

				// //temp block for raglan hoodies
				
				//this block for regular garments that follow "XL Front" type sizing structure
				if(thisGarment["waist"] == undefined)
				{
					for(var b=0;b<thisArray.length;b++)
					{
						var thisPieceName = thePieces[b];
						if(thisPieceName == null)
						{
							alert("Error in size " + theSize);
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
						var thisPieceName = thisGarment["pieces"][pieceCounter];
						thisPiece.name = thisGarment["waist"][waistCounter] + "x" + theSize + " " + thisPieceName;
						thisPiece.moveToBeginning(newSizeLayer);

						//increment or reset pieceCounter
						if(pieceCounter < 7)
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
		}
		catch(e)
		{
			alert("failed while naming the pieces");
			valid = false;
			return;
		}
	}

	function moveThePieces(layers)
	{
		try
		{
			var curLay;
			var curSize;
			var mockLay = docRef.layers[1].layers["Mockup"];
			for(var a=0;a<layers.length;a++)
			{
				curLay = layers[a];
				curSize = curLay.name;
				var curPiece;
				var coords;
				for(var b=0;b<curLay.groupItems.length;b++)
				{
					curPiece = curLay.groupItems[b];
					coords = thisGarment.placement[curSize][curPiece.name];
					if(curPiece.name.indexOf("Outside Cowl")>-1)
					{
						curPiece.rotate(180);
					}
					curPiece.left = coords[0];
					curPiece.top = coords[1];
					
					//use this condition for non-"sewn together" mockups
					//if you're copying artwork from a "sewn together" mockup file, comment this section

					// if(curSize == thisGarment.mockupSize && curPiece.name.indexOf("Sleeve")>-1 )
					// {

					// 	var mockLay = docRef.layers[1].layers["Mockup"]

					// 	//make clipping mask
					// 	var clipGroup = mockLay.groupItems.add();
					// 	clipGroup.name = "Clip Group";
						

						
					// 	var mockPiece = curPiece.duplicate(clipGroup);
					// 	mockPiece.name = curPiece.name.substring(curPiece.name.indexOf(" ")+1,curPiece.name.length);
					// 	var clipMask = mockLay.pathItems[mockPiece.name + " Clip"];
					// 	clipMask.moveToBeginning(clipGroup);
						
					// 	// var pieceName = curPiece.name.substring(curPiece.name.indexOf(" ")+1,curPiece.name.length);
					// 	// var mockPiece = mockLay.groupItems["Mockup " + pieceName];
					// 	// mockPiece.left = coords[0];
					// 	// mockPiece.top = coords[1];
						

					// 	mockPiece.moveToBeginning(clipGroup);
						
					// 	clipMask.clipping = true;
					// 	clipMask.zOrder(ZOrderMethod.BRINGTOFRONT);
					// 	clipGroup.clipped = true;

					// 	clipGroup.name = "Mockup " + mockPiece.name;
					// }
				}
			}

			try
			{
				mockLay.groupItems["Edges"].zOrder(ZOrderMethod.BRINGTOFRONT);
			}
			catch(e)
			{
				//likely no edges group to bring forward.
			}

			//create a rectangle for collar representation.
			//
			// var collarDisplay = mockLay.pathItems.rectangle(-758.008,474.255,147.132,21.6);
			// var collarBorder = mockLay.pathItems.rectangle(-758.008,474.255,147.132,21.6);
			// collarBorder.filled = false;
			// collarBorder.strokeColor = docRef.swatches["EDGE"].color;
			// mockLay.groupItems["Edges"].locked = false;
			// collarBorder.moveToBeginning(mockLay.groupItems["Edges"]);
			// mockLay.groupItems["Edges"].locked = true;
			// collarDisplay.name = "Mockup Collar";
			// collarDisplay.fillColor = docRef.swatches["Collar B"].color;
			// collarDisplay.stroked = false;
		}
		catch(e)
		{
			alert(e)
			alert("failed while moving the pieces");
			valid = false;
			return;
		}
	}

	function createArtLayers()
	{
		try
		{
			var reversed = thisGarment.artLayers.reverse();
			for each(lay in reversed)
			{
				var newLay = artLayer.layers.add();
				newLay.name = lay;

			}
		}
		catch(e)
		{
			alert("Failed while creating the art layers");
			valid = false;
			return;
		}
	}

	function cleanUp()
	{
		try
		{
			
			var styleNum = prompt("Enter 3 digit style number", "0");
			style = styleNum;
			infoLayer.textFrames["Garment Code"].contents += styleNum;

			//check for existence of "Garment Code 2" textFrame. if true, repeat last line to add styleNum
			try
			{
				infoLayer.textFrames["Garment Code 2"].contents += styleNum;
			}
			catch(e)
			{
				//no garment code 2 text frame exists.. carry on
			}

			layers["To Be Placed"].remove();
			docRef.layers[0].name = code + "_" + styleNum;
			prepress.visible = false;
			infoLayer.locked = true;

			//build array of mockup groupItems to loop
			var mgi = [];
			for(var a = mockupLayer.groupItems.length-1;a >-1; a--)
			{
				var thisGroup = mockupLayer.groupItems[a];
				if(thisGroup.name.indexOf("rm")==0)
				{
					thisGroup.remove();
				}
			}

		}
		catch(e)
		{
			alert("Failed during cleanup");
			valid = false;
			return;
		}
	}


	////////End//////////
	///Logic Container///
	/////////////////////

	///////Begin////////
	////Data Storage////
	////////////////////

	
	// }

	#include "~/Desktop/automation/javascript/_new_cad_workflow/central_library/build_template_library.js"








	////////End/////////
	////Data Storage////
	////////////////////

	///////Begin////////
	///Function Calls///
	////////////////////

	//define script global variables

	var docRef = app.activeDocument;
	var valid = true;
	var layers = docRef.layers;
	var garmentLayer = layers[1];
	// var code = garmentLayer.name.substring(0,garmentLayer.name.indexOf("_0"));
	var code = garmentLayer.name.substring(0,garmentLayer.name.lastIndexOf("_"));
	var thisGarment = templateInfo[code];
	var prepress = garmentLayer.layers["Prepress"];
	var mockupLayer = garmentLayer.layers["Mockup"];
	var sourceLayer = layers["To Be Placed"];
	var infoLayer = garmentLayer.layers["Information"];
	var artLayer = garmentLayer.layers["Artwork Layer"];
	var style;
	var versionNum = 2.023;


	
	//deprecated function
	//use sortPieces instead
	// var sorted = rowSort(sourceLayer.groupItems);

	var sorted = sortPieces(sourceLayer.groupItems);

	if(valid)
		nameThePieces(sorted);

	if(valid)
		moveThePieces(prepress.layers);
	
	if(valid)
		createArtLayers();

	if(valid)
	{
		cleanUp();
	}

	if(valid)
	{
		var savePath= new Folder("~/Desktop/automation/template_creation/cur_proj/inprog/" + layers[0].name + ".ai");
		$.writeln(savePath);
		docRef.saveAs(savePath);
	}


	///////////////
	//Mock Labels
	//To be used when building a template that uses 'sewn together mockups'
	//////////////

	// #include "/Users/will.dowling/Desktop/automation/javascript/_new_cad_workflow/build_template/mockLabels.js";
	// #include "/Users/btimes3/Desktop/Boombah/Work From Home/Javascript/_New Cad Workflow/Build_Template/mockLabels.js";
    // if(valid)
	   //  mockupLabels(style);

	///////////////
	//Mock Labels
	//To be used when building a template that uses 'sewn together mockups'
	//////////////





	////////End/////////
	///Function Calls///
	////////////////////


}
container();