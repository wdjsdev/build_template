function addItemsToList(list,items)
{
	for(var x=0,len=items.length;x<len;x++)
	{
		list.add("item",items[x]);
	}
}