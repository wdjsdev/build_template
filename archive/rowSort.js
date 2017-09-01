/*

rowSort rebuild

sort all objects of an array into rows
sort items in rows from left to right
then sort rows top to bottom


*/

function rowSort(theArray)
{
	var finalSorted = [];
	var rows = [];
	var buffer = 150;

	var theArrayCopy = theArray;

	//populate temp arraywith groups of the same row
	while(theArrayCopy.length > 0)
	{
		var temp = [];
		var tempSorted = [];
		var rowMarker = theArrayCopy[0].top - theArrayCopy.height/2;
		temp.push(theArrayCopy[0]);
		theArrayCopy.splice(0,1);
		for(var a=theArrayCopy.length-1;a>-1;a--)
		{
			var thisGroup = theArrayCopy[a];
			var vPos = thisGroup.top - thisGroup.height/2
			if(vPos + buffer > rowMarker && vPos - buffer < rowMarker)
			{
				temp.push(theArrayCopy[a]);
				theArrayCopy.splice(a,1);
			}
		}

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
		var vMarker = topMost.groupItems[0].top;
		var deleteIndex = 0;

		for(var a=1;a<rows.length;a++)
		{
			if(rows[a].groupItems[0].top > vMarker)
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