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