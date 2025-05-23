import '../App.css';
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "../components/NavBar";
import { Banner } from "..//components/Banner";
import { Skills } from "../components/Skills";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

const Main=()=>{
    return (
      <div className="">
           <NavBar/>
          <Banner />
          <Skills />
          <Projects />
          <Contact />
          <Footer />
      </div>
      );
}
export default Main