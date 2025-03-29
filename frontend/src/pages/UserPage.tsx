import ChangePasswordForm from "@/components/user-profile/change-password-form";
import UserProfileCard from "@/components/user-profile/userProfileCard";

const UserPage = () => {

    return (
        <div className="flex flex-col gap-4">
            <UserProfileCard />
            <ChangePasswordForm />
        </div>
    );
};

export default UserPage;