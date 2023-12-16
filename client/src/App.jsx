import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Menu from './Menu.jsx';
import ShortenedRoute from './ShortenedRoute.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Menu />} />
        <Route path = ":shortUrl" element = {<ShortenedRoute/>}/>
        <Route/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;