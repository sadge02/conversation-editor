const Plugin = () => {
    return (
        <div className="flex flex-row gap-12 w-full h-full text-white py-12">
            <div className="flex flex-col bg-gray-800 max-w-[1000px] p-6 gap-6 rounded-lg">
                <p className="text-1xl text-justify">&emsp; The Conversation Plugin for Minecraft enables developers to create interactive dialogues and quests within the game, integrating narrative pathways that enhance player immersion. Conversations are built on a webpage where developers design dialogue structures, which are then saved as JSON files in the server’s plugin folder. The Command Interface allows further management of conversations, including adding/removing players and adjusting flow in real-time. This plugin offers the ability to create stories, quests and simple cutscenes.</p>
                <iframe width="950" height="534" src="https://www.youtube.com/embed/uLfVvK5shTc?si=PdQNdp3CiwCc-4r-" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
      </div>
    );
};

export default Plugin;