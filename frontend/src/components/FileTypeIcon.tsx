import { FileText, FileJson, File } from "lucide-react";

const FileTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "application/pdf":
        return <FileText className="h-5 w-5 text-red-500"/>;
      case "text/markdown":
        return <FileJson className="h-5 w-5 text-blue-500"/>;
      case "text/plain":
        return <File className="h-5 w-5 text-gray-500" />;
      default:
        return <File className="h-5 w-5"/>;
    }
};

export default FileTypeIcon;