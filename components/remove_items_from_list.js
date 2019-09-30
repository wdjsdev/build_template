function removeItemsFromList(list,rmItems)
{
	var curListItem,curRmItem;
	for(var x = list.items.length - 1; x>=0; x--)
	{
		curListItem = list.items[x];
		for(var y=0,len=rmItems.length;y<len;y++)
		{
			curRmItem = rmItems[y];
			if(curListItem.text === curRmItem)
			{
				list.remove(curListItem);
				break;
			}
		}
		
	}
	
}