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