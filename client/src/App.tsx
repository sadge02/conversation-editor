import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

import img from "./images/logo.webp";

import Tutorial from './components/Tutorial';
import Links from './components/Links';
import Plugin from './components/Plugin';

function App() {
  return (
    <div className="flex flex-col items-center w-dvw h-dvh bg-gray-900 overflow-y-scroll">
      {/* Header with Avatar and Title */}
      <header className="flex flex-col items-center p-12">
        <div className="flex items-center flex-nowrap space-x-2">
          <img
            src={img}
            alt="Logo"
            className="h-24 w-24"
          />
          <h1 className="text-5xl font-light text-white text-nowrap">
            <span className="font-bold">Conversation</span> Editor
          </h1>
        </div>
      </header>
      {/* Tabs */}
      <div className="flex flex-col items-center w-full">
        <Tabs defaultValue="plugin" className="flex flex-col items-center w-full">
          <TabsList className="flex flex-row justify-evenly py-8 bg-gray-800 max-w-[50%] min-w-fit px-6 gap-4">
            <TabsTrigger value="plugin" className="p-2 min-w-32 text-black bg-gray-400 hover:bg-gray-500">Plugin</TabsTrigger>
            <TabsTrigger value="tutorial" className="p-2 min-w-32 text-black bg-gray-400 hover:bg-gray-500">Tutorial</TabsTrigger>
            <TabsTrigger value="editor" className="p-2 min-w-32 text-black bg-gray-400 hover:bg-gray-500">Editor</TabsTrigger>
            <TabsTrigger value="links" className="p-2 min-w-32 text-black bg-gray-400 hover:bg-gray-500">Links</TabsTrigger>
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
              <h2 className="text-xl font-semibold">Editor</h2>
              <p>This is the editor content.</p>
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
