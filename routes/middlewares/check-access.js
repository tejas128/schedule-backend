module.exports=function(access){
    
    return (req,res,next)=>{
        try{
            let role=req.decoded.user.role
            
            const authorized=access.some(value=>role === value )
      
            if(authorized){
                next()
    
            }else{
                throw `only ${access} memebers have permission`
            }
        }catch(err){
            res.status(403).json({
                success:0,
                message:"you don't have authentication",
                error:err.message

            })
        }
      
    }
}