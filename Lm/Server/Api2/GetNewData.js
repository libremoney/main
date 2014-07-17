/*
import org.json.simple.JSONStreamAware;
*/

/*
static final GetNewData instance = new GetNewData();
*/

function GetNewData() {
	return UserRequestHandler.Create();
}

function ProcessRequest(req, user) {
	/*
	return null;
	*/
}


GetNewData.prototype.ProcessRequest = ProcessRequest;


exports.Create = GetNewData;
