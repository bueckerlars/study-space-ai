import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Project } from "@/types";
import { Button } from "../ui/button";
import { updateProjectRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";

type EditProjectTitleDialogProps = {
    project?: Project | null;
    open: boolean;
    onOpenChanged: (open: boolean) => void;
    onProjectUpdated: () => void; // new prop
};

const EditProjectTitleDialog = ({ project, open, onOpenChanged, onProjectUpdated } : EditProjectTitleDialogProps) => {
    const { authToken } = useAuth();
    const [title, setTitle] = useState<string>(project ? project.name : "Untitled");

    useEffect(() => {
        setTitle(project ? project.name : "Untitled");
    }, [project]);

    const handleSubmit = async () => {
        await updateProjectRequest(authToken!, project!.project_id!, { name: title });
        onProjectUpdated(); // trigger refetch
        onOpenChanged(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChanged}>
            <DialogContent>
                <DialogTitle className="flex flex-row items-center gap-2"><Edit/> Project Title</DialogTitle>
                <DialogDescription>Change the title of the project</DialogDescription>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                />
                <DialogFooter className="flex flex-row justify-end">
                    <Button onClick={() => onOpenChanged(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EditProjectTitleDialog;