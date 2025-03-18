import { Project } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { PlusIcon } from "lucide-react";

//@ts-ignore
const ChatCard: React.FC<{project: Project}> = ({ project }) => {

    return (
        <Card className='flex-col w-full h-full min-h-0 flex-2'>
            <CardHeader className="justify-between flex-row items-center">
            <CardTitle>Chat</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1">
            <div className="flex flex-col gap-2 h-full justify-center items-center text-gray-400">
                <p className="text-gray-400 text-xl">Add Sources to begin a Chat</p>
            </div>
            </CardContent>
            <CardFooter>
            <Card className="w-full flex flex-row p-2">
                <Input placeholder='Add Source to begin a chat' className='flex-90'/>
                <Button className='flex-10'><PlusIcon size={25}></PlusIcon></Button>
            </Card>
            </CardFooter>
        </Card>
    );
}

export default ChatCard;