function deleteExistingChildren(group)
{
	for(var dec = group.children.length-1;dec >-1; dec--)
	{
		group.remove(group.children[dec]);
	}
}