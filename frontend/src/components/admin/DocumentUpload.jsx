import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { formatFileSize, isFileAllowed, parseErrorMessage } from '../../utils/helpers';
import { FILE_UPLOAD } from '../../utils/constants';
import { documentsAPI } from '../../api/axios';
import toast from 'react-hot-toast';

const DocumentUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, []);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
        e.target.value = ''; // Reset input
    };

    const handleFiles = async (files) => {
        for (const file of files) {
            // Validate file type
            if (!isFileAllowed(file.name, FILE_UPLOAD.ALLOWED_EXTENSIONS)) {
                toast.error(`Invalid file type: ${file.name}. Allowed: ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`);
                continue;
            }

            // Validate file size
            if (file.size > FILE_UPLOAD.MAX_SIZE_BYTES) {
                toast.error(`File too large: ${file.name}. Max size: ${FILE_UPLOAD.MAX_SIZE_MB}MB`);
                continue;
            }

            // Add to uploading list
            const fileId = Date.now() + Math.random();
            setUploadingFiles(prev => [...prev, {
                id: fileId,
                name: file.name,
                size: file.size,
                status: 'uploading',
                progress: 0,
            }]);

            try {
                const response = await documentsAPI.upload(file);

                setUploadingFiles(prev => prev.map(f =>
                    f.id === fileId
                        ? { ...f, status: response.data.success ? 'success' : 'error' }
                        : f
                ));

                if (response.data.success) {
                    toast.success(`Uploaded: ${file.name}`);
                    if (onUploadSuccess) onUploadSuccess();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                setUploadingFiles(prev => prev.map(f =>
                    f.id === fileId
                        ? { ...f, status: 'error', error: parseErrorMessage(error) }
                        : f
                ));
                toast.error(`Failed to upload ${file.name}`);
            }
        }
    };

    const removeFile = (fileId) => {
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
    };

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                        ? 'border-primary-400 bg-primary-500/10'
                        : 'border-dark-600 hover:border-dark-500'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    accept={FILE_UPLOAD.ALLOWED_EXTENSIONS.join(',')}
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <Upload
                    size={40}
                    className={`mx-auto mb-4 ${isDragging ? 'text-primary-400' : 'text-dark-400'}`}
                />

                <p className="text-dark-200 font-medium">
                    Drag and drop files here
                </p>
                <p className="text-dark-400 text-sm mt-1">
                    or click to browse
                </p>
                <p className="text-dark-500 text-xs mt-3">
                    Supported: PDF, TXT, MD (Max {FILE_UPLOAD.MAX_SIZE_MB}MB)
                </p>
            </div>

            {/* Uploading files list */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                    {uploadingFiles.map((file) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-dark-800 border border-dark-700"
                        >
                            <div className="flex items-center space-x-3">
                                <File size={20} className="text-dark-400" />
                                <div>
                                    <p className="text-sm text-white">{file.name}</p>
                                    <p className="text-xs text-dark-400">{formatFileSize(file.size)}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {file.status === 'uploading' && (
                                    <Loader2 size={18} className="text-primary-400 animate-spin" />
                                )}
                                {file.status === 'success' && (
                                    <Check size={18} className="text-green-400" />
                                )}
                                {file.status === 'error' && (
                                    <AlertCircle size={18} className="text-red-400" />
                                )}
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="p-1 rounded hover:bg-dark-700 text-dark-400 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
