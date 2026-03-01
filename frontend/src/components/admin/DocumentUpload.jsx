import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className="space-y-6">
            {/* Drop zone */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${isDragging
                    ? 'border-primary-400 bg-primary-50 scale-105 shadow-md shadow-primary-500/10'
                    : 'border-slate-300 bg-white/50 hover:border-primary-300 hover:bg-slate-50 hover:shadow-sm'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    accept={FILE_UPLOAD.ALLOWED_EXTENSIONS.join(',')}
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <motion.div
                    animate={isDragging ? { y: -10 } : { y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className={`mx-auto w-20 h-20 mb-5 rounded-full flex items-center justify-center shadow-inner transition-colors ${isDragging ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                        <Upload size={32} />
                    </div>
                </motion.div>

                <p className="text-slate-700 font-bold text-lg">
                    Drag and drop files here
                </p>
                <p className="text-slate-500 font-medium mt-1 mb-4">
                    or click to browse
                </p>

                <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-500 font-medium text-xs px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Supported: PDF, TXT, MD</span>
                    <span className="mx-1 text-slate-300">|</span>
                    <span>Max: {FILE_UPLOAD.MAX_SIZE_MB}MB</span>
                </div>
            </motion.div>

            {/* Uploading files list */}
            <AnimatePresence>
                {uploadingFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 mt-6"
                    >
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Upload Status</h3>
                        {uploadingFiles.map((file) => (
                            <motion.div
                                key={file.id}
                                layout
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`flex items-center justify-between p-4 rounded-xl border shadow-sm transition-colors ${file.status === 'success' ? 'bg-emerald-50 border-emerald-200' :
                                        file.status === 'error' ? 'bg-red-50 border-red-200' :
                                            'bg-white border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2.5 rounded-lg ${file.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                            file.status === 'error' ? 'bg-red-100 text-red-600' :
                                                'bg-slate-100 text-slate-500'
                                        }`}>
                                        <File size={20} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${file.status === 'success' ? 'text-emerald-800' :
                                                file.status === 'error' ? 'text-red-800' :
                                                    'text-slate-700'
                                            }`}>{file.name}</p>
                                        <div className="flex items-center space-x-2 mt-0.5">
                                            <p className="text-xs font-semibold text-slate-400">{formatFileSize(file.size)}</p>
                                            {file.status === 'uploading' && (
                                                <span className="text-[10px] font-bold text-primary-600 bg-primary-100 px-1.5 py-0.5 rounded tracking-wide uppercase">Uploading...</span>
                                            )}
                                            {file.status === 'error' && file.error && (
                                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded tracking-wide truncate max-w-[150px]">{file.error}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {file.status === 'uploading' && (
                                        <div className="bg-primary-50 p-1.5 rounded-full">
                                            <Loader2 size={18} className="text-primary-500 animate-spin" />
                                        </div>
                                    )}
                                    {file.status === 'success' && (
                                        <div className="bg-emerald-100 p-1.5 rounded-full">
                                            <Check size={18} className="text-emerald-600" />
                                        </div>
                                    )}
                                    {file.status === 'error' && (
                                        <div className="bg-red-100 p-1.5 rounded-full">
                                            <AlertCircle size={18} className="text-red-500" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors focus:ring-2 focus:ring-slate-300"
                                        title="Remove"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentUpload;
