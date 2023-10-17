export default function handler(request, response) {
    if(request.method==="OPTIONS")
    return response.status(200).body({OK})
    else if(request.method==="GET"){
        return response.status(200).json({
            "abc.eth":"1"
        })
    }
  }