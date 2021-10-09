const { Router, response } = require('express');
const express= require('express');
const request=require('request')
const config=require('config')
const router=express.Router();
const auth=require('../../middleware/auth')
const {check,validationResult}=require('express-validator');

const Profile=require('../../models/Profile');
const User=require('../../models/User');

//@route GET api.profile
//@desc Test route
//@acces Public
router.get('/me',auth,async(req,res)=>{
    try{
        const profile=await Profile.findOne({use:req.user.id}).populate(
            'user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(profile);
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    }
)
router.post('/',[auth,[
check('status','Status is required').not().isEmpty(),
check('skills','Skills is required').not().isEmpty()
    ]
],
async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        facebook,
        instagram,
        linkedin
    }=req.body;

    //build profile object
    const profileFields={};
    profileFields.user=req.user.id;
    if(company)profileFields.company=company;
    if(website)profileFields.website=website;
    if(location)profileFields.location=location;
    if(bio)profileFields.bio=bio;
    if(status)profileFields.status=status;
    if(githubusername)profileFields.githubusername=githubusername;
    if(skills){
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    }

    //build social object
    profileFields.social={}
    if(youtube)profileFields.social.youtube=youtube;
    if(twitter)profileFields.social.twitter=twitter;
    if(facebook)profileFields.social.facebook=facebook;
    if(linkedin)profileFields.social.linkedin=linkedin;
    if(instagram)profileFields.social.instagram=instagram;

    try{
        let profile=await Profile.findOne({user:req.user.id});
        if(profile){
            //update
            profile=await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            );

            return res.json(profile);
        }

        //Create
        profile=new Profile(profileFields)
        
        await profile.save();
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Error Server');
    }
});

router.get('/',async(req,res)=>{
    try {
        const profil=await Profile.find().populate(
            'user',['name','avatar']);
            res.json(profil);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile=await Profile.findOne({user: req.params.user_id}).populate(
            'user',['name','avatar']);

            if(!profile) return res.status(400).json({
                msg:'profile not found'
            });

            res.json(profile);
    } catch (error) {
        console.error(error.message);
        if(error.kind=='ObjectId'){
            return res.status(400).json({
                msg:'profile not found'
            });
        }
        res.status(500).send("Server Error");
    }
})

router.delete('/',auth,async(req,res)=>{
    try {
        await Profile.findOneAndRemove({user:req.user.id})
        await User.findOneAndRemove({_id:req.user.id})
        res.json({msg:'User deleted'})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
})

router.put('/experience',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty(),
]],async(req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty()){
           return res.status(400).json({msg:error.array()});
        }
        const{
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }=req.body;

        const newEp={
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try {
            const profile=await Profile.findOne({user:req.user.id});
         
            
            profile.experince.unshift(newEp);
        

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error Server');
        }

});

router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try {
        const proflie=await Profile.findOne({user:req.user.id});
        
        //get remove index
        const removeIndex=proflie.experince.map(item=>
         item.id).indexOf(req.params.exp_id);

         proflie.experince.splice(removeIndex,1);

         await profile.save();

         res.json(proflie);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

router.put('educatiom',
[
    auth,
    [
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','fieldofstudy is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty(), 
    ]
]
,async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()})
    }
    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body;

    const newEduc={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEduc);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.delete('/educatiom/:exp_id',auth,async(req,res)=>{
    try {
        const proflie=await Profile.findOne({user:req.user.id});
        
        //get remove index
        const removeIndex=proflie.education.map(item=>
         item.id).indexOf(req.params.exp_id);

         proflie.education.splice(removeIndex,1);

         await profile.save();

         res.json(proflie);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

router.get('/github/:username',async (req,res)=>{
    try {
        const options={
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}
            &client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent':'node.js'}};
            
            request(options,(error,response,body)=>{
                if(error) console.error(error.message);
                if(response.statusCode!=200){
                    res.status(400).json({msg:'No Github profile found'});
                }
                res.json(JSON.parse(body));
            });
    } catch (error) {
      console.error(error.message); 
      res.status(500).send('Server error')
    }
})


module.exports=router;