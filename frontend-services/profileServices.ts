export const getUserProfile = async (url:string,accessToken:string)=>{
    let data;
    const res = await fetch(
        url,
        {
          method: "GET",
          headers:{
            "Authorization":`Bearer ${accessToken}`
          }
        }
      );
    data=await res.json()
    console.log("HEREABVZX",data)
        return data;
}