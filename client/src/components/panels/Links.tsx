import { SiSpigotmc } from "react-icons/si";
import { FaGithub, FaUniversity, FaYoutube } from "react-icons/fa";
import { IconContext } from "react-icons";

const Links = () => {
    return (
        <IconContext.Provider
            value={{ color: 'white', size: '100px' }}
            >
            <div className="flex flex-row items-center gap-32 mt-16">
                <div className="flex flex-col items-center gap-5 group">
                    <a href="https://www.spigotmc.org/resources/conversation-plugin.120793/" target="_blank" className="group-hover:scale-105 transition-transform">
                        <SiSpigotmc />  
                    </a>
                    <h1 className="text-white font-bold text-xl">
                        Spigot
                    </h1>
                </div>
                <div className="flex flex-col items-center gap-5 group">
                    <a href="https://github.com/sadge02/conversation-plugin" target="_blank" className="group-hover:scale-105 transition-transform">
                        <FaGithub />  
                    </a>
                    <h1 className="text-white font-bold text-xl">
                        GitHub
                    </h1>
                </div>
                <div className="flex flex-col items-center gap-5 group">
                    <a href="https://is.muni.cz/auth/rozpis/tema?fakulta=1433;balik=1275;tema=506773;uplne_info=1" target="_blank" className="group-hover:scale-105 transition-transform">
                        <FaUniversity />  
                    </a>
                    <h1 className="text-white font-bold text-xl">
                        Thesis
                    </h1>
                </div>
                <div className="flex flex-col items-center gap-5 group">
                    <a href="https://www.youtube.com/@ConversationPlugin" target="_blank" className="group-hover:scale-105 transition-transform">
                        <FaYoutube />  
                    </a>
                    <h1 className="text-white font-bold text-xl">
                        YouTube
                    </h1>
                </div>
            </div>
        </IconContext.Provider>
    );
};

export default Links;
