const Tutorial = () => {
    return (
        <div className="flex flex-row gap-12 w-full h-full text-white py-12">
            <div className='flex flex-col items-center gap-12'>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/RsTF4kilBkM?si=BXYgryRp6v3QGybo" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <p className="text-xl font-bold">Conversation Editor</p>
            </div>
            <div className='flex flex-col items-center gap-12'>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/-PYms6pAjJ8?si=4QfrToWyuXe1ziWK" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <p className="text-xl font-bold">Node Types</p>
            </div>
      </div>
    );
};

export default Tutorial;
