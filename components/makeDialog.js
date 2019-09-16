/* beautify ignore:start */
function makeDialog()
{
	var dialogSuccess = true;

	var w = new Window("dialog", "Config Setup:");
		var topTxt = w.add("statictext", undefined, "Please input the necessary information for the garment.");

		//group for garment code entry:
		// var gcGroup = w.add("group");
		var gcGroup = w.add("panel");
			var gcTxt = UI.static(gcGroup,"Enter The Garment Code: ");
			var gcInput = UI.edit(gcGroup,"eg.FD-161Y");
				gcInput.active = true;
				gcInput.characters = 12;

		//group for orientation of CAD:
		var oriGroup = w.add("panel");
			var oriTxt = UI.static(oriGroup,"Select the orientation of the CAD layout.");
			
			//group for radio buttons
			var oriRadioGroup = oriGroup.add("group");
				var oriVert = oriRadioGroup.add("radiobutton", undefined, "Vertical");
					oriVert.value = true;
					oriVert.onClick = function()
					{
						cadOrientation = "vertical";
					}
					
				var oriHorz = oriRadioGroup.add("radiobutton", undefined, "Horizontal");
					oriHorz.onClick = function()
					{
						cadOrientation = "horizontal";
					}

			var help = UI.button(oriGroup,"Help",function()
			{
				var h = new Window("dialog","Orientation Help");
					var msg = UI.static(h,"Orientation Help");
					var imgGroup = UI.group(h);
						imgGroup.orientation = "row";
						var vertImageGroup = UI.group(imgGroup);
							vertImageGroup.orientation = "column";
							var vertMsg = UI.static(vertImageGroup, "Vertical Orientation");
							var vertImg = UI.image(vertImageGroup, resourcePath + "/Images/vertical_orientation.jpg");
						var horzImageGroup = UI.group(imgGroup);
							horzImageGroup.orientation = "column";
							var horzMsg = UI.static(horzImageGroup, "Horizontal Orientation");
							var horzImg = UI.image(horzImageGroup, resourcePath + "/Images/horizontal_orientation.jpg");
					var btnGroup = UI.group(h);
						var thanks = UI.button(btnGroup,"Thanks",function()
						{
							h.close();
						});
				h.show();
			})

		//group for selection of sizing structure
		var selectSizeStructureGroup = w.add("panel");
			selectSizeStructureGroup.orientation = "column";
			var sssgTxt = selectSizeStructureGroup.add("statictext", undefined, "Select the appropriate sizing format.");

			var selectSizeStructureRadioGroup = UI.group(selectSizeStructureGroup);
				selectSizeStructureRadioGroup.orientation = "row";
				var sizeStructureRadioButtons = makeAssets(selectSizeStructureRadioGroup, sizingStructures,"radiobutton",function()
				{
					if(this.text === "Varying Inseams")
					{
						varyingInseamSizing = true;
						waistSizeGroup.input.enabled = true;
					}
					else
					{
						varyingInseamSizing = false;
						waistSizeGroup.input.enabled = false;
					}
				});
				sizeStructureRadioButtons[0].value = true;

		var pieceNameGroup = createInputPanel(w,"piece_names");
		var sizeGroup = createInputPanel(w,"sizes");
		var waistSizeGroup = createInputPanel(w,"waist_sizes");
		var artLocGroup = createInputPanel(w,"locations");

		//set the waist size input to disabled until
		//the user selects variable inseam 
		waistSizeGroup.input.enabled = false;
		

		//group for buttons
		var btnGroup = w.add("group");
			var submit = btnGroup.add("button", undefined, "Submit");
				submit.onClick = function()
				{
					if(validate(gcInput.text,pieceNameGroup.input.text,sizeGroup.input.text,waistSizeGroup.input.text,artLocGroup.input.text))
					{
						dialogSuccess = true;
						w.close();
					}
					else{};
				}
			var cancel = btnGroup.add("button", undefined, "Cancel");
				cancel.onClick = function()
				{
					dialogSuccess = false;
					w.close();
				}
	w.show();

	return dialogSuccess;
}
/* beautify ignore:end */