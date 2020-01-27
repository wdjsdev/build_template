function initialRename()
{
	var valid = true;
	var scriptName = "initial_rename";

	//Production Utilities
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	
	// //Dev Utilities
	// eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Utilities_Container.js\"");
	// eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Batch_Framework.js\"");



	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var srcLay,orientation;

	//logic container
	function readConfig()
	{
		var configFile = new File("~/Documents/build_template_config/btconfig.js");

		if(!configFile.exists)
		{
			alert("No Configuration file was found. Please run the configuration script first.");
			return false;
		}

		eval("#include \"" + configFile.fsName + "\"");

		return config;
	}

	function getSrcLay()
	{
		try
		{
			return layers["To Be Placed"];

		}
		catch(e)
		{
			alert("Sorry. You're missing the \"To Be Placed\" layer.\nYou need to copy the CAD to a layer called \"To Be Placed\"");
			return false;
		}	
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


		if(config.orientation == "vertical")
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
		else
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
		try
		{
			var garLay = layers[1];
			garLay.locked = false;
			garLay.visible = true;
			var prepress = garLay.layers["Prepress"];
			prepress.locked = false;
			prepress.visible = true;

			//delete any layers that exist on the prepress layer
			//to avoid having duplicated size layers if the blank
			//template file had empty size layers in the prepress layer
			for(var dppl = prepress.layers.length - 1; dppl>=0; dppl--)
			{
				prepress.layers[dppl].remove();
			}
			
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
						// if(pieceCounter < 7)
						// {
						// 	pieceCounter++;
						// }
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
		}
		catch(e)
		{
			alert("failed while naming the pieces\nSystem Error message = " + e);
			valid = false;
			return;
		}
	}

	//begin function calls
	if(valid)
	{
		var config = readConfig();
		if(!config)
		{
			valid = false;
		}
	}
	
	if(valid)
	{
		var srcLay = getSrcLay();
		if(!srcLay)
		{
			valid = false;
		}
	}

	if(valid)
	{
		var sorted = sortPieces(srcLay.groupItems);
		nameThePieces(sorted);
	}

	
	
}
initialRename();