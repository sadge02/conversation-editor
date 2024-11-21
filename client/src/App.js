"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tabs_1 = require("./components/ui/tabs");
require("@xyflow/react/dist/style.css");
const plugin_logo_gif_1 = __importDefault(require("./images/plugin logo.gif"));
const Tutorial_1 = __importDefault(require("./components/panels/Tutorial"));
const Links_1 = __importDefault(require("./components/panels/Links"));
const Plugin_1 = __importDefault(require("./components/panels/Plugin"));
const NodeEditor_1 = __importDefault(require("./components/panels/NodeEditor"));
function App() {
    return (<div className="flex flex-col items-center w-dvw h-dvh bg-gray-900 overflow-y-scroll">
      <header className="flex flex-col items-center p-12">
        <div className="flex items-center flex-nowrap space-x-2 align-middle gap-5npm install @xyflow/react gap-5">
          <h1 className="text-5xl font-light text-white text-nowrap">
            <span className="font-bold">Conversation</span> Editor
          </h1>
          <plugin_logo_gif_1.default src={plugin_logo_gif_1.default} alt="Logo" className="h-24 w-36"/>
        </div>
      </header>
      {/* Tabs */}
      <div className="flex flex-col items-center w-full">
        <tabs_1.Tabs defaultValue="plugin" className="flex flex-col items-center w-full">
          <tabs_1.TabsList className="flex flex-row justify-evenly py-8 bg-gray-800 max-w-[50%] min-w-fit px-6 gap-4">
            <tabs_1.TabsTrigger value="plugin" className="p-2 min-w-32 text-black bg-white hover:bg-gray-400">Plugin</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="tutorial" className="p-2 min-w-32 text-black bg-white hover:bg-gray-400">Tutorial</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="editor" className="p-2 min-w-32 text-black bg-white hover:bg-gray-400">Editor</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="links" className="p-2 min-w-32 text-black bg-white hover:bg-gray-400">Links</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="plugin">
            <div className="p-4">
              <Plugin_1.default />
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="tutorial">
            <div className="p-4">
              <Tutorial_1.default />
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="editor">
            <div className="p-4">
              <NodeEditor_1.default />
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="links">
            <div className="p-4">
              <Links_1.default />
            </div>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </div>
    </div>);
}
exports.default = App;
