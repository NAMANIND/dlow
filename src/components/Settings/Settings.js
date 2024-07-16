import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Settings(userData) {
  const user = userData.userData;

  return (
    <section className="bg-background rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-100/40 dark:bg-gray-800/40 p-6 flex items-center gap-4">
        <Avatar className="h-24 w-24 ">
          <AvatarImage className="object-cover" src={user.profilePictureUrl} />
          <AvatarFallback>
            {user.firstName.charAt(0) + user.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-secondary-foreground">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-secondary-foreground">{user.username}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 p-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">ID</p>
          <p className="text-base text-foreground">{user.id}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Date of Birth
          </p>
          <p className="text-base text-foreground">{user.dob}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-base text-foreground">{user.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Gender</p>
          <p className="text-base text-foreground">{user.gender}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Phone</p>
          <p className="text-base text-foreground">{user.phone}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">UPI ID</p>
          <p className="text-base text-foreground">{user.upi}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Account No.
          </p>
          <p className="text-base text-foreground">{user.id}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
          <p className="text-base text-foreground">{user.phone}</p>
        </div>
      </div>
    </section>
  );
}
