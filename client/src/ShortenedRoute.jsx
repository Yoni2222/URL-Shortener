import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { HOST_URL } from './Constants'

const ShortenedRoute = (props) => {
    const [routeAccepted, setRouteAccepted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getFromDB();

    }, []);

    const getFromDB = async() => {
        const path = props.match.params.shortUrl;
        try {
        const response = await fetch("/newUrl/shortUrl", {
            method: "POST",
            mode: "cors", 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({shortUrl : path})
        })
          .then((res) => res.json())
          .then((res) => {
            alert("im back here");
            if (res.success === true){
                setRouteAccepted(true);
                navigate(res.originalUrl);
            }
          })
        .catch((error)=>{
          console.log("can't get response from db " + error);
          alert("cant get response from db");
      });
    }
    catch (err){
        console.log(err);
        alert("failed to reach server");
    }
    }

    return (routeAccepted === false && <p>Loading...</p>);

}






export default ShortenedRoute;