const Tutorial = () => {
    return (
        <div className="flex flex-row gap-12 w-full h-full text-white py-12">
            <div className='flex flex-col items-center gap-12'>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/MFBt7rCcFBo?si=ELvIXGQgtHAaivFf" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <p className="text-xl font-bold">How to create a conversation.</p>
            </div>
            <div className='flex flex-col items-center gap-12'>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/7B44gyvBsTA?si=9sfIDOqeYmC5jqsC" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <p className="text-xl font-bold">How does the plugin work.</p>
            </div>
      </div>
    );
};

export default Tutorial;
