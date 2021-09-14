import { updateProfileData } from "./auth";
import Auth from "@aws-amplify/auth";

export const get_userData = async ()=>{

    try{
        Auth.currentAuthenticatedUser().then(data => {

                const formValues = {
                    first_name: data["signInUserSession"]["idToken"]["payload"]["given_name"],
                    last_name: data["signInUserSession"]["idToken"]["payload"]["family_name"],
                    phone: data["signInUserSession"]["idToken"]["payload"]["phone_number"],
                    email: data["signInUserSession"]["idToken"]["payload"]["email"],
                }
                
                updateProfileData(formValues)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    
                });
        })
        
    }
    catch (err){
    }
    

}