export default function handler(request, response) {
    if(request.method==="OPTIONS")
    return response.status(200).body("ok")
    else if(request.method==="GET"){
        return response.status(200).json({
            "0x620E1cf616444d524c81841B85f60F8d3Ea64751":"1"
        })
    }
  }