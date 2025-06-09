"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCircle } from '@fortawesome/free-solid-svg-icons';

const Snackbar = ({ content, onEdit, onRemove }) => (
    <div className="border-2 border-black dark:border-white px-4 py-1 rounded-full mb-1 mx-1 cursor-pointer flex justify-between items-center text-sm hover:bg-blue-700 hover:text-white hover:border-blue-400 hover:border-blue-900">
        <div className="px-1" onClick={onEdit}>
            {content.adminState ? (<FontAwesomeIcon icon={faCircle} className={content.adminState === 'enable' ? 'text-green-500' : content.adminState === 'offline' ? 'text-gray-400' : 'text-red-500'} />) : ''} {' '}
            {content.name ? content.name : `${content.serverAddress}:${content.servicePort}`}
        </div>
        <div className="flex gap-1">
            <button type="button" onClick={onEdit} className="dark:text-white w-6 h-6 flex items-center justify-center cursor-pointer">
                <FontAwesomeIcon icon={faEdit} />
            </button>
            <button type="button" onClick={onRemove} className="dark:text-white w-6 h-6 flex items-center justify-center cursor-pointer">
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    </div>
);

export default Snackbar; 