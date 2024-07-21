import { Routes, Route } from "react-router-dom"
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Home from "./pages/Home";
import Cards from "./components/Cards";

  function App() {

    return (
        <div className="App">
        <Routes>
          
          <Route path ="/Cards" element= { <Cards/>} />
          <Route path ="/" element= { <Home/>} />
          <Route path="register" element={ <RegisterPage/> } />
          <Route path="/login" element={ <LoginPage/> } />
        </Routes>
      </div>
    )
  }
  
  export default App;