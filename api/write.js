export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if(req.method === "OPTIONS"){
    return res.status(200).end();
  }

  const GIST_ID = process.env.GIST_ID;
  const GITHUB_PAT = process.env.GITHUB_PAT;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  const body = await req.body;
  if(body.password !== ADMIN_PASS){
    return res.status(403).json({ok:false,message:"管理员密码错误，禁止写入"});
  }

  const newData = body.data;
  try{
    const resp = await fetch(`https://api.github.com/gists/${GIST_ID}`,{
      method:"PATCH",
      headers:{
        "Authorization":`Bearer ${GITHUB_PAT}`,
        "Accept":"application/vnd.github+json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        files:{
          "data.json":{
            content:JSON.stringify(newData,null,2)
          }
        }
      })
    });
    if(!resp.ok) throw new Error(`github patch ${resp.status}`);
    res.status(200).json({ok:true});
  }catch(err){
    res.status(500).json({ok:false,error:err.message});
  }
}
