const User = require('../../models/user/user')

const blockUser = async(req,res)=>{
    try {
        const userId = req.params.id
        const updateIsVerified = await User.findByIdAndUpdate({_id:userId},{isVerified:false})
        if(updateIsVerified){
            res.status(200).json({message:'isverified updated'})
        }else{
            res.status(400).json({error:'isverified not updated'})
        }
    } catch (error) {
        console.log('error occured while blocking user',error);
    }
}

const unblockUser = async(req,res)=>{
    try {
        const userId = req.params.id
        const updateIsVerified = await User.findByIdAndUpdate({_id:userId},{isVerified:true});
        if(updateIsVerified){
            res.status(200).json({message:'isverified updated'})
        }else{
            res.status(400).json({error:'isverified not updated'})
        }
    } catch (error) {
        console.log('error found while admin unblocking user');
    }
}

module.exports = {
    blockUser,
    unblockUser,
}