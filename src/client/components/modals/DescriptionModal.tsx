interface DescriptionModalProps {
    description: string;
    onClose: () => void;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ description, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative overflow-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700">{description}</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default DescriptionModal;
