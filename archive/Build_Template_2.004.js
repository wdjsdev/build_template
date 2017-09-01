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
			var buffer = 150;

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

				//push the left to right sorted row to rows array
				rows.push(tempSorted);
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
			
			var styleNum = prompt("Enter 3 digit style number", "015");
			infoLayer.textFrames["Garment Code"].contents = code + "_" + styleNum;
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
	var sourceLayer = layers["To Be Placed"];
	var infoLayer = garmentLayer.layers["Information"];
	var artLayer = garmentLayer.layers["Artwork Layer"];

	//

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
	}

	#include "/Users/will.dowling/Desktop/In Progress/zzzzz~OLD/Automation/Javascript/_New CAD Workflow/Build_Template/mockLabels.js";
    if(valid)
	    mockupLabels();







	////////End/////////
	///Function Calls///
	////////////////////


}
container();