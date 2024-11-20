import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import '@xyflow/react/dist/style.css';

import img from "./images/plugin logo.gif";

import Tutorial from './components/panels/Tutorial';
import Links from './components/panels/Links';
import Plugin from './components/panels/Plugin';
import NodeEditor from './components/panels/NodeEditor';

function App() {
  return (
    <div className="flex flex-col items-center w-dvw h-dvh bg-gray-900 overflow-y-scroll">
      <header className="flex flex-col items-center p-12">
        <div className="flex items-center flex-nowrap space-x-2 align-middle gap-5npm install @xyflow/react gap-5">
          <h1 className="text-5xl font-light text-white text-nowrap">
            <span className="font-bold">Conversation</span> Editor
          </h1>
          <img
            src={img}
            alt="Logo"
            className="h-24 w-36"
          />
        </div>
      </header>
      {/* Tabs */}
      <div className="flex flex-col items-center w-full">
        <Tabs defaultValue="plugin" className="flex flex-col items-center w-full">
          <TabsList className="flex flex-row justify-evenly py-8 bg-gray-800 max-w-[50%] min-w-fit px-6 gap-4">
            <TabsTrigger value="plugin" className="p-2 min-w-32 text-black bg-white hover:bg-gray-400">Plugin</TabsTrigger>
            <TabsTrigger value="tutorial" className="p-2 min-w-32 text-black bg-white hover:bg-gray-400">Tutorial</TabsTrigger>
            <TabsTrigger value="editor" className="p-2 min-w-32 text-black bg-white hover:bg-gray-400">Editor</TabsTrigger>
            <TabsTrigger value="links" className="p-2 min-w-32 text-black bg-white hover:bg-gray-400">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="plugin">
            <div className="p-4">
              <Plugin />
            </div>
          </TabsContent>

          <TabsContent value="tutorial">
            <div className="p-4">
              <Tutorial />
            </div>
          </TabsContent>

          <TabsContent value="editor">
            <div className="p-4">
              <NodeEditor />
            </div>
          </TabsContent>

          <TabsContent value="links">
            <div className="p-4">
              <Links />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
