

export const useUserService = () => {

    async function getUserInfo(){
        
        let response = await fetch("https://localhost:7000/User");

        if (!response.ok) {
            let errorMessage = await response.text();
            console.error('Error message: ', errorMessage);

            return errorMessage;
       }
       else {

            let data = await response.text() ;
            return data;
       }
    }

    return {
        getUserInfo,
    }
}
