/* beautify ignore:start */
function makeDialog()
{
	var dialogSuccess = false;

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
			//group for radio buttons
			var oriRadioGroup = oriGroup.add("group");
				var oriVert = oriRadioGroup.add("radiobutton", undefined, "Vertical");
					oriVert.value = true;
				var oriHorz = oriRadioGroup.add("radiobutton", undefined, "Horizontal");


		////////////////////////
		////////ATTENTION://////
		//
		//		temporary holdup for testing images
		//
		////////////////////////

		w.show();
		return;

		//group for entry of piece names:
		var pieceNameGroup = w.add("panel");
			pieceNameGroup.orientation = "column";
			var pngTxt = pieceNameGroup.add("statictext", undefined, "Enter the names of the pieces in the order they appear in the CAD.");
			var pngTxt2 = pieceNameGroup.add("statictext", undefined, "Separate each value by a comma.");
			var pngInput = pieceNameGroup.add("edittext", undefined, "Front, Back, Right Sleeve, Left Sleeve, Collar");
				pngInput.characters = 100;

		//group for selection of sizing structure
		var selectSizeStructureGroup = w.add("panel");
			selectSizeStructureGroup.orientation = "row";
			var sssgTxt = selectSizeStructureGroup.add("statictext", undefined, "Select the appropriate sizing format.");

			makeAssets(selectSizeStructureGroup, sizingStructures,"radiobutton",function()
				{
					sgInput.text = exampleSizing[this.text];
					if(this.text === "Varying Inseams")
					{
						varyingInseamSizing = true;
						sgWaistInput.enabled = true;
					}
					else
					{
						varyingInseamSizing = false;
						sgWaistInput.enabled = false;
					}
				});


		//group for input of available sizes
		var sizeGroup = w.add("panel");
			sizeGroup.orientation = "column";
			var sgTxt = sizeGroup.add("statictext", undefined, "Enter the sizes [in order] needed for this garment.");
			var sgTxt2 = sizeGroup.add("statictext", undefined, "Separate each value by a comma.");
			var sgInput = UI.edit(sizeGroup,"S,M,L,XL,SM-MD,30x32,30Ix32W",100);
			var sgWaistTxt = sizeGroup.add("statictext", undefined, "Enter the waist sizes [in order] needed for this garment.");
			var sgWaistTxt2 = sizeGroup.add("statictext", undefined, "Separate each value by a comma.");
			var sgWaistInput = UI.edit(sizeGroup,exampleSizing["Waist Sizing"],100);
				sgWaistInput.enabled = false;

			

		//group for selection of necessary art layers
		var artLocGroup = w.add("panel");
			artLocGroup.orientation = "column";
			var artLocInputTxt = UI.static(artLocGroup,"Enter the artwork locations needed for this garment.");
			var artLocInputTxt2 = UI.static(artLocGroup,"Separate each value by a comma.");
			// var artLocInput = artLocGroup.add("edittext", undefined, "Front Logo, Front Number, Player Name, Back Number");
			var artLocInput = UI.edit(artLocGroup,"Front Logo, Front Number, Player Name, Back Number",100);

		//group for buttons
		var btnGroup = w.add("group");
			var submit = btnGroup.add("button", undefined, "Submit");
				submit.onClick = function()
				{
					if(validate(gcInput,oriRadioGroup,pngInput,sizeCheckboxGroup,artLocCheckboxGroup,artLocInput,sizeCheckboxGroup2))
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