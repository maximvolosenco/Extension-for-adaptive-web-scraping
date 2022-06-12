

export async function PostSelectorData(data) {

    console.log(data)
    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        };  
    
        let response = await fetch("https://localhost:7000/Selector", options);
        if (!response.ok) {
            let errorMessage = await response.text();
            console.error('Error message: ', errorMessage);
            return false;
        }
        else {
            return true;
        }
  }
  