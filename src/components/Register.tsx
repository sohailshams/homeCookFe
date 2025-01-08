import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
const Register: React.FC = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-blue-500 font-semibold pl-2">
        register
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create your account</AlertDialogTitle>
          <AlertDialogDescription>
            <form className="flex flex-col" action="">
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Password" />
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <button type="submit">Register</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default Register;
