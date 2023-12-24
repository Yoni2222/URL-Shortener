import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { HOST_URL } from './Constants'

const ShortenedRoute = (props) => {
    const [routeAccepted, setRouteAccepted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        GetFromDB();

    }, []);

    const GetFromDB = async() => {
        
        
        var path = window.location.pathname.slice(1, 6);
        
        try {
        const response = await fetch(HOST_URL + "newUrl/shortUrl", {
            method: "POST",
            mode: "cors", 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({shortUrl : path})
        })
          .then((res) => res.json())
          .then((res) => {
            
            if (res.success === true){
                
                setRouteAccepted(true);
                window.location.replace(res.originalUrl);
            }
          })
        .catch((error)=>{
          console.log("can't get response from db " + error);
          
      });
    }
    catch (err){
        console.log(err);
        
    }
    }

    return (routeAccepted === false && <p>Loading...</p>);

}






export default ShortenedRoute;