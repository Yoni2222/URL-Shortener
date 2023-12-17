import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Main from './Main.jsx';
import ShortenedRoute from './ShortenedRoute.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path = "/:elem.shortUrl" element = {<ShortenedRoute/>}/>
        <Route/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;