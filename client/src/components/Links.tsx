import { SiSpigotmc } from "react-icons/si";
import { FaGithub, FaUniversity, FaYoutube } from "react-icons/fa";
import { IconContext } from "react-icons";

const Links = () => {
    return (
        <IconContext.Provider
            value={{ color: 'white', size: '100px' }}
            >
            <div className="flex flex-row items-center  gap-32">
                <div>
                    <a href="https://www.spigotmc.org/resources/" target="_blank">
                        <SiSpigotmc />  
                    </a>
                </div>
                
                <a href="https://github.com/sadge02/conversation-plugin" target="_blank">
                    <FaGithub />  
                </a>
                <a href="https://is.muni.cz/auth/rozpis/tema?fakulta=1433;balik=1275;tema=506773;uplne_info=1" target="_blank">
                    <FaUniversity />  
                </a>
                <a href="https://www.youtube.com/" target="_blank">
                    <FaYoutube />  
                </a>  
            </div>
        </IconContext.Provider>
    );
};

export default Links;
