import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RegisterForm from './register/RegisterForm';
import ZooExplore from './espaces/Espaces';
import Passes from './passes/Passes';
import Animaux from './animaux/Animaux';
import Zoos from './zoos/Zoos';
import AnimalDetail from './animalDetail/animalDetail';
import Buy from './buy/Buy';
import Billets from './billets/Billets';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/espaces" element={<ZooExplore/>}/>
        <Route path="/espaces/:id" element={<Animaux/>}/>
        <Route path="/passes" element={<Passes/>}/>
        <Route path="/buy/:id" element={<Buy/>}/>
        <Route path="/billets" element={<Billets/>}/>
        <Route path="/animaux" element={<Animaux/>}/>
        <Route path="/animal/:id" element={<AnimalDetail/>}/>
        <Route path="/zoos" element={<Zoos/>}/>
        <Route path='*' element={<Navigate to='/espaces'/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
