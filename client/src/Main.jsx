import React, { useState, useEffect } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { v4 as uuidv4 } from 'uuid';
import { Outlet, Link } from "react-router-dom";
import { HOST_URL } from './Constants'
var userId = "";
const Menu = () => {
  const [urls, setUrls] = useState([]);
  //const [userId, setUserId] = useState("");


  useEffect(() => {

    userId = localStorage.getItem('userId') || uuidv4();
    localStorage.setItem('userId', userId);
    //alert("path is ");
    getFromDB(userId);
  }, []);


  const getFromDB = async (userId) => {
    //alert("in getfromdb, userId is " + userId);
      try {
        const response = await fetch(HOST_URL + "db", {
          method: "POST",
          mode: "cors", 
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({userid : userId})
      })
        .then((res) => res.json())
        .then((res) => {
          //alert("res[0] is " + res[0]);
          if (res[0] != "null"){
            //alert("len of arr is " + res.length);
            //console.log("res is " + {res});
            var arr = res;
            arr.map(elem => {
              setUrls(prev => {
                return [...prev, elem];
              });
            });
          }
          else if (res[0] == "null"){
            //alert("didn't find any array");
          }
        })
      .catch((err)=>{
        console.log("can't get response from /db");
    });
      
    }
    catch(error){
      console.log("failed to post to /db ");         
    }
  }

  return (
    <div className="Menu">
      <div className = "container">
        <div className = "row"> 
          <HeaderAndInput list = {urls} updateList = {setUrls} idOfUser = {userId}/>
        </div>
        <div className = "row">
          <ListOfURLs list = {urls}/>
        </div>
      </div>   
    </div>
  );
}

const HeaderAndInput = (props) => {
    const [isPlaceholderHidden, setPlaceholderHidden] = useState(false);
    const [longURL, setLongURL] = useState("");

    const handleFocus = () => {
      setPlaceholderHidden(true);
    };

    const handleBlur = () => {
      setPlaceholderHidden(false);
    };

    const changeLongURL = (event) => {
      var url = event.target.value;
      setLongURL(url);
    };

    const urlInTheList = () => {
        for (let i = 0; i < props.list.length; i++){
            if (props.list[i].originalUrl === longURL)
                return true;
        }
        return false;
    }

    const isValidUrl = (url) => {
        try {
          new URL(url);
          return true;
        } catch (err) {
          return false;
        }
      }
    
    const getShortURL = async (event) => {
      
      event.preventDefault();
      
      if (isValidUrl(longURL) === false){
        alert("This URL is not valid");
      }
      else if (urlInTheList() === false){
        const shortURL = cryptoRandomString({length : 5, type : 'alphanumeric'});

        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        
        var currentDate = `${day}/${month}/${year}`;
        
        var time = String(date.toJSON().slice(11, 16));
        var hours = time.slice(0, 2);
            
        hours = (String)(parseInt(hours) + 2);
        
        if (parseInt(hours) > 23){
            hours = (String)(parseInt(hours) - 24);
        }
        if (parseInt(hours) < 10){
            hours = "0" + hours;
        }
        time = hours + time.slice(2, 5);
        
        props.updateList(prev => {
            return [...prev, {originalUrl : longURL, shortUrl : shortURL, date : currentDate, currTime : time}];
        });
        
        //alert("userId is " + userId);
        try {
            const response = await fetch(HOST_URL + "api/url", {
            method: "POST",
            mode: "cors", 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({originalUrl : longURL, shortUrl : shortURL, date : currentDate, currTime : time, userId : userId})
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.success === true)
            console.log("succeeded");  
            //alert("succeeded");

        })
        .catch((err)=>{
            console.log("can't get response" + err);
        });
        
        }
        catch(error){
            //alert("bug");
            console.log("failed to post. Here is the error: " + error);         
        }

        }
        else {
            alert("This url is already in the list.");
        }

    }

    return (
      <div>
          <h1 className = "my-4" style = {{textAlign:"center", fontWeight:600}}>URL Shortener</h1>
            <form className="form-inline">
                <div className = "input-group pt-2" style = {{ marginLeft:"-8px"}}>
                  <label className="visually-hidden" for="inlineFormInputName2">Website</label>
                  <input type="text"  onChange = {changeLongURL} className="form-control mb-2 mr-sm-2 me-2" id="inlineFormInputName2" placeholder={isPlaceholderHidden ? '' : "https://example.com"} 
                  onFocus={handleFocus} 
                  onBlur={handleBlur}/>

                  <button onClick = {getShortURL} className="btn btn-primary mb-2" style ={{width:"92px"}}>Submit</button>
                </div>
            </form>
      </div>
    );
}

const ListOfURLs = (props) => {
  const space = " ";
  //`${HOST_URL}newUrl/${elem.shortUrl}`

  return (
    
    <ul className = "list-group" style = {{width:"99.3%"}}>
      {props.list.length > 0 && props.list.map((elem) =>
        <li className = "list-group-item">
          <div className = "d-flex justify-content-sm-between">
            <div className = "align-self-start">
                <Link to = {`/${elem.shortUrl}`}>{HOST_URL  + elem.shortUrl}</Link>
                {/*<Outlet/>*/}
            </div>
            <div className = "fs-5 ml-3" style = {{marginLeft: '500px'}}>
              
                {elem.date}
            </div>
            <div className = "fs-5" style = {{marginRight: '30px'}}>
                {elem.currTime}
            </div> 
            <div className = "fs-5" style = {{marginRight: '-10px'}}>
                <CopyLinkButton url = {elem.shortUrl}/>
            </div>
          </div>
          <div className="d-flex">
            <div>
              {elem.originalUrl}
            </div>
          </div>
        </li>     
      )}
      
    </ul>
  );
}

const CopyLinkButton = (props) => {

  const copyLink = () => {
    navigator.clipboard.writeText(HOST_URL + props.url);

  }

  return (
    <button type="button" className ="btn btn-success pt-2 pb-4" onClick = {copyLink} style = {{width : "92px", height : "36px", paddingRight : "25px", verticalLine:"middle"}}>Copy  <SvgCopy/>  
    </button>
  );
}

const SvgCopy = () => {

  return (
    <svg style = {{marginRight:"-25px", verticalLine:"middle"}}className = "pb-1 ml-1" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="6" y="6" width="10" height="14" rx="1.5" fill="#FFFFFF"></rect> <path d="M8.06427 5.06427C8.20216 5.02247 8.34846 5 8.5 5H15.5C16.3284 5 17 5.67157 17 6.5V17.5C17 17.6515 16.9775 17.7978 16.9357 17.9357C17.5517 17.7491 18 17.1769 18 16.5V5.5C18 4.67157 17.3284 4 16.5 4H9.5C8.82312 4 8.25095 4.44835 8.06427 5.06427Z" fill="#FFFFFF"></path> </g></svg>
  );
}

export default Menu;