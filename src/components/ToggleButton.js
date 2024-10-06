const ToggleButton = ({ onClick }) => {
    return (
        <button
            className='md:hidden p-1 bg-light-1 rounded-md shadow-lg absolute right-1 top-1 transform transition-transform duration-500 hover:scale-105 active:scale-95'
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
            </svg>
        </button>
    );
};
export default ToggleButton