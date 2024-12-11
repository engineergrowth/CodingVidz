import React from "react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    postTitle: string | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> =
    ({
         isOpen,
         onClose,
         onConfirm,
         postTitle,
     }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete <strong>{postTitle}</strong>? This action cannot
                    be undone.
                </p>
                <div className="flex justify-between">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;