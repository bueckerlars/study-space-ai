import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { 
    createSourceRequest, 
    uploadFileRequest,
    updateSourceRequest,
    getSourcesByProjectRequest
} from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { Source } from "@/types/Source";

interface AddSourcesDialogProps {
    projectId?: string;
}

const AddSourcesDialog = ({ projectId }: AddSourcesDialogProps) => {
    const { authToken, user } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [sourcesInProject, setSourcesInProject] = useState<Source[]>([]);
    const [sourcesLoaded, setSourcesLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [showButtonText, setShowButtonText] = useState(true);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [combinedFileCount, setCombinedFileCount] = useState(0);
    const MAX_FILES = 10;

    // Check if dialog should be opened automatically
    useEffect(() => {
        if (sourcesLoaded && sourcesInProject.length === 0) {
            setOpen(true);
        }
    }, [sourcesLoaded, sourcesInProject]);

    useEffect(() => {
        const fetchSources = () => {
            if (!authToken || !projectId) return;
            getSourcesByProjectRequest(authToken, projectId).then((response) => {
                // Filter sources by project ID
                const projectSources: Source[] = response.data.data;
                setSourcesInProject(projectSources);
                setSourcesLoaded(true);
            }).catch((error) => {
                console.error(error);
                setSourcesLoaded(true);
            });
        };
        fetchSources();
    }, [open, authToken, projectId]);

    useEffect(() => {
        setCombinedFileCount(files?.length + sourcesInProject?.length);
    }, [sourcesInProject, files]);

    // Check button width on mount and resize
    useEffect(() => {
        const checkButtonWidth = () => {
            if (buttonRef.current) {
                setShowButtonText(buttonRef.current.offsetWidth >= 200);
            }
        };

        // Initial check
        checkButtonWidth();

        // Set up resize observer
        const resizeObserver = new ResizeObserver(checkButtonWidth);
        if (buttonRef.current) {
            resizeObserver.observe(buttonRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Filter for supported file types
        const validFiles = acceptedFiles.filter(file => {
            const extension = file.name.split('.').pop()?.toLowerCase();
            return extension === 'txt' || extension === 'md' || extension === 'pdf';
        });

        // Check if adding these files would exceed the limit
        if (files.length + validFiles.length <= MAX_FILES) {
            setFiles(prev => [...prev, ...validFiles]);
        } else {
            // Only add files up to the limit
            const availableSlots = MAX_FILES - files.length;
            if (availableSlots > 0) {
                setFiles(prev => [...prev, ...validFiles.slice(0, availableSlots)]);
                alert(`Only added ${availableSlots} files. Maximum limit of ${MAX_FILES} files reached.`);
            } else {
                alert(`Maximum limit of ${MAX_FILES} files reached.`);
            }
        }
    }, [files]);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
            'application/pdf': ['.pdf'],
        },
        disabled: combinedFileCount >= MAX_FILES
    });

    // Calculate progress percentage
    const progressPercentage = (combinedFileCount / MAX_FILES) * 100;

    const handleOnSubmit = async () => {
        if (!authToken || !user || !projectId) return;
        
        try {
            // Process each file sequentially
            for (const file of files) {
                // 1. Create a new source for the file
                const sourceResponse = await createSourceRequest(authToken, {
                    project_id: projectId,
                    status: 'pending'
                });
                
                console.log("SourceResponse", sourceResponse.data.data);
                console.log("SourceResponseData", sourceResponse.data.data);
                const sourceId = sourceResponse.data.data.source_id;
                
                // 2. Upload the file
                const uploadResponse = await uploadFileRequest(
                    authToken, 
                    file, 
                    user.user_id!, 
                    projectId
                );
                
                const fileId = uploadResponse.data.file_id;
                console.log("UploadResponse", uploadResponse);
                console.log("FileId", fileId);
                // 3. Update the source with the file ID and status
                await updateSourceRequest(authToken, sourceId, { source_id: sourceId, source_file_id: fileId, status: 'uploaded' });
            }
            
            // Clear files and close dialog
            setFiles([]);
            setOpen(false);
        } catch (error) {
            console.error('Error uploading files and creating sources:', error);
            alert('An error occurred while uploading files. Please try again.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button ref={buttonRef} variant="outline" className="w-full">
                    <PlusIcon className="h-4 w-4" /> 
                    {showButtonText && <span className="ml-2">Add Sources</span>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                <DialogTitle>Add Sources</DialogTitle>
                <DialogDescription>
                    Based on the sources, StudySpace.AI can take into account the most important information for you in the answers.
                    (Examples: course readings, research notes, meeting minutes)
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div 
                        {...getRootProps()} 
                        className={`border-2 border-dashed rounded-md p-6 text-center ${files.length >= MAX_FILES ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'} ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
                    >
                        <input {...getInputProps()} />
                        <UploadIcon className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm font-medium">
                            {files.length >= MAX_FILES 
                                ? 'Maximum file limit reached' 
                                : isDragActive 
                                    ? 'Drop the files here' 
                                    : 'Drag and drop files here, or click to select files'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Supported formats: .txt, .md, .pdf
                        </p>
                    </div>


                    <div className="mt-4">
                        {files.length > 0 && (<div>
                            <h4 className="mb-2 text-sm font-medium">Selected Files:</h4>
                            <Table className="w-full">
                                <TableBody>
                                    {files.map((file, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="truncate max-w-[90%]">{file.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="sm" onClick={() => removeFile(index)}>
                                                    <XIcon className="h-4 w-4" /> Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>)}
                        
                        <div className="mt-4 space-y-2 mt-12">
                            <div className="flex justify-between text-sm">
                                <span>File limit: {combinedFileCount} of {MAX_FILES}</span>
                                <span>{combinedFileCount === MAX_FILES ? 'Maximum reached' : `${MAX_FILES - combinedFileCount} slots remaining`}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>
                    </div>

                </div>
                <DialogFooter>
                    <Button type="submit" disabled={files.length === 0} onClick={handleOnSubmit}>
                        Upload and Process
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddSourcesDialog;