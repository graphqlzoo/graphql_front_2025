import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RegisterForm from './register/RegisterForm';
import ZooExplore from './espaces/Espaces';
import Animaux from './animaux/Animaux';
import AnimalDetail from './animalDetail/animalDetail';
import Buy from './buy/Buy';
import Billets from './billets/Billets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PatchTicket from './buy/PatchTicket';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterForm/>}/>
          <Route path="/espaces" element={<ZooExplore/>}/>
          <Route path="/espaces/:id" element={<Animaux/>}/>
          <Route path="/buy" element={<Buy/>}/>
          <Route path="/billets" element={<Billets/>}/>
          <Route path="/billets/patch/:id" element={<PatchTicket/>}/>
          <Route path="/animaux" element={<Animaux/>}/>
          <Route path="/animal/:id" element={<AnimalDetail/>}/>
          <Route path='*' element={<Navigate to='/espaces'/>}/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
