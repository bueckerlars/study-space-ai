import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";

interface AddSourcesDialogProps {
    projectName?: string;
}

const AddSourcesDialog = ({ projectName }: AddSourcesDialogProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);
    const [showButtonText, setShowButtonText] = useState(true);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const MAX_FILES = 10;

    // Check if dialog should be opened automatically
    useEffect(() => {
        if (projectName === "Untitled") {
            setOpen(true);
        }
    }, [projectName]);

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
        disabled: files.length >= MAX_FILES
    });

    // Calculate progress percentage
    const progressPercentage = (files.length / MAX_FILES) * 100;

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
                                <span>File limit: {files.length} of {MAX_FILES}</span>
                                <span>{files.length === MAX_FILES ? 'Maximum reached' : `${MAX_FILES - files.length} slots remaining`}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>
                    </div>

                </div>
                <DialogFooter>
                    <Button type="submit" disabled={files.length === 0}>
                        Upload and Process
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddSourcesDialog;