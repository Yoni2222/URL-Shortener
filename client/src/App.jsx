import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Main from './Main.jsx';
import ShortenedRoute from './ShortenedRoute.jsx';

const App = () => {
  var a = 17;
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path = "/:shortUrl" element = {<ShortenedRoute/>}/>
        <Route/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;