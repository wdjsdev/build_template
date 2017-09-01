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


*/

function container()
{
	///////Begin/////////
	///Logic Container///
	/////////////////////


	function rowSort(theArray)
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
		return finalSorted;
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
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Right Cowl", "Left Cowl", "Additional Art"],
			"pieces" : ["Front", "Left Cuff", "Right Cuff", "Back", "Collar", "Left Side Panel", "Right Side Panel", "Left Sleeve", "Outside Cowl", "Right Sleeve", "Inside Cowl"],
			"placement" : 
			{
				"S" : {"S Inside Cowl" : [225.809,199.65],"S Right Sleeve" : [274.823,-124.919],"S Outside Cowl" : [37.614,-317.605],"S Left Sleeve" : [274.811,-209.032],"S Right Side Panel" : [476.893,292.279],"S Left Side Panel" : [136.916,292.279],"S Collar" : [223.589,237.73],"S Back" : [430.864,-51.791],"S Right Cuff" : [260.789,274.13],"S Left Cuff" : [261.085,319.97],"S Front" : [44.465,-52.051],},
				"M" : {"M Inside Cowl" : [222.209,199.617],"M Right Sleeve" : [274.823,-124.919],"M Outside Cowl" : [34.014,-317.605],"M Left Sleeve" : [274.811,-209.032],"M Right Side Panel" : [476.892,296.017],"M Left Side Panel" : [136.916,296.017],"M Collar" : [223.761,237.73],"M Back" : [426.886,-51.791],"M Right Cuff" : [261.078,274.13],"M Left Cuff" : [261.023,319.97],"M Front" : [40.483,-52.051],},
				"L" : {"L Inside Cowl" : [218.609,199.617],"L Right Sleeve" : [274.823,-124.919],"L Outside Cowl" : [30.414,-317.605],"L Left Sleeve" : [274.811,-209.032],"L Right Side Panel" : [476.892,299.535],"L Left Side Panel" : [136.916,299.535],"L Collar" : [223.723,237.73],"L Back" : [422.074,-51.791],"L Right Cuff" : [260.628,274.13],"L Left Cuff" : [260.79,319.97],"L Front" : [35.674,-52.051],},
				"XL" : {"XL Inside Cowl" : [215.009,199.617],"XL Right Sleeve" : [274.823,-124.919],"XL Outside Cowl" : [26.814,-317.605],"XL Left Sleeve" : [274.811,-209.032],"XL Right Side Panel" : [476.893,303.216],"XL Left Side Panel" : [136.916,303.216],"XL Collar" : [223.799,237.729],"XL Back" : [416.513,-51.791],"XL Right Cuff" : [260.762,274.13],"XL Left Cuff" : [261.029,319.971],"XL Front" : [30.113,-52.051],},
				"2XL" : {"2XL Inside Cowl" : [211.409,199.579],"2XL Right Sleeve" : [274.823,-124.919],"2XL Outside Cowl" : [23.214,-317.605],"2XL Left Sleeve" : [274.811,-209.032],"2XL Right Side Panel" : [476.892,306.839],"2XL Left Side Panel" : [136.916,306.839],"2XL Collar" : [223.607,237.729],"2XL Back" : [410.616,-51.791],"2XL Right Cuff" : [261.233,274.13],"2XL Left Cuff" : [261.233,319.97],"2XL Front" : [24.221,-52.051],},
				"3XL" : {"3XL Inside Cowl" : [207.809,199.701],"3XL Right Sleeve" : [274.824,-124.919],"3XL Outside Cowl" : [19.615,-317.236],"3XL Left Sleeve" : [274.811,-209.032],"3XL Right Side Panel" : [476.892,310.24],"3XL Left Side Panel" : [136.916,310.24],"3XL Collar" : [223.662,237.73],"3XL Back" : [407.425,-51.791],"3XL Right Cuff" : [260.437,274.13],"3XL Left Cuff" : [260.467,319.97],"3XL Front" : [21.027,-52.051],},
				"4XL" : {"4XL Inside Cowl" : [204.209,199.579],"4XL Right Sleeve" : [274.823,-124.919],"4XL Outside Cowl" : [16.014,-317.605],"4XL Left Sleeve" : [274.811,-209.032],"4XL Right Side Panel" : [476.892,316.471],"4XL Left Side Panel" : [136.916,316.471],"4XL Collar" : [223.567,237.73],"4XL Back" : [402.915,-51.791],"4XL Right Cuff" : [260.785,274.13],"4XL Left Cuff" : [260.71,319.971],"4XL Front" : [16.516,-52.051],},
				"5XL" : {"5XL Inside Cowl" : [200.609,199.579],"5XL Right Sleeve" : [274.825,-124.919],"5XL Outside Cowl" : [12.414,-317.604],"5XL Left Sleeve" : [274.818,-209.028],"5XL Right Side Panel" : [476.892,318.793],"5XL Left Side Panel" : [136.916,318.793],"5XL Collar" : [223.365,237.729],"5XL Back" : [398.569,-51.791],"5XL Right Cuff" : [260.614,274.13],"5XL Left Cuff" : [260.94,319.97],"5XL Front" : [12.17,-52.051],},

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
	var layers = docRef.layers;
	var garmentLayer = layers[1]
	var code = garmentLayer.name.substring(0,garmentLayer.name.indexOf("_0"));
	var prepress = garmentLayer.layers["Prepress"];
	var sourceLayer = layers["To Be Placed"];
	var infoLayer = garmentLayer.layers["Information"];
	var artLayer = garmentLayer.layers["Artwork Layer"];

	//

	var sorted = rowSort(sourceLayer.groupItems);

	garmentLayer.locked = false;

	//test name pieces
	for(var a=0;a<sorted.length;a++)
	{
		var thisArray = sorted[a];
		var theSize = library[code].sizes[a]
		var newSizeLayer = prepress.layers.add();
		newSizeLayer.name = theSize;
		newSizeLayer.zOrder(ZOrderMethod.SENDTOBACK);
		for(var b=0;b<thisArray.length;b++)
		{
			// if(theSize == "2XL")
			// {
			// 	alert('hello');
			// }
			var thisPieceName = library[code].pieces[b]
			if(thisPieceName == null)
				alert("Error in size " + theSize);
			var thisPiece = thisArray[b];
			thisPiece.name = theSize + " " + thisPieceName;
			thisPiece.moveToBeginning(newSizeLayer);
		}
	}

	//test place pieces on artboard




	////////End/////////
	///Function Calls///
	////////////////////


}
container();