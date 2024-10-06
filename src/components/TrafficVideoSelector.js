import React, { useEffect, useState } from 'react';
import Base from './Base';
import Textbox from './Textbox';
import NameDisplay from './NameDisplay';
import ActionButtons from './ActionButtons';
import ToggleButton from './ToggleButton';
import axios from 'axios';

const base_url = process.env.REACT_APP_BACKEND_API

const TrafficVideoSelector = () => {

    const [folder, setFolder] = useState(null);
    const [files, setFiles] = useState(null);
    const [isOpen, setOpen] = useState(false);
    const [showNameDisplay, setShowNameDisplay] = useState(true);
    const [rectangle_markers, set_rectangle_markers] = useState([]);
    const [isStartDisable, setIsStartDisable] = useState(false)




    const handleReset = (checked) => {
        set_rectangle_markers([])
        setOpen(false);
        setFolder(null);
        setFiles(null);
    };

    const handleToggle = () => {
        setShowNameDisplay(prev => !prev);
    };
    const send_co_ordinates = async (flattenedData) => {
        try {
            console.log(rectangle_markers);
            const response = await axios.post(`https://traffics.free.beeceptor.com/lanes/quadrilaterall`, flattenedData)
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {


        if (!rectangle_markers?.length) {
            setIsStartDisable(true);
            return
        }


        if ([].concat(...rectangle_markers.map(obj => Object.values(obj)))?.length % 4 == 0) {
            
            
            setIsStartDisable(false);
            return
        }
        else {

            setIsStartDisable(true)
        }


    }, [rectangle_markers])


    const handleStart = () => {

        const flattenedData = [].concat(...rectangle_markers.map(obj => Object.values(obj)));
        if (flattenedData.length) {
            send_co_ordinates(flattenedData)
        }
    }


    return (
        <div className="h-full w-full md:grid grid-cols-12 gap-4 p-[2vh] lg:px-[10%]">
            <div className="col-span-8 bg-white shadow-md h-[77vh] p-4">
                <Base markers_={rectangle_markers} setMarkers_={set_rectangle_markers} directorySetter={setFolder} files={files} setFiles={setFiles} />
            </div>
            <div className="hidden md:block col-span-4 bg-gray-200 shadow-md h-[77vh] overflow-y-scroll p-4">
                <Textbox rectangle_markers={rectangle_markers} setRectangleMarkers={set_rectangle_markers} />
            </div>
            <div className="relative col-span-8 bg-light-1 bg-opacity-20 shadow-md h-[17vh] p-4">
                <ToggleButton onClick={handleToggle} />
                {showNameDisplay ? (
                    <NameDisplay folder={folder} isOpen={isOpen} setOpen={setOpen} />
                ) : (
                    <div className='md:hidden'>
                        <ActionButtons handleReset={handleReset} />
                    </div>
                )}
            </div>
            <div className="hidden md:block col-span-4 bg-light-1 bg-opacity-20 shadow-md h-[17vh] p-4">
                <ActionButtons disableStatus={isStartDisable} handleReset={handleReset} handleStart={handleStart} />
            </div>
        </div>
    );
};

export default TrafficVideoSelector;