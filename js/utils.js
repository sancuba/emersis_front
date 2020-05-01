
function ordenarJsonArray(jsonArray, prop, asc) {
	var result = jsonArray.sort(function(a, b) {
		var aProp = a[prop] != "-" ? a[prop] : null;
		var bProp = b[prop] != "-" ? b[prop] : null;
		if (asc) {
			return aProp > bProp ? 1 : aProp < bProp ? -1 : 0;
		}
		return bProp > aProp ? 1 : bProp < aProp ? -1 : 0;
	});
	return result;
}

function ordenarJson2doOrden(json, prop1, prop2, asc) {
	var result = json
			.sort(function(a, b) {
				var aProp = a[prop1] != null && a[prop1][prop2] != null ? a[prop1][prop2]
						: null;
				var bProp = b[prop1] != null && b[prop1][prop2] != null ? b[prop1][prop2]
						: null;
				if (asc) {
					return aProp > bProp ? 1 : aProp < bProp ? -1 : 0;
				}
				return bProp > aProp ? 1 : bProp < aProp ? -1 : 0;
			});
	return result;
}
