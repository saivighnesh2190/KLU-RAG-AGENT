import { useState, useCallback, useEffect } from 'react';
import { documentsAPI } from '../api/axios';
import { parseErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

/**
 * Custom hook for document management
 */
const useDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch documents list
    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await documentsAPI.list();
            setDocuments(response.data || []);
        } catch (err) {
            setError(parseErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch stats
    const fetchStats = useCallback(async () => {
        try {
            const response = await documentsAPI.getStats();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, []);

    // Upload document
    const uploadDocument = useCallback(async (file) => {
        try {
            const response = await documentsAPI.upload(file);

            if (response.data.success) {
                toast.success(`Uploaded: ${file.name}`);
                fetchDocuments();
                fetchStats();
                return { success: true, document: response.data.document };
            } else {
                toast.error(response.data.message);
                return { success: false, error: response.data.message };
            }
        } catch (err) {
            const errorMessage = parseErrorMessage(err);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, [fetchDocuments, fetchStats]);

    // Delete document
    const deleteDocument = useCallback(async (docId) => {
        try {
            await documentsAPI.delete(docId);
            toast.success('Document deleted');
            fetchDocuments();
            fetchStats();
            return { success: true };
        } catch (err) {
            const errorMessage = parseErrorMessage(err);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, [fetchDocuments, fetchStats]);

    // Load on mount
    useEffect(() => {
        fetchDocuments();
        fetchStats();
    }, [fetchDocuments, fetchStats]);

    return {
        documents,
        stats,
        isLoading,
        error,
        fetchDocuments,
        fetchStats,
        uploadDocument,
        deleteDocument,
    };
};

export default useDocuments;
