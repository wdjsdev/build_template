function selectItemsFromList(list,selectItems)
{
	for(var x=0,len=list.items.length;x<len;x++)
	{
		for(var y=0,rmLen=selectItems.length;y<rmLen;y++)
		{
			if(list.items[x].text === selectItems[y])
			{
				list.items[x].selected = true;
			}
		}
	}
}