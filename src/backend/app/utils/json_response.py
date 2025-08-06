def json_response(status: str, message: str, code: int = None, data=None):
    response = {
        "status": status,
        "message": message
    }
    if code is not None:
        response["code"] = code
    if data is not None:
        response["data"] = data
   
    return response