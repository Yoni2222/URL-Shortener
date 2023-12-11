import React, { useState, useEffect } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { v4 as uuidv4 } from 'uuid';
import { HOST_URL } from './Constants'
var userId = "";
const App = () => {
  const [urls, setUrls] = useState([]);
  //const [userId, setUserId] = useState("");


  useEffect(() => {

    userId = localStorage.getItem('userId') || uuidv4();
    localStorage.setItem('userId', userId);

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

            /* 
                          arr.map(elem => {
              const res = urls.find(element => {
                if (element.shortUrl === elem.shortUrl && element.originalUrl === elem.originalUrl) {
                  return true;
                }
                return false;
              });
              if (res === false){
                setUrls(prev => {
                  return [...prev, elem];
                });
              }

            });
            */
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
    <div className="App">
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
    
    const getShortURL = async (event) => {
      
      event.preventDefault();
      
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
        console.log("can't get response + error");
    });
      
    }
      catch(error){
        //alert("bug");
        console.log("failed to post. Here is the error: " + error);         
      }

    };

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
          <div className = "d-flex justify-content-between">
            <div className = "align-self-start">
                <a href = {HOST_URL + `newUrl/${elem.shortUrl}`}>{HOST_URL  + elem.shortUrl + " "} {space}</a>
                {/*<a href = {HOST_URL + `newUrl/shortUrl`}>{HOST_URL  + elem.shortUrl + " "} {space}</a>*/}
            </div>
            <div className = "fs-5 ml-3" style = {{marginLeft: '600px'}}>
              
                {" " + elem.date}
            </div>
            <div className = "fs-5" style = {{marginRight: '30px'}}>
                {" " + elem.currTime + " "}
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
    navigator.clipboard.writeText(HOST_URL + "/" + props.url);
    //alert(props.url);
  }

  return (
    <button type="button" className ="btn btn-success pt-2 pb-4" onClick = {copyLink} style = {{width : "92px", height : "36px", paddingRight : "25px", verticalLine:"middle"}}>Copy  <SvgCopy/>  
    </button>
  );
}

const SvgCopy = () => {
  /*return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="#080341"/>
</svg>
  );*/

  /*return (
    <svg className = "pb-1" width = "24px" height = "24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="#FFFFFF"></path> </g></svg>
  );*/

  /*return (
    <svg className = "pb-1" width = "24px" height = "24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#FFFFFF"></path> <path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" fill="#FFFFFF"></path> </g></svg>
  );*/
  /*return (
    <svg className = "pb-1" width = "20px" height = "20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="copy"> <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M11.1667 0.25C8.43733 0.25 6.25 2.50265 6.25 5.25H12.8333C15.5627 5.25 17.75 7.50265 17.75 10.25V18.75H17.8333C20.5627 18.75 22.75 16.4974 22.75 13.75V5.25C22.75 2.50265 20.5627 0.25 17.8333 0.25H11.1667Z" fill="#FFFFFF"></path> <path id="rec" d="M2 10.25C2 7.90279 3.86548 6 6.16667 6H12.8333C15.1345 6 17 7.90279 17 10.25V18.75C17 21.0972 15.1345 23 12.8333 23H6.16667C3.86548 23 2 21.0972 2 18.75V10.25Z" fill="#FFFFFF"></path> </g> </g> </g></svg>
  );*/
  /*return (
    <svg className = "pb-1" width = "24px" height = "24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFF" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="copy"> <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M11.1667 0.25C8.43733 0.25 6.25 2.50265 6.25 5.25H12.8333C15.5627 5.25 17.75 7.50265 17.75 10.25V18.75H17.8333C20.5627 18.75 22.75 16.4974 22.75 13.75V5.25C22.75 2.50265 20.5627 0.25 17.8333 0.25H11.1667Z" fill="#FFFFFF"></path> <path id="rec" d="M2 10.25C2 7.90279 3.86548 6 6.16667 6H12.8333C15.1345 6 17 7.90279 17 10.25V18.75C17 21.0972 15.1345 23 12.8333 23H6.16667C3.86548 23 2 21.0972 2 18.75V10.25Z" fill="#FFFFFF"></path> </g> </g> </g></svg>
  );*/

  /*return (
    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="FFFFFF" stroke-width="1.344"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#FFFFFF"></path> <path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" fill="#FFFFFF"></path> </g></svg>
  );*/

  //marginRight:"-25px"
  return (
    <svg style = {{marginRight:"-25px", verticalLine:"middle"}}className = "pb-1 ml-1" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="6" y="6" width="10" height="14" rx="1.5" fill="#FFFFFF"></rect> <path d="M8.06427 5.06427C8.20216 5.02247 8.34846 5 8.5 5H15.5C16.3284 5 17 5.67157 17 6.5V17.5C17 17.6515 16.9775 17.7978 16.9357 17.9357C17.5517 17.7491 18 17.1769 18 16.5V5.5C18 4.67157 17.3284 4 16.5 4H9.5C8.82312 4 8.25095 4.44835 8.06427 5.06427Z" fill="#FFFFFF"></path> </g></svg>
  );
}

export default App;