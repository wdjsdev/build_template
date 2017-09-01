function mockupLabels(code)
{
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var mockLay = layers[0].layers['Mockup'];

	var names = ["Back", "Front"];
	
	for(var a=0;a<names.length;a++)
	{
		mockLay.pageItems[a].name = "Mockup " + names[a];
	}

	mockLay.pageItems[names.length].name = "Edges";
	mockLay.pageItems[names.length].zOrder(ZOrderMethod.BRINGTOFRONT);

}
// mockupLabels();