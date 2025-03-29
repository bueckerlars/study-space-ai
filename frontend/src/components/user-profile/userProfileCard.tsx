import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { useAuth } from "@/provider/AuthProvider";

const UserProfileCard = () => { 
    const { user } = useAuth();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">User Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-row items-center space-x-2">
                    <Avatar>
                        <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Label>{user?.username || "Unknown User"}</Label>
                </div>
                <p>Email: {user?.email || "No email provided"}</p>
            </CardContent>
        </Card>
    );
}

export default UserProfileCard;