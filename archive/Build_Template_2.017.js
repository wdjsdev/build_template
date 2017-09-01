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
		Added FD_597 to library
		Updated sortVert function to use a buffer variable rather than a hard coded number for more versatility.
*/

function container()	
{
	///////Begin/////////
	///Logic Container///
	/////////////////////


	function rowSort(theArray)
	{
		try
		{
			var groups = [];
			var finalSorted = [];
			var rows = [];
			var buffer = 100;

			//populate groups array
			for(var a=0;a<theArray.length;a++)
			{
				groups.push(theArray[a]);
			}

			var groupsCopy = groups;

			//populate temp arraywith groups of the same row
			while(groupsCopy.length > 0)
			{
				var temp = [];
				var tempSorted = [];
				var rowMarker = groupsCopy[0].top - groupsCopy[0].height/2;
				temp.push(groupsCopy[0]);
				groupsCopy.splice(0,1);
				for(var a=groupsCopy.length-1;a>-1;a--)
				{
					var thisGroup = groupsCopy[a];
					var vPos = thisGroup.top - thisGroup.height/2
					// alert("vPos, buffer and rowMarker\nvPos = " + vPos + "\nbuffer = " + buffer + "\nrowMarker = " + rowMarker);
					if(vPos + buffer > rowMarker && vPos - buffer < rowMarker)
					{
						temp.push(groupsCopy[a]);
						groupsCopy.splice(a,1);
					}
				}
				// alert("temp.length = " + temp.length);

				//row has been determined
				//loop the row to find farLeft and push to tempSorted
				while(temp.length>0)
				{
					var farLeft = temp[0];
					var deleteIndex = 0;

					for(var a=0;a<temp.length;a++)
					{
						if(temp[a].left < farLeft.left)
						{
							farLeft = temp[a];
							deleteIndex = a;
						}
					}
					tempSorted.push(farLeft);
					temp.splice(deleteIndex,1)

				}

				var tempSortedVert = sortVert(tempSorted);

				//push the left to right sorted row to rows array
				rows.push(tempSortedVert);
			}

			//all rows have been established and sorted left to right
			//sort rows vertically and push topMost to finalSorted array
			while(rows.length > 0)
			{
				var topMost = rows[0];
				var vMarker = topMost[0].top;
				var deleteIndex = 0;

				for(var a=1;a<rows.length;a++)
				{
					if(rows[a][0].top > vMarker)
					{
						topMost = rows[a]
						deleteIndex = a;
					}
				}
				finalSorted.push(topMost);
				rows.splice(deleteIndex,1)
			}
		}
		catch(e)
		{
			alert("failed while sorting the pieces");
			valid = false;
			return;
		}
		return finalSorted;
	}

	function sortVert(thisRow)
	{
		var finishedSorting = [];
		var sortVertBuffer = 10;

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
				for(var b=0;b<thisArray.length;b++)
				{
					var thisPieceName = thisGarment.pieces[b];
					if(thisPieceName == null)
						alert("Error in size " + theSize);
					var thisPiece = thisArray[b];
					thisPiece.name = theSize + " " + thisPieceName;
					thisPiece.moveToBeginning(newSizeLayer);

					//use this condition for non-"sewn together" mockups
					//if you're copying artwork from a "sewn together" mockup file, comment this section
					
					// if(theSize == thisGarment.mockupSize)
					// {
					// 	var mockPiece = thisPiece.duplicate(mockupLayer);
					// 	mockPiece.name = "Mockup " + thisPieceName;
					// }
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

					// if(curSize == thisGarment.mockupSize)
					// {
					// 	var pieceName = curPiece.name.substring(curPiece.name.indexOf(" ")+1,curPiece.name.length);
					// 	var mockPiece = mockupLayer.groupItems["Mockup " + pieceName];
					// 	mockPiece.left = coords[0];
					// 	mockPiece.top = coords[1];
					// }
				}
			}
		}
		catch(e)
		{
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

	var library = 
	{
		//////////
		//football
		//////////
		"FD_5411" :
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Right Cowl", "Left Cowl", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Left Cuff", "Right Cuff", "Back", "Collar", "Left Side Panel", "Right Side Panel", "Outside Cowl", "Left Sleeve", "Right Sleeve", "Inside Cowl"],
			"placement" : 
			{
				"S" : {"S Inside Cowl" : [225.809,199.65],"S Right Sleeve" : [274.823,-124.919],"S Outside Cowl" : [37.614,-317.605],"S Left Sleeve" : [274.811,-209.032],"S Right Side Panel" : [476.893,292.279],"S Left Side Panel" : [136.916,292.279],"S Collar" : [223.589,237.73],"S Back" : [430.864,-51.791],"S Right Cuff" : [260.789,274.13],"S Left Cuff" : [261.085,319.97],"S Front" : [44.465,-52.051]},
				"M" : {"M Inside Cowl" : [222.209,199.617],"M Right Sleeve" : [274.823,-124.919],"M Outside Cowl" : [34.014,-317.605],"M Left Sleeve" : [274.811,-209.032],"M Right Side Panel" : [476.892,296.017],"M Left Side Panel" : [136.916,296.017],"M Collar" : [223.761,237.73],"M Back" : [426.886,-51.791],"M Right Cuff" : [261.078,274.13],"M Left Cuff" : [261.023,319.97],"M Front" : [40.483,-52.051]},
				"L" : {"L Inside Cowl" : [218.609,199.617],"L Right Sleeve" : [274.823,-124.919],"L Outside Cowl" : [30.414,-317.605],"L Left Sleeve" : [274.811,-209.032],"L Right Side Panel" : [476.892,299.535],"L Left Side Panel" : [136.916,299.535],"L Collar" : [223.723,237.73],"L Back" : [422.074,-51.791],"L Right Cuff" : [260.628,274.13],"L Left Cuff" : [260.79,319.97],"L Front" : [35.674,-52.051]},
				"XL" : {"XL Inside Cowl" : [215.009,199.617],"XL Right Sleeve" : [274.823,-124.919],"XL Outside Cowl" : [26.814,-317.605],"XL Left Sleeve" : [274.811,-209.032],"XL Right Side Panel" : [476.893,303.216],"XL Left Side Panel" : [136.916,303.216],"XL Collar" : [223.799,237.729],"XL Back" : [416.513,-51.791],"XL Right Cuff" : [260.762,274.13],"XL Left Cuff" : [261.029,319.971],"XL Front" : [30.113,-52.051]},
				"2XL" : {"2XL Inside Cowl" : [211.409,199.579],"2XL Right Sleeve" : [274.823,-124.919],"2XL Outside Cowl" : [23.214,-317.605],"2XL Left Sleeve" : [274.811,-209.032],"2XL Right Side Panel" : [476.892,306.839],"2XL Left Side Panel" : [136.916,306.839],"2XL Collar" : [223.607,237.729],"2XL Back" : [410.616,-51.791],"2XL Right Cuff" : [261.233,274.13],"2XL Left Cuff" : [261.233,319.97],"2XL Front" : [24.221,-52.051]},
				"3XL" : {"3XL Inside Cowl" : [207.809,199.701],"3XL Right Sleeve" : [274.824,-124.919],"3XL Outside Cowl" : [19.615,-317.236],"3XL Left Sleeve" : [274.811,-209.032],"3XL Right Side Panel" : [476.892,310.24],"3XL Left Side Panel" : [136.916,310.24],"3XL Collar" : [223.662,237.73],"3XL Back" : [407.425,-51.791],"3XL Right Cuff" : [260.437,274.13],"3XL Left Cuff" : [260.467,319.97],"3XL Front" : [21.027,-52.051]},
				"4XL" : {"4XL Inside Cowl" : [204.209,199.579],"4XL Right Sleeve" : [274.823,-124.919],"4XL Outside Cowl" : [16.014,-317.605],"4XL Left Sleeve" : [274.811,-209.032],"4XL Right Side Panel" : [476.892,316.471],"4XL Left Side Panel" : [136.916,316.471],"4XL Collar" : [223.567,237.73],"4XL Back" : [402.915,-51.791],"4XL Right Cuff" : [260.785,274.13],"4XL Left Cuff" : [260.71,319.971],"4XL Front" : [16.516,-52.051]},
				"5XL" : {"5XL Inside Cowl" : [200.609,199.579],"5XL Right Sleeve" : [274.825,-124.919],"5XL Outside Cowl" : [12.414,-317.604],"5XL Left Sleeve" : [274.818,-209.028],"5XL Right Side Panel" : [476.892,318.793],"5XL Left Side Panel" : [136.916,318.793],"5XL Collar" : [223.365,237.729],"5XL Back" : [398.569,-51.791],"5XL Right Cuff" : [260.614,274.13],"5XL Left Cuff" : [260.94,319.97],"5XL Front" : [12.17,-52.051]}
			}
		},
		"FD_5411Y" :
		{
			"mockupSize" : "YXL",
			"sizes" : ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Right Cowl", "Left Cowl", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Left Cuff", "Back", "Right Cuff", "Collar", "Left Side Panel", "Right Side Panel", "Left Sleeve", "Outside Cowl", "Right Sleeve", "Inside Cowl"],
			"placement" : 
			{
				"YS" : {"YS Inside Cowl" : [243.037,201.255],"YS Right Sleeve" : [281.074,-66.995],"YS Outside Cowl" : [47.69,-332.595],"YS Left Sleeve" : [281.074,-162.078],"YS Right Side Panel" : [447.835,258.278],"YS Left Side Panel" : [159.98,258.279],"YS Collar" : [232.702,238.666],"YS Right Cuff" : [249.173,278.213],"YS Back" : [462.001,-59.182],"YS Left Cuff" : [247.396,314.252],"YS Front" : [40.302,-59.767]},
				"YM" : {"YM Inside Cowl" : [236.6,201.253],"YM Right Sleeve" : [281.074,-67.003],"YM Outside Cowl" : [41.252,-332.592],"YM Left Sleeve" : [281.077,-162.078],"YM Right Side Panel" : [447.832,262.514],"YM Left Side Panel" : [159.976,262.514],"YM Collar" : [232.701,238.666],"YM Right Cuff" : [249.356,278.213],"YM Back" : [455.636,-59.182],"YM Left Cuff" : [247.411,314.252],"YM Front" : [33.905,-59.767]},
				"YL" : {"YL Inside Cowl" : [232.833,201.253],"YL Right Sleeve" : [281.077,-67.003],"YL Outside Cowl" : [37.484,-332.592],"YL Left Sleeve" : [281.078,-162.078],"YL Right Side Panel" : [447.835,268.85],"YL Left Side Panel" : [159.98,268.855],"YL Collar" : [232.701,238.666],"YL Right Cuff" : [249.266,278.213],"YL Back" : [451.987,-59.182],"YL Left Cuff" : [247.411,314.252],"YL Front" : [30.22,-59.767]},
				"YXL" : {"YXL Inside Cowl" : [226.702,201.25],"YXL Right Sleeve" : [281.078,-67.003],"YXL Outside Cowl" : [31.349,-332.592],"YXL Left Sleeve" : [281.074,-162.07],"YXL Right Side Panel" : [447.835,274.445],"YXL Left Side Panel" : [159.98,274.451],"YXL Collar" : [232.695,238.666],"YXL Right Cuff" : [249.362,278.213],"YXL Back" : [446.003,-59.182],"YXL Left Cuff" : [247.411,314.252],"YXL Front" : [24.198,-59.767]}
			}
		},
		"FD_250" :
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Right Cowl", "Left Cowl", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Left Cuff", "Right Cuff", "Back", "Collar", "Left Side Panel", "Right Side Panel", "Left Sleeve", "Outside Cowl", "Right Sleeve", "Inside Cowl"],
			"placement" : 
			{
				"S" : {"S Inside Cowl" : [225.809,199.65],"S Right Sleeve" : [274.823,-124.919],"S Outside Cowl" : [37.614,-317.605],"S Left Sleeve" : [274.811,-209.032],"S Right Side Panel" : [476.893,292.279],"S Left Side Panel" : [136.916,292.279],"S Collar" : [223.589,237.73],"S Back" : [430.864,-51.791],"S Right Cuff" : [260.789,274.13],"S Left Cuff" : [261.085,319.97],"S Front" : [44.465,-52.051]},
				"M" : {"M Inside Cowl" : [222.209,199.617],"M Right Sleeve" : [274.823,-124.919],"M Outside Cowl" : [34.014,-317.605],"M Left Sleeve" : [274.811,-209.032],"M Right Side Panel" : [476.892,296.017],"M Left Side Panel" : [136.916,296.017],"M Collar" : [223.761,237.73],"M Back" : [426.886,-51.791],"M Right Cuff" : [261.078,274.13],"M Left Cuff" : [261.023,319.97],"M Front" : [40.483,-52.051]},
				"L" : {"L Inside Cowl" : [218.609,199.617],"L Right Sleeve" : [274.823,-124.919],"L Outside Cowl" : [30.414,-317.605],"L Left Sleeve" : [274.811,-209.032],"L Right Side Panel" : [476.892,299.535],"L Left Side Panel" : [136.916,299.535],"L Collar" : [223.723,237.73],"L Back" : [422.074,-51.791],"L Right Cuff" : [260.628,274.13],"L Left Cuff" : [260.79,319.97],"L Front" : [35.674,-52.051]},
				"XL" : {"XL Inside Cowl" : [215.009,199.617],"XL Right Sleeve" : [274.823,-124.919],"XL Outside Cowl" : [26.814,-317.605],"XL Left Sleeve" : [274.811,-209.032],"XL Right Side Panel" : [476.893,303.216],"XL Left Side Panel" : [136.916,303.216],"XL Collar" : [223.799,237.729],"XL Back" : [416.513,-51.791],"XL Right Cuff" : [260.762,274.13],"XL Left Cuff" : [261.029,319.971],"XL Front" : [30.113,-52.051]},
				"2XL" : {"2XL Inside Cowl" : [211.409,199.579],"2XL Right Sleeve" : [274.823,-124.919],"2XL Outside Cowl" : [23.214,-317.605],"2XL Left Sleeve" : [274.811,-209.032],"2XL Right Side Panel" : [476.892,306.839],"2XL Left Side Panel" : [136.916,306.839],"2XL Collar" : [223.607,237.729],"2XL Back" : [410.616,-51.791],"2XL Right Cuff" : [261.233,274.13],"2XL Left Cuff" : [261.233,319.97],"2XL Front" : [24.221,-52.051]},
				"3XL" : {"3XL Inside Cowl" : [207.809,199.701],"3XL Right Sleeve" : [274.824,-124.919],"3XL Outside Cowl" : [19.615,-317.236],"3XL Left Sleeve" : [274.811,-209.032],"3XL Right Side Panel" : [476.892,310.24],"3XL Left Side Panel" : [136.916,310.24],"3XL Collar" : [223.662,237.73],"3XL Back" : [407.425,-51.791],"3XL Right Cuff" : [260.437,274.13],"3XL Left Cuff" : [260.467,319.97],"3XL Front" : [21.027,-52.051]},
				"4XL" : {"4XL Inside Cowl" : [204.209,199.579],"4XL Right Sleeve" : [274.823,-124.919],"4XL Outside Cowl" : [16.014,-317.605],"4XL Left Sleeve" : [274.811,-209.032],"4XL Right Side Panel" : [476.892,316.471],"4XL Left Side Panel" : [136.916,316.471],"4XL Collar" : [223.567,237.73],"4XL Back" : [402.915,-51.791],"4XL Right Cuff" : [260.785,274.13],"4XL Left Cuff" : [260.71,319.971],"4XL Front" : [16.516,-52.051]},
				"5XL" : {"5XL Inside Cowl" : [200.609,199.579],"5XL Right Sleeve" : [274.825,-124.919],"5XL Outside Cowl" : [12.414,-317.604],"5XL Left Sleeve" : [274.818,-209.028],"5XL Right Side Panel" : [476.892,318.793],"5XL Left Side Panel" : [136.916,318.793],"5XL Collar" : [223.365,237.729],"5XL Back" : [398.569,-51.791],"5XL Right Cuff" : [260.614,274.13],"5XL Left Cuff" : [260.94,319.97],"5XL Front" : [12.17,-52.051]}
			}
		},
		"FD_250Y" :
		{
			"mockupSize" : "YXL",
			"sizes" : ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Right Cowl", "Left Cowl", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Left Cuff", "Back", "Right Cuff", "Collar", "Left Side Panel", "Right Side Panel", "Left Sleeve", "Outside Cowl", "Right Sleeve", "Inside Cowl"],
			"placement" : 
			{
				"YS" : {"YS Inside Cowl" : [243.037,201.255],"YS Right Sleeve" : [281.074,-66.995],"YS Outside Cowl" : [47.69,-332.595],"YS Left Sleeve" : [281.074,-162.078],"YS Right Side Panel" : [447.835,258.278],"YS Left Side Panel" : [159.98,258.279],"YS Collar" : [232.702,238.666],"YS Right Cuff" : [249.173,278.213],"YS Back" : [462.001,-59.182],"YS Left Cuff" : [247.396,314.252],"YS Front" : [40.302,-59.767]},
				"YM" : {"YM Inside Cowl" : [236.6,201.253],"YM Right Sleeve" : [281.074,-67.003],"YM Outside Cowl" : [41.252,-332.592],"YM Left Sleeve" : [281.077,-162.078],"YM Right Side Panel" : [447.832,262.514],"YM Left Side Panel" : [159.976,262.514],"YM Collar" : [232.701,238.666],"YM Right Cuff" : [249.356,278.213],"YM Back" : [455.636,-59.182],"YM Left Cuff" : [247.411,314.252],"YM Front" : [33.905,-59.767]},
				"YL" : {"YL Inside Cowl" : [232.833,201.253],"YL Right Sleeve" : [281.077,-67.003],"YL Outside Cowl" : [37.484,-332.592],"YL Left Sleeve" : [281.078,-162.078],"YL Right Side Panel" : [447.835,268.85],"YL Left Side Panel" : [159.98,268.855],"YL Collar" : [232.701,238.666],"YL Right Cuff" : [249.266,278.213],"YL Back" : [451.987,-59.182],"YL Left Cuff" : [247.411,314.252],"YL Front" : [30.22,-59.767]},
				"YXL" : {"YXL Inside Cowl" : [226.702,201.25],"YXL Right Sleeve" : [281.078,-67.003],"YXL Outside Cowl" : [31.349,-332.592],"YXL Left Sleeve" : [281.074,-162.07],"YXL Right Side Panel" : [447.835,274.445],"YXL Left Side Panel" : [159.98,274.451],"YXL Collar" : [232.695,238.666],"YXL Right Cuff" : [249.362,278.213],"YXL Back" : [446.003,-59.182],"YXL Left Cuff" : [247.411,314.252],"YXL Front" : [24.198,-59.767]}
			}
		},

		////////
		//soccer
		////////
		"FD_858" :
		{
			"mockupSize" : "XL",
			"sizes": ["S", "M", "L", "XL", "2XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Collar 2", "Left Sleeve"],
			"placement" : 
			{
				"S" : {"S Left Sleeve" : [204.167,-347.566],"S Collar 2" : [271.711,153.097],"S Collar" : [268.945,124.433],"S Right Sleeve" : [-10.993,-347.788],"S Back" : [446.082,-27.355],"S Front" : [58.637,-25.591]},
				"M" : {"M Left Sleeve" : [201.042,-345.766],"M Collar 2" : [269.781,153.1],"M Collar" : [268.193,124.429],"M Right Sleeve" : [-14.118,-345.988],"M Back" : [440.686,-24.274],"M Front" : [53.237,-22.801]},
				"L" : {"L Left Sleeve" : [198.218,-343.966],"L Collar 2" : [269.141,153.097],"L Collar" : [266.085,124.433],"L Right Sleeve" : [-16.942,-344.188],"L Back" : [435.282,-20.659],"L Front" : [47.837,-20.221]},
				"XL" : {"XL Left Sleeve" : [195.126,-342.166],"XL Collar 2" : [267.239	,153.1],"XL Collar" : [265.336,124.429],"XL Right Sleeve" : [-20.033,-342.388],"XL Back" : [429.886,-17.075],"XL Front" : [42.437,-17.595]},
				"2XL" : {"2XL Left Sleeve" : [192.321,-340.366],"2XL Collar 2" : [266.611,153.097],"2XL Collar" : [263.726,124.429],"2XL Right Sleeve" : [-22.839,-340.588],"2XL Back" : [424.486,-13.486],"2XL Front" : [37.037,-14.931]}
			}
		},
		"FD_858Y" :
		{
			"mockupSize" : "YXL",
			"sizes": ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Collar 2", "Left Sleeve"],
			"placement" :
			{
				"YS" : {"YS Left Sleeve" : [226.818,-378.653],"YS Collar 2" : [287.858,156.693],"YS Collar" : [285.016,120.148],"YS Right Sleeve" : [11.86,-378.711],"YS Back" : [463.197,-58.693],"YS Front" : [79.729,-57.374]},
				"YM" : {"YM Left Sleeve" : [223.898,-374.319],"YM Collar 2" : [285.874,156.693],"YM Collar" : [283.356,120.148],"YM Right Sleeve" : [8.738,-374.377],"YM Back" : [458.66,-53.316],"YM Front" : [75.195,-54.228]},
				"YL" : {"YL Left Sleeve" : [220.364,-368.249],"YL Collar 2" : [283.89,156.693],"YL Collar" : [281.687,120.148],"YL Right Sleeve" : [5.204,-368.307],"YL Back" : [454.128,-47.79],"YL Front" : [70.659,-51.366]},
				"YXL" : {"YXL Left Sleeve" : [216.28,-362.589],"YXL Collar 2" : [281.953,156.712],"YXL Collar" : [279.987,120.148],"YXL Right Sleeve" : [1.119,-362.647],"YXL Back" : [449.732,-42.553],"YXL Front" : [66.27,-48.789]}
			}
		},
		"FD_3061" :
		{
			"mockupSize" : "XL",
			"sizes": ["S", "M", "L", "XL", "2XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Collar", "Front", "Back", "Left Sleeve", "Right Sleeve"],
			"placement" : 
			{
				"S" : {"S Right Sleeve" : [-9.539,-345.738],"S Left Sleeve" : [207.684,-345.692],"S Back" : [447.006,-38.846],"S Front" : [59.057,-45.736],"S Collar" : [234.214,133.38]},
				"M" : {"M Right Sleeve" : [-11.668,-338.539],"M Left Sleeve" : [205.554,-338.493],"M Back" : [441.6,-37.046],"M Front" : [53.656,-43.269],"M Collar" : [231.448,133.38]},
				"L" : {"L Right Sleeve" : [-14.184,-331.347],"L Left Sleeve" : [203.043,-331.288],"L Back" : [436.199,-35.246],"L Front" : [48.257,-40.469],"L Collar" : [229.893,133.379]},
				"XL" : {"XL Right Sleeve" : [-16.548,-324.136],"XL Left Sleeve" : [200.679,-324.09],"XL Back" : [430.8,-33.446],"XL Front" : [42.857,-37.669],"XL Collar" : [226.56,133.379]},
				"2XL" : {"2XL Right Sleeve" : [-18.91,-316.937],"2XL Left Sleeve" : [198.313,-316.897],"2XL Back" : [425.406,-31.646],"2XL Front" : [37.461,-35.132],"2XL Collar" : [224.781,133.38]}
			}
		},
		"FD_3061Y" : 
		{
			"mockupSize" : "YXL",
			"sizes": ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Collar", "Front", "Back", "Right Sleeve", "Left Sleeve"],
			"placement" :
			{
				"YS" : {"YS Left Sleeve" : [14.948,-357.895],"YS Right Sleeve" : [229.636,-357.985],"YS Back" : [462.906,-67.549],"YS Front" : [79.483,-71.815],"YS Collar" : [251.809,109.635]},
				"YM" : {"YM Left Sleeve" : [10.354,-353.401],"YM Right Sleeve" : [225.036,-353.485],"YM Back" : [458.406,-65.749],"YM Front" : [74.986,-69.125],"YM Collar" : [249.321,109.624]},
				"YL" : {"YL Left Sleeve" : [6.008,-348.901],"YL Right Sleeve" : [220.691,-348.985],"YL Back" : [453.906,-63.949],"YL Front" : [70.482,-66.39],"YL Collar" : [247.477,109.625]},
				"YXL" : {"YXL Left Sleeve" : [1.771,-344.408],"YXL Right Sleeve" : [216.454,-344.48],"YXL Back" : [449.412,-62.149],"YXL Front" : [65.983,-63.723],"YXL Collar" : [245.511,109.624]}
			}
		},
		"FD_3062" :
		{
			"mockupSize" : "XL",
			"sizes": ["S", "M", "L", "XL", "2XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Collar","Collar Triangle", "Front", "Back", "Left Sleeve", "Right Sleeve"],
			"placement" : 
			{
				"S" : {"S Right Sleeve" : [-9.535,-344.109],"S Left Sleeve" : [207.689,-345.048],"S Back" : [447.1,-27.359],"S Front" : [64.832,-42.27],"S Collar Triangle" : [304.439,231.313],"S Collar" : [244.08,158.787]},
				"M" : {"M Right Sleeve" : [-11.67,-336.909],"M Left Sleeve" : [205.555,-337.85],"M Back" : [441.7,-25.558],"M Front" : [59.431,-39.632],"M Collar Triangle" : [303.679,232.22],"M Collar" : [241.995,158.787]},
				"L" : {"L Right Sleeve" : [-14.182,-329.709],"L Left Sleeve" : [203.043,-330.649],"L Back" : [436.299,-23.758],"L Front" : [54.032,-36.995],"L Collar Triangle" : [303.496,232.198],"L Collar" : [239.915,158.787]},
				"XL" : {"XL Right Sleeve" : [-16.546,-322.508],"XL Left Sleeve" : [200.678,-323.45],"XL Back" : [430.899,-21.958],"XL Front" : [48.631,-34.319],"XL Collar Triangle" : [303.214,232.212],"XL Collar" : [237.826,158.787]},
				"2XL" : {"2XL Right Sleeve" : [-18.911,-315.308],"2XL Left Sleeve" : [198.313,-316.249],"2XL Back" : [425.504,-20.159],"2XL Front" : [43.231,-31.602],"2XL Collar Triangle" : [303,232.204],"2XL Collar" : [235.739,158.787]}
			}
		},
		"FD_3062Y" : 
		{
			"mockupSize" : "YXL",
			"sizes": ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Collar", "Front","Collar Triangle", "Back", "Left Sleeve", "Right Sleeve"],
			"placement" :
			{
				"YS" : {"YS Right Sleeve" : [14.974,-361.357],"YS Left Sleeve" : [230.134,-361.154],"YS Back" : [463.961,-65.222],"YS Collar Triangle" : [303.3,144.184],"YS Front" : [79.883,-74.518],"YS Collar" : [253.373,196.038]},
				"YM" : {"YM Right Sleeve" : [10.374,-356.858],"YM Left Sleeve" : [225.534,-356.654],"YM Back" : [459.461,-63.381],"YM Collar Triangle" : [303.029,144.18],"YM Front" : [75.383,-71.683],"YM Collar" : [251.29,196.024]},
				"YL" : {"YL Right Sleeve" : [6.029,-352.357],"YL Left Sleeve" : [221.189,-352.14],"YL Back" : [454.965,-61.473],"YL Collar Triangle" : [302.733,144.18],"YL Front" : [70.884,-69.177],"YL Collar" : [249.203,196.024]},
				"YXL" : {"YXL Right Sleeve" : [1.791,-347.858],"YXL Left Sleeve" : [216.952,-347.655],"YXL Back" : [450.461,-59.764],"YXL Collar Triangle" : [302.47,144.197],"YXL Front" : [66.383,-66.474],"YXL Collar" : [247.119,196.083]}
			}
		},
		"FD_3063" :
		{
			"mockupSize" : "XL",
			"sizes": ["S", "M", "L", "XL", "2XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Back", "Left Sleeve", "Inside Collar", "Binding", "Outside Collar", "Right Sleeve", "Placket"],
			"placement" : 
			{
				"S" : {"S Placket" : [300.522,277.659],"S Right Sleeve" : [-1.555,-356.01],"S Outside Collar" : [259.711,150.384],"S Binding" : [260.09,222.142],"S Inside Collar" : [259.709,197.105],"S Left Sleeve" : [213.608,-356.075],"S Back" : [446.219,-39.642],"S Front" : [62.637,-42.068]},
				"M" : {"M Placket" : [300.35,277.723],"M Right Sleeve" : [-4.476,-354.216],"M Outside Collar" : [258.374,150.367],"M Binding" : [260.09,222.142],"M Inside Collar" : [258.374,197.088],"M Left Sleeve" : [210.686,-354.28],"M Back" : [440.819,-37.928],"M Front" : [57.237,-39.551]},
				"L" : {"L Placket" : [300.186,277.642],"L Right Sleeve" : [-7.518,-352.421],"L Outside Collar" : [256.482,150.36],"L Binding" : [260.09,222.142],"L Inside Collar" : [256.483,197.082],"L Left Sleeve" : [207.645,-352.484],"L Back" : [435.419,-36.136],"L Front" : [51.837,-36.833]},
				"XL" : {"XL Placket" : [300.021,277.565],"XL Right Sleeve" : [-10.553,-350.624],"XL Outside Collar" : [254.535,150.352],"XL Binding" : [260.09,222.142],"XL Inside Collar" : [254.539,197.071],"XL Left Sleeve" : [204.606,-350.688],"XL Back" : [430.019,-34.414],"XL Front" : [46.437,-34.186]},
				"2XL" : {"2XL Placket" : [299.848,277.5],"2XL Right Sleeve" : [-13.594,-348.827],"2XL Outside Collar" : [251.495,150.346],"2XL Binding" : [260.09,222.142],"2XL Inside Collar" : [251.495,197.068],"2XL Left Sleeve" : [201.568,-348.891],"2XL Back" : [424.62,-32.692],"2XL Front" : [41.037,-31.558]}
			}
		},
		"FD_3063Y" : 
		{
			"mockupSize" : "YXL",
			"sizes": ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Back", "Binding", "Inside Collar", "Left Sleeve", "Outside Collar", "Right Sleeve", "Placket"],
			"placement" :
			{
				"YS" : {"YS Placket" : [309.251,274.015],"YS Right Sleeve" : [14.472,-364.239],"YS Outside Collar" : [277.479,134.586],"YS Left Sleeve" : [229.631,-364.182],"YS Inside Collar" : [277.479,216.63],"YS Binding" : [268.021,164.065],"YS Back" : [462.443,-58.413],"YS Front" : [78.568,-62.151]},
				"YM" : {"YM Placket" : [309.06,274.043],"YM Right Sleeve" : [12.078,-363.346],"YM Outside Collar" : [275.539,134.568],"YM Left Sleeve" : [227.235,-363.289],"YM Inside Collar" : [275.539,216.608],"YM Binding" : [268.021,164.065],"YM Back" : [457.944,-56.614],"YM Front" : [74.065,-59.565]},
				"YL" : {"YL Placket" : [308.87,274.078],"YL Right Sleeve" : [8.377,-362.449],"YL Outside Collar" : [273.592,134.555],"YL Left Sleeve" : [223.537,-362.391],"YL Inside Collar" : [273.596,216.594],"YL Binding" : [268.021,164.065],"YL Back" : [453.444,-54.814],"YL Front" : [69.565,-56.887]},
				"YXL" : {"YXL Placket" : [308.68,274.114],"YXL Right Sleeve" : [4.668,-361.549],"YXL Outside Collar" : [271.578,134.543],"YXL Left Sleeve" : [219.828,-361.494],"YXL Inside Collar" : [271.652,216.579],"YXL Binding" : [268.021,164.065],"YXL Back" : [448.945,-53.013],"YXL Front" : [65.065,-54.211]}
			} 
		},
		"FD_3064" :
		{
			"mockupSize" : "XL",
			"sizes": ["S", "M", "L", "XL", "2XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Collar", "Back", "Left Sleeve", "Right Sleeve"],
			"placement" : 
			{
				"S" : {"S Right Sleeve" : [-1.548,-356.126],"S Left Sleeve" : [213.612,-356.127],"S Back" : [446.313,-39.206],"S Collar" : [243.07,122.992],"S Front" : [62.73,-46.309]},
				"M" : {"M Right Sleeve" : [-4.473,-354.331],"M Left Sleeve" : [210.686,-354.332],"M Back" : [440.913,-37.406],"M Collar" : [240.838,123.175],"M Front" : [57.33,-43.815]},
				"L" : {"L Right Sleeve" : [-7.511,-352.536],"L Left Sleeve" : [207.646,-352.537],"L Back" : [435.509,-35.702],"L Collar" : [238.566,122.973],"L Front" : [51.931,-41.112]},
				"XL" : {"XL Right Sleeve" : [-10.55,-350.74],"XL Left Sleeve" : [204.606,-350.742],"XL Back" : [430.113,-33.979],"XL Collar" : [235.967,122.973],"XL Front" : [46.527,-38.408]},
				"2XL" : {"2XL Right Sleeve" : [-13.592,-348.942],"2XL Left Sleeve" : [201.572,-348.944],"2XL Back" : [424.713,-32.218],"2XL Collar" : [233.738,122.973],"2XL Front" : [41.131,-35.844]}
			}
		},
		"FD_3064Y" : 
		{
			"mockupSize" : "YXL",
			"sizes": ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Collar", "Front", "Back", "Left Sleeve", "Right Sleeve"],
			"placement" :
			{
				"YS" : {"YS Right Sleeve" : [14.477,-364.013],"YS Left Sleeve" : [229.631,-364.109],"YS Back" : [462.443,-55.59],"YS Front" : [79.244,-61.346],"YS Collar" : [252.049,121.75]},
				"YM" : {"YM Right Sleeve" : [12.075,-363.12],"YM Left Sleeve" : [227.235,-363.216],"YM Back" : [457.94,-53.79],"YM Front" : [74.744,-58.771],"YM Collar" : [249.063,121.734]},
				"YL" : {"YL Right Sleeve" : [8.373,-362.223],"YL Left Sleeve" : [223.537,-362.319],"YL Back" : [453.444,-52.09],"YL Front" : [70.245,-55.937],"YL Collar" : [247.266,121.734]},
				"YXL" : {"YXL Right Sleeve" : [4.671,-361.324],"YXL Left Sleeve" : [219.835,-361.42],"YXL Back" : [448.944,-50.35],"YXL Front" : [65.745,-53.449],"YXL Collar" : [244.936,121.738]}
			} 
		},
		"FD_3092" : 
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Collar", "Back", "Left Liner", "Right Liner", "Left Sleeve", "Left Cuff", "Right Sleeve", "Right Cuff"],
			"placement" :
			{
				"S" : {"S Right Cuff" : [138.724,135.898],"S Right Sleeve" : [203.591,-289.556],"S Left Cuff" : [435.766,137.487],"S Left Sleeve" : [-12.995,-289.512],"S Right Liner" : [344.565,226.668],"S Left Liner" : [244.067,226.66],"S Back" : [419.541,-2.701],"S Collar" : [243.041,115.303],"S Front" : [67.585,-5.352]},
				"M" : {"M Right Cuff" : [136.8,135.898],"M Right Sleeve" : [198.135,-285.956],"M Left Cuff" : [433.642,137.487],"M Left Sleeve" : [-18.454,-285.905],"M Right Liner" : [343.741,227.073],"M Left Liner" : [243.243,227.069],"M Back" : [414.128,-1.35],"M Collar" : [241.877,115.303],"M Front" : [62.189,-1.721]},
				"L" : {"L Right Cuff" : [135.25,135.901],"L Right Sleeve" : [192.671,-282.348],"L Left Cuff" : [432.36,137.487],"L Left Sleeve" : [-23.91,-282.298],"L Right Liner" : [342.911,227.602],"L Left Liner" : [242.415,227.598],"L Back" : [409.082,0.309],"L Collar" : [241.364,115.303],"L Front" : [56.789,0.995]},
				"XL" : {"XL Right Cuff" : [133.221,135.898],"XL Right Sleeve" : [187.215,-278.742],"XL Left Cuff" : [430.182,137.49],"XL Left Sleeve" : [-29.375,-278.691],"XL Right Liner" : [342.081,228.158],"XL Left Liner" : [241.584,228.149],"XL Back" : [403.682,3.035],"XL Collar" : [240.175,115.299],"XL Front" : [51.388,3.711]},
				"2XL" : {"2XL Right Cuff" : [131.39,135.901],"2XL Right Sleeve" : [181.758,-275.135],"2XL Left Cuff" : [428.378,137.49],"2XL Left Sleeve" : [-34.834,-275.076],"2XL Right Liner" : [341.236,228.717],"2XL Left Liner" : [240.734,228.715],"2XL Back" : [398.282,5.761],"2XL Collar" : [239.227,115.303],"2XL Front" : [45.988,6.325]}
			}
		},
		"FD_3092Y" : 
		{
			"mockupSize" : "YXL",
			"sizes" : ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Sponsor Logo", "Additional Art"],
			"pieces" : ["Front", "Collar", "Back", "Left Liner", "Right Liner", "Left Sleeve", "Left Cuff", "Right Sleeve", "Right Cuff"],
			"placement" :
			{
				"YS" : {"YS Right Cuff" : [437.817,146.293],"YS Right Sleeve" : [11.085,-301.775],"YS Left Cuff" : [203.918,146.293],"YS Left Sleeve" : [200.491,-301.77],"YS Right Liner" : [363.037,214.934],"YS Left Liner" : [287.839,215.46],"YS Back" : [442.026,-34.942],"YS Collar" : [284.548,130.165],"YS Front" : [86.824,-36.994]},
				"YM" : {"YM Right Cuff" : [434.113,146.293],"YM Right Sleeve" : [7.922,-294.935],"YM Left Cuff" : [200.328,146.294],"YM Left Sleeve" : [197.326,-294.936],"YM Right Liner" : [362.211,215.467],"YM Left Liner" : [287.014,215.994],"YM Back" : [438.23,-33.142],"YM Collar" : [283.725,130.165],"YM Front" : [82.764,-33.864]},
				"YL" : {"YL Right Cuff" : [430.487,146.293],"YL Right Sleeve" : [4.473,-287.872],"YL Left Cuff" : [196.728,146.298],"YL Left Sleeve" : [193.877,-287.872],"YL Right Liner" : [361.392,216.01],"YL Left Liner" : [286.194,216.54],"YL Back" : [433.738,-30.896],"YL Collar" : [282.779,130.165],"YL Front" : [78.327,-30.923]},
				"YXL" : {"YXL Right Cuff" : [426.891,146.293],"YXL Right Sleeve" : [0.895,-280.334],"YXL Left Cuff" : [192.991,146.293],"YXL Left Sleeve" : [190.3,-280.334],"YXL Right Liner" : [360.56,216.582],"YXL Left Liner" : [285.363,217.108],"YXL Back" : [429.276,-29.033],"YXL Collar" : [281.829,130.165],"YXL Front" : [73.916,-28.363]}
			}
		},
		"FD_857" : 
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL"],
			"artLayers" : ["Left Leg", "Right Leg"],
			"pieces" : ["Right Leg Panel", "Left Leg Panel"],
			"placement" : 
			{
				"S" : {"S Left Leg Panel" : [501.226,282.011],"S Right Leg Panel" : [149.585,281.934]},
				"M" : {"M Left Leg Panel" : [497.168,289.084],"M Right Leg Panel" : [145.526,289.007]},
				"L" : {"L Left Leg Panel" : [493.174,292.789],"L Right Leg Panel" : [141.532,292.712]},
				"XL" : {"XL Left Leg Panel" : [489.051,299.864],"XL Right Leg Panel" : [137.409,299.786]},
				"2XL" : {"2XL Left Leg Panel" : [485.135,303.569],"2XL Right Leg Panel" : [133.494,303.492]},
				"3XL" : {"3XL Left Leg Panel" : [481.012,310.656],"3XL Right Leg Panel" : [129.37,310.578]}
			}
		},
		"FD_857Y" :
		{
			"mockupSize" : "YXL",
			"sizes" : ["YS", "YM", "YL", "YXL"],
			"artLayers" : ["Left Leg", "Right Legt"],
			"pieces" : ["Right Leg Panel", "Left Leg Panel"],
			"placement" :
			{
				"YS" : {"YS Left Leg Panel" : [515.48,257.109],"YS Right Leg Panel" : [169.489,256.852]},
				"YM" : {"YM Left Leg Panel" : [512.21,261.173],"YM Right Leg Panel" : [166.221,260.915]},
				"YL" : {"YL Left Leg Panel" : [509.126,264.672],"YL Right Leg Panel" : [163.135,264.414]},
				"YXL" : {"YXL Left Leg Panel" : [505.864,269.286],"YXL Right Leg Panel" : [159.875,269.029]}
			}
		},

		//////////////
		//Volleyball//
		//////////////
		"FD_VOL_CS" : 
		{
			"mockupSize" : "M",
			"sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			"pieces" : ["Front", "Back", "Right Sleeve", "Left Sleeve", "Collar"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Locker Tag", "Sponsor Logo", "Additional Art"],
			"placement" : 
			{
				"XXS" : {"XXS Collar" : [241.818,-231.076],"XXS Left Sleeve" : [260.936,-133.361],"XXS Right Sleeve" : [260.936,-54.59],"XXS Back" : [453.408,-27.698],"XXS Front" : [65.83,-33.974]},
				"XS" : {"XS Collar" : [241.818,-231.076],"XS Left Sleeve" : [260.936,-133.361],"XS Right Sleeve" : [260.936,-54.59],"XS Back" : [449.675,-28.016],"XS Front" : [62.088,-32.332]},
				"S" : {"S Collar" : [241.818,-231.076],"S Left Sleeve" : [260.936,-133.361],"S Right Sleeve" : [260.936,-54.59],"S Back" : [444.276,-28.44],"S Front" : [60.567,-31.242]},
				"M" : {"M Collar" : [240.018,-231.076],"M Left Sleeve" : [259.625,-132.43],"M Right Sleeve" : [259.625,-53.659],"M Back" : [440.682,-28.607],"M Front" : [56.692,-30.541]},
				"L" : {"L Collar" : [240.018,-231.076],"L Left Sleeve" : [259.992,-131.635],"L Right Sleeve" : [259.992,-52.864],"L Back" : [437.618,-28.637],"L Front" : [53.533,-29.786]},
				"XL" : {"XL Collar" : [236.418,-231.076],"XL Left Sleeve" : [258.985,-130.777],"XL Right Sleeve" : [258.985,-52.006],"XL Back" : [433.951,-26.895],"XL Front" : [49.978,-28.475]},
				"2XL" : {"2XL Collar" : [236.418,-231.076],"2XL Left Sleeve" : [257.757,-129.68],"2XL Right Sleeve" : [257.757,-50.909],"2XL Back" : [430.56,-26.904],"2XL Front" : [46.008,-27.608]}
			}
		},
		"FD_285" : 
		{
			"mockupSize" : "M",
			"sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			"pieces" : ["Front", "Back", "Right Sleeve", "Left Sleeve", "Collar"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Locker Tag", "Sponsor Logo", "Additional Art"],
			"placement" : 
			{
				"XXS" : {"XXS Collar" : [221.85,-940.969],"XXS Left Sleeve" : [236.574,-288.877],"XXS Right Sleeve" : [21.414,-288.877],"XXS Back" : [428.86,-12.579],"XXS Front" : [122.348,-83.676]},
				"XS" : {"XS Collar" : [221.85,-940.969],"XS Left Sleeve" : [236.574,-287.077],"XS Right Sleeve" : [21.414,-287.077],"XS Back" : [425.127,-10.979],"XS Front" : [118.606,-80.397]},
				"S" : {"S Collar" : [221.85,-940.969],"S Left Sleeve" : [235.019,-285.816],"S Right Sleeve" : [19.859,-285.816],"S Back" : [419.728,-9.68],"S Front" : [117.085,-77.389]},
				"M" : {"M Collar" : [220.051,-940.969],"M Left Sleeve" : [233.039,-284.479],"M Right Sleeve" : [17.879,-284.479],"M Back" : [416.134,-7.98],"M Front" : [113.209,-74.688]},
				"L" : {"L Collar" : [220.051,-940.969],"L Left Sleeve" : [230.107,-283.3],"L Right Sleeve" : [14.948,-283.3],"L Back" : [413.07,-6.23],"L Front" : [110.051,-72.14]},
				"XL" : {"XL Collar" : [216.451,-940.969],"XL Left Sleeve" : [226.796,-281.492],"XL Right Sleeve" : [11.637,-281.492],"XL Back" : [409.403,-2.678],"XL Front" : [106.496,-69.337]},
				"2XL" : {"2XL Collar" : [216.451,-940.969],"2XL Left Sleeve" : [223.601,-282.299],"2XL Right Sleeve" : [8.441,-282.299],"2XL Back" : [406.012,-0.878],"2XL Front" : [102.525,-66.704]}
			}
		},
		//////////////
		//Basketball//
		//////////////
		"FD_BASK_RV" : 
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Sponsor Logo", "Locker Tag", "Additional Artwork", "Left Leg", "Right Leg"],
			"pieces" : ["Front", "Back", "Right Leg Panel", "Left Leg Panel"],
			"placement" : 
			{	
				"S" : {"S Left Leg Panel" : [390.37,309.26],"S Right Leg Panel" : [24.604,309.256],"S Back" : [201.566,-2.199],"S Front" : [-11.055,-1.9]},
				"M" : {"M Left Leg Panel" : [386.1,316.305],"M Right Leg Panel" : [19.961,316.301],"M Back" : [194.733,1.628],"M Front" : [-17.888,0.866]},
				"L" : {"L Left Leg Panel" : [381.436,323.475],"L Right Leg Panel" : [15.265,323.471],"L Back" : [189.6,3.25],"L Front" : [-23.02,3.482]},
				"XL" : {"XL Left Leg Panel" : [376.176,330.948],"XL Right Leg Panel" : [10.331,330.944],"XL Back" : [183.776,4.986],"XL Front" : [-28.845,6.434]},
				"2XL" : {"2XL Left Leg Panel" : [372.477,337.956],"2XL Right Leg Panel" : [5.987,337.952],"2XL Back" : [177.69,8.61],"2XL Front" : [-34.931,9.017]},
				"3XL" : {"3XL Left Leg Panel" : [368.778,337.956],"3XL Right Leg Panel" : [1.759,337.952],"3XL Back" : [172.504,10.758],"3XL Front" : [-40.118,11.796]}
			}
		},
		"FD_BASKW_RV" : 
		{
			"mockupSize" : "M",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Sponsor Logo", "Locker Tag", "Additional Artwork", "Left Leg", "Right Leg"],
			"pieces" : ["Front", "Back", "Right Leg Panel", "Left Leg Panel"],
			"placement" :
			{
				"S" : {"S Left Leg Panel" : [392.719,283.345],"S Right Leg Panel" : [24.625,283.567],"S Back" : [204.176,-4.461],"S Front" : [-8.393,-2.581]},
				"M" : {"M Left Leg Panel" : [388.894,287.197],"M Right Leg Panel" : [21.458,287.404],"M Back" : [199.399,-2.079],"M Front" : [-13.143,0.266]},
				"L" : {"L Left Leg Panel" : [381.459,290.653],"L Right Leg Panel" : [16.731,290.891],"L Back" : [194.626,0.768],"L Front" : [-18.107,4.09]},
				"XL" : {"XL Left Leg Panel" : [379.171,294.107],"XL Right Leg Panel" : [12.7,294.36],"XL Back" : [189.708,3.521],"XL Front" : [-22.983,7.495]},
				"2XL" : {"2XL Left Leg Panel" : [374.777,297.745],"2XL Right Leg Panel" : [9.047,297.946],"2XL Back" : [184.538,6.289],"2XL Front" : [-28.15,11.319]},
				"3XL" : {"3XL Left Leg Panel" : [369.798,301.468],"3XL Right Leg Panel" : [4.892,301.679],"3XL Back" : [179.28,8.933],"3XL Front" : [-33.426,15.003]}
			}
		},
		"FD_BASKY_RV" :
		{
			"mockupSize" : "YXL",
			"sizes" : ["YS", "YM", "YL", "YXL"],
			"artLayers": ["Front Logo", "Front Number", "Player Name", "Back Number", "Sponsor Logo", "Locker Tag", "Additional Artwork", "Left Leg", "Right Leg"],
			"pieces" : ["Front", "Back", "Right Leg Panel", "Left Leg Panel"],
			"placement" : 
			{
				"YS" : {"YS Left Leg Panel" : [404.812,272.171],"YS Right Leg Panel" : [35.935,272.137],"YS Back" : [213.272,-10.98],"YS Front" : [0.647,-12.473]},
				"YM" : {"YM Left Leg Panel" : [400.928,279.222],"YM Right Leg Panel" : [31.067,279.141],"YM Back" : [209.57,-9.347],"YM Front" : [-3.055,-9.72]},
				"YL" : {"YL Left Leg Panel" : [396.971,286.538],"YL Right Leg Panel" : [26.833,286.425],"YL Back" : [206.212,-7.048],"YL Front" : [-6.412,-7.218]},
				"YXL" : {"YXL Left Leg Panel" : [392.214,293.755],"YXL Right Leg Panel" : [22.859,293.666],"YXL Back" : [202.486,-5.302],"YXL Front" : [-10.139,-4.441]}
			}
		},

		"FD_210_211" :
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Sponsor Logo", "Locker Tag", "Additional Artwork", "Left Leg", "Right Leg"],
			"pieces" : ["Collar", "Front", "Back", "Right Leg Panel", "Left Leg Panel"],
			"placement" :
			{
				"S" : {"S Left Leg Panel" : [390.934,318.79],"S Right Leg Panel" : [24.588,319.072],"S Back" : [203.387,-2.132],"S Front" : [-10.156,-3.744],"S Collar" : [409.698,-490.926]},
				"M" : {"M Left Leg Panel" : [386.375,325.871],"M Right Leg Panel" : [20.028,326.153],"M Back" : [198.988,1.73],"M Front" : [-14.555,-1.181],"M Collar" : [407.142,-490.926]},
				"L" : {"L Left Leg Panel" : [381.839,332.953],"L Right Leg Panel" : [15.493,333.235],"L Back" : [194.735,3.28],"L Front" : [-18.807,1.535],"L Collar" : [405.821,-490.926]},
				"XL" : {"XL Left Leg Panel" : [377.325,340.301],"XL Right Leg Panel" : [10.978,340.583],"XL Back" : [190.344,4.815],"XL Front" : [-23.199,3.946],"XL Collar" : [404.41,-490.926]},
				"2XL" : {"2XL Left Leg Panel" : [372.803,347.383],"2XL Right Leg Panel" : [6.456,347.664],"2XL Back" : [185.876,8.708],"2XL Front" : [-27.667,7.019],"2XL Collar" : [401.868,-490.926]},
				"3XL" : {"3XL Left Leg Panel" : [368.815,347.409],"3XL Right Leg Panel" : [2.47,347.691],"3XL Back" : [180.703,10.415],"3XL Front" : [-32.839,9.43],"3XL Collar" : [400.072,-490.926]}
			}
		},
		"FD_210W_211W" : 
		{
			"mockupSize" : "M",
			"sizes" : ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Sponsor Logo", "Locker Tag", "Additional Artwork", "Left Leg", "Right Leg"],
			"pieces" : ["Front", "Back", "Collar", "Right Leg Panel", "Left Leg Panel"],
			"placement" :
			{
				"XS" : {"XS Left Leg Panel" : [396.679,286.692],"XS Right Leg Panel" : [27.556,289.009],"XS Collar" : [238.826,-946.952],"XS Back" : [207.047,124.159],"XS Front" : [-6.389,-20.951]},
				"S" : {"S Left Leg Panel" : [393.191,294.113],"S Right Leg Panel" : [24.068,296.43],"S Collar" : [235.698,-946.952],"S Back" : [202.489,122.778],"S Front" : [-10.87,-17.222]},
				"M" : {"M Left Leg Panel" : [389.514,297.808],"M Right Leg Panel" : [20.391,300.124],"M Collar" : [232.552,-946.952],"M Back" : [197.711,121.903],"M Front" : [-15.621,-13.691]},
				"L" : {"L Left Leg Panel" : [384.715,301.487],"L Right Leg Panel" : [15.593,303.804],"L Collar" : [229.005,-946.952],"L Back" : [192.938,120.787],"L Front" : [-20.584,-10.028]},
				"XL" : {"XL Left Leg Panel" : [380.282,304.845],"XL Right Leg Panel" : [11.159,307.162],"XL Collar" : [225.787,-946.952],"XL Back" : [188.021,120.116],"XL Front" : [-25.459,-6.631]},
				"2XL" : {"2XL Left Leg Panel" : [376.01,308.55],"2XL Right Leg Panel" : [6.887,310.867],"2XL Collar" : [222.482,-946.952],"2XL Back" : [182.85,119.497],"2XL Front" : [-30.627,-2.701]},
				"3XL" : {"3XL Left Leg Panel" : [371.745,312.177],"3XL Right Leg Panel" : [2.622,314.494],"3XL Collar" : [219.116,-946.952],"3XL Back" : [177.592,118.73],"3XL Front" : [-35.903,0.829]}
			}
		},
		"FD_210Y_211Y" :
		{
			"mockupSize" : "YXL",
			"sizes" : ["YS", "YM", "YL", "YXL"],
			"artLayers": ["Front Logo", "Front Number", "Player Name", "Back Number", "Sponsor Logo", "Locker Tag", "Additional Artwork", "Left Leg", "Right Leg"],
			"pieces" : ["Collar", "Front", "Back", "Right Leg Panel", "Left Leg Panel"],
			"placement" : 
			{
				"YS" : {"YS Left Leg Panel" : [401.123,284.56],"YS Right Leg Panel" : [37.065,283.813],"YS Back" : [219.377,-23.568],"YS Front" : [2.736,-28.349],"YS Collar" : [245.165,-936.3]},
				"YM" : {"YM Left Leg Panel" : [396.722,291.933],"YM Right Leg Panel" : [32.665,291.186],"YM Back" : [216.073,-20.939],"YM Front" : [-0.568,-25.652],"YM Collar" : [242.915,-936.3]},
				"YL" : {"YL Left Leg Panel" : [392.496,299.023],"YL Right Leg Panel" : [28.439,298.276],"YL Back" : [212.611,-19.679],"YL Front" : [-4.062,-23.098],"YL Collar" : [241.565,-936.298]},
				"YXL" : {"YXL Left Leg Panel" : [388.256,306.384],"YXL Right Leg Panel" : [24.199,305.637],"YXL Back" : [209.271,-17.964],"YXL Front" : [-7.409,-20.346],"YXL Collar" : [239.315,-936.293]}
			}
		},
		"FD_137" :
		{
			"mockupSize" : "XL",
			"sizes" : ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Left Sleeve", "Right Sleeve","Sponsor Logo", "Locker Tag", "Additional Artwork"],
			"pieces" : ["Collar", "Front", "Back", "Right Sleeve", "Left Sleeve"],
			"placement" :
			{
				"XS" : {"XS Left Sleeve" : [453.918,151.927],"XS Right Sleeve" : [206.697,151.927],"XS Back" : [489.282,-114.528],"XS Front" : [122.505,-121.913],"XS Collar" : [332.41,208.46]},
				"S" : {"S Left Sleeve" : [451.151,159.137],"S Right Sleeve" : [203.93,159.137],"S Back" : [484.039,-112.728],"S Front" : [117.261,-119.576],"S Collar" : [330.394,208.46]},
				"M" : {"M Left Sleeve" : [448.908,166.112],"M Right Sleeve" : [201.687,166.112],"M Back" : [478.511,-110.928],"M Front" : [111.734,-117.116],"M Collar" : [328.378,208.46]},
				"L" : {"L Left Sleeve" : [446.765,172.342],"L Right Sleeve" : [199.544,172.342],"L Back" : [473.124,-109.128],"L Front" : [106.348,-114.738],"L Collar" : [326.362,208.46]},
				"XL" : {"XL Left Sleeve" : [444.696,179.289],"XL Right Sleeve" : [197.475,179.289],"XL Back" : [467.739,-107.531],"XL Front" : [100.962,-113.062],"XL Collar" : [324.346,208.46]},
				"2XL" : {"2XL Left Sleeve" : [442.439,185.963],"2XL Right Sleeve" : [195.218,185.963],"2XL Back" : [462.353,-105.762],"2XL Front" : [95.576,-110.849],"2XL Collar" : [322.33,208.46]},
				"3XL" : {"3XL Left Sleeve" : [440.157,193.08],"3XL Right Sleeve" : [192.936,193.08],"3XL Back" : [456.967,-103.946],"3XL Front" : [90.19,-108.347],"3XL Collar" : [320.314,208.46]},
				"4XL" : {"4XL Left Sleeve" : [437.894,200.56],"4XL Right Sleeve" : [190.689,200.547],"4XL Back" : [451.581,-102.115],"4XL Front" : [84.804,-106.506],"4XL Collar" : [318.298,208.46]},
				"5XL" : {"5XL Left Sleeve" : [435.374,206.918],"5XL Right Sleeve" : [188.153,206.918],"5XL Back" : [446.054,-100.315],"5XL Front" : [79.277,-103.839],"5XL Collar" : [316.282,208.46]}
			}
		},

		///////////
		//Hoodies//
		///////////
		"FDWH" : 
		{
			"mockupSize" : "M",
			"sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Left Sleeve", "Right Sleeve", "Locker Tag", "Sponsor Logo", "Right Hood", "Left Hood", "Front Pocket", "Additional Art"],
			"pieces" : ["Front", "Back", "Pocket", "Left Sleeve", "Left Cuff", "Waistband", "Right Sleeve", "Right Cuff", "Right Outside Hood", "Left Inside Hood", "Left Outside Hood", "Right Inside Hood"],
			"placement" : 
			{
				"XXS" : {"XXS Right Inside Hood" : [592.836,-160.773],"XXS Left Outside Hood" : [592.767,-7.129],"XXS Left Inside Hood" : [493.92,-160.825],"XXS Right Outside Hood" : [493.909,-7.18],"XXS Right Cuff" : [54.626,-533.85],"XXS Right Sleeve" : [27.587,-336.184],"XXS Waistband" : [315.539,-642.713],"XXS Left Cuff" : [277.68,-534.711],"XXS Left Sleeve" : [250.158,-335.121],"XXS Pocket" : [24.683,-637.968],"XXS Back" : [250.431,-32.485],"XXS Front" : [-0.151,-33.006]},
				"XS" : {"XS Right Inside Hood" : [592.836,-160.503],"XS Left Outside Hood" : [592.767,-6.859],"XS Left Inside Hood" : [490.817,-160.555],"XS Right Outside Hood" : [490.806,-6.91],"XS Right Cuff" : [53.888,-534.238],"XS Right Sleeve" : [22.907,-333.586],"XS Waistband" : [308.339,-642.749],"XS Left Cuff" : [276.779,-534.794],"XS Left Sleeve" : [245.705,-333.684],"XS Pocket" : [22.122,-636.918],"XS Back" : [246.821,-29.779],"XS Front" : [-3.746,-29.457]},
				"S" : {"S Right Inside Hood" : [592.836,-160.168],"S Left Outside Hood" : [592.767,-6.531],"S Left Inside Hood" : [487.699,-160.22],"S Right Outside Hood" : [487.689,-6.586],"S Right Cuff" : [52.989,-534.604],"S Right Sleeve" : [18.328,-330.559],"S Waistband" : [301.139,-643.134],"S Left Cuff" : [275.879,-534.797],"S Left Sleeve" : [241.132,-330.664],"S Pocket" : [20.509,-635.1],"S Back" : [243.219,-26.213],"S Front" : [-7.354,-25.908]},
				"M" : {"M Right Inside Hood" : [592.836,-159.939],"M Left Outside Hood" : [592.767,-6.295],"M Left Inside Hood" : [485.476,-159.99],"M Right Outside Hood" : [485.465,-6.346],"M Right Cuff" : [52.09,-534.336],"M Right Sleeve" : [13.372,-327.53],"M Waistband" : [293.939,-643.047],"M Left Cuff" : [274.979,-534.857],"M Left Sleeve" : [236.178,-327.653],"M Pocket" : [18.88,-633.281],"M Back" : [239.616,-22.726],"M Front" : [-10.962,-22.305]},
				"L" : {"L Right Inside Hood" : [592.836,-159.601],"L Left Outside Hood" : [592.767,-5.957],"L Left Inside Hood" : [482.285,-159.645],"L Right Outside Hood" : [482.274,-6.008],"L Right Cuff" : [51.19,-534.63],"L Right Sleeve" : [8.797,-324.498],"L Waistband" : [286.739,-642.941],"L Left Cuff" : [274.065,-534.821],"L Left Sleeve" : [231.602,-324.598],"L Pocket" : [17.241,-631.465],"L Back" : [236.015,-19.176],"L Front" : [-14.574,-18.921]},
				"XL" : {"XL Right Inside Hood" : [592.836,-158.406],"XL Left Outside Hood" : [592.767,-4.762],"XL Left Inside Hood" : [479.723,-158.458],"XL Right Outside Hood" : [479.719,-4.814],"XL Right Cuff" : [50.29,-534.577],"XL Right Sleeve" : [3.3,-321.452],"XL Waistband" : [275.939,-643.169],"XL Left Cuff" : [273.179,-534.794],"XL Left Sleeve" : [226.098,-321.56],"XL Pocket" : [15.581,-629.66],"XL Back" : [230.607,-15.485],"XL Front" : [-19.989,-15.372]},
				"2XL" : {"2XL Right Inside Hood" : [592.836,-158.139],"2XL Left Outside Hood" : [592.767,-4.496],"2XL Left Inside Hood" : [478.694,-158.183],"2XL Right Outside Hood" : [478.688,-4.537],"2XL Right Cuff" : [49.286,-534.295],"2XL Right Sleeve" : [1.466,-319.636],"2XL Waistband" : [265.139,-642.966],"2XL Left Cuff" : [272.28,-534.754],"2XL Left Sleeve" : [224.27,-319.755],"2XL Pocket" : [13.925,-627.831],"2XL Back" : [225.205,-14.044],"2XL Front" : [-25.396,-13.393]},
				"3XL" : {"3XL Right Inside Hood" : [592.836,-157.864],"3XL Left Outside Hood" : [592.767,-4.22],"3XL Left Inside Hood" : [477.663,-157.916],"3XL Right Outside Hood" : [477.652,-4.271],"3XL Right Cuff" : [48.49,-534.595],"3XL Right Sleeve" : [-0.575,-317.151],"3XL Waistband" : [254.339,-643.028],"3XL Left Cuff" : [271.38,-534.63],"3XL Left Sleeve" : [222.227,-317.255],"3XL Pocket" : [16.572,-626.868],"3XL Back" : [219.781,-12.588],"3XL Front" : [-30.8,-11.718]}
			}

		},

		////////////////
		//Quarter Zips//
		////////////////
		"FD_7025" :
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Left Sleeve", "Right Sleeve","Sponsor Logo", "Locker Tag", "Collar Art", "Additional Artwork"],
			"pieces" : ["Right Side Panel", "Front", "Left Side Panel", "Back", "Left Sleeve", "Right Sleeve", "Inside Collar", "Outside Collar", "Garage", "Left Zipper Facing", "Right Zipper Facing"],
			"placement" :
			{
				"S" : {"S Right Zipper Facing" : [403.964,174.03],"S Left Zipper Facing" : [337.703,174.128],"S Garage" : [371.526,111.385],"S Outside Collar" : [481.861,-708.749],"S Inside Collar" : [304.42,67.688],"S Right Sleeve" : [272.218,-425.43],"S Left Sleeve" : [53.44,-425.37],"S Back" : [476.307,-94.509],"S Left Side Panel" : [493.599,183.517],"S Front" : [156.752,-98.97],"S Right Side Panel" : [225.039,183.519]},
				"M" : {"M Right Zipper Facing" : [403.806,174.086],"M Left Zipper Facing" : [337.703,174.18],"M Garage" : [371.526,111.376],"M Outside Collar" : [480.06,-708.652],"M Inside Collar" : [302.619,67.782],"M Right Sleeve" : [266.898,-419.661],"M Left Sleeve" : [48.124,-419.6],"M Back" : [470.909,-94.509],"M Left Side Panel" : [492.688,185.857],"M Front" : [152.964,-98.504],"M Right Side Panel" : [224.128,185.857]},
				"L" : {"L Right Zipper Facing" : [403.964,174.063],"L Left Zipper Facing" : [337.703,174.158],"L Garage" : [371.526,111.415],"L Outside Collar" : [478.261,-708.559],"L Inside Collar" : [300.819,67.88],"L Right Sleeve" : [261.585,-413.746],"L Left Sleeve" : [42.811,-413.686],"L Back" : [465.514,-94.509],"L Left Side Panel" : [491.774,188.181],"L Front" : [149.19,-97.987],"L Right Side Panel" : [223.216,188.181]},
				"XL" : {"XL Right Zipper Facing" : [403.44,174.068],"XL Left Zipper Facing" : [337.703,174.162],"XL Garage" : [371.474,111.322],"XL Outside Collar" : [476.459,-708.465],"XL Inside Collar" : [299.018,67.973],"XL Right Sleeve" : [256.122,-407.825],"XL Left Sleeve" : [37.343,-407.756],"XL Back" : [460.115,-94.509],"XL Left Side Panel" : [490.865,190.505],"XL Front" : [145.409,-97.522],"XL Right Side Panel" : [222.304,190.505]},
				"2XL" : {"2XL Right Zipper Facing" : [402.852,174.072],"2XL Left Zipper Facing" : [337.382,174.167],"2XL Garage" : [371.526,111.266],"2XL Outside Collar" : [474.656,-708.371],"2XL Inside Collar" : [297.219,68.067],"2XL Right Sleeve" : [250.641,-405.367],"2XL Left Sleeve" : [31.871,-405.306],"2XL Back" : [454.72,-94.509],"2XL Left Side Panel" : [489.957,192.836],"2XL Front" : [141.643,-97.108],"2XL Right Side Panel" : [221.393,192.837]},
				"3XL" : {"3XL Right Zipper Facing" : [403.244,174.051],"3XL Left Zipper Facing" : [336.983,174.146],"3XL Garage" : [371.526,111.388],"3XL Outside Collar" : [472.86,-708.277],"3XL Inside Collar" : [295.422,68.16],"3XL Right Sleeve" : [245.161,-402.848],"3XL Left Sleeve" : [26.39,-402.776],"3XL Back" : [449.323,-94.509],"3XL Left Side Panel" : [489.048,193.365],"3XL Front" : [137.871,-96.953],"3XL Right Side Panel" : [220.488,193.369]},
				"4XL" : {"4XL Right Zipper Facing" : [402.942,174.098],"4XL Left Zipper Facing" : [337.158,174.193],"4XL Garage" : [371.51,111.312],"4XL Outside Collar" : [471.056,-708.18],"4XL Inside Collar" : [293.623,68.253],"4XL Right Sleeve" : [239.682,-400.283],"4XL Left Sleeve" : [20.902,-400.228],"4XL Back" : [443.926,-94.509],"4XL Left Side Panel" : [488.14,193.899],"4XL Front" : [134.1,-96.746],"4XL Right Side Panel" : [219.58,193.904]},
				"5XL" : {"5XL Right Zipper Facing" : [403.964,174.042],"5XL Left Zipper Facing" : [337.703,174.137],"5XL Garage" : [371.526,111.287],"5XL Outside Collar" : [469.26,-708.086],"5XL Inside Collar" : [291.822,68.346],"5XL Right Sleeve" : [234.196,-397.682],"5XL Left Sleeve" : [15.421,-397.621],"5XL Back" : [438.525,-94.509],"5XL Left Side Panel" : [487.233,194.439],"5XL Front" : [130.335,-96.695],"5XL Right Side Panel" : [218.671,194.436]}
			}
		},

		/////////////////////
		//Short Sleeve Polo//
		/////////////////////
		"FD_597" :
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Left Sleeve", "Right Sleeve","Sponsor Logo", "Locker Tag", "Collar Art", "Additional Artwork"],
			"pieces" : ["Front", "Back", "Moon", "Placket", "Left Sleeve", "Inside Collar", "Binding", "Right Sleeve", "Outside Collar",],
			"placement" :
			{
				
			}
		}
	}






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
	var code = garmentLayer.name.substring(0,garmentLayer.name.indexOf("_0"));
	var thisGarment = library[code];
	var prepress = garmentLayer.layers["Prepress"];
	var mockupLayer = garmentLayer.layers["Mockup"];
	var sourceLayer = layers["To Be Placed"];
	var infoLayer = garmentLayer.layers["Information"];
	var artLayer = garmentLayer.layers["Artwork Layer"];
	var style;




	var sorted = rowSort(sourceLayer.groupItems);

	if(valid)
		nameThePieces(sorted);

	if(valid)
		moveThePieces(prepress.layers);
	
	if(valid)
		createArtLayers();

	if(valid)
	{
		cleanUp();
		prepress.visible = false;
		infoLayer.locked = true;
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