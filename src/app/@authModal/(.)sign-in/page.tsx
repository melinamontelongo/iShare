import CloseModal from "@/components/ui/CloseModal";
import SignIn from "@/components/auth/SignIn";

export default function SignInModal() {
    return (
        <div className="fixed inset-0 bg-zinc-900/20 z-50">
            <div className="container flex items-center h-full max-w-lg mx-auto">
                <div className="relative bg-zinc-50 dark:bg-zinc-950 w-full h-fit py-10 px-2 rounded-lg">
                    <div className="absolute top-4 right-4">
                        <CloseModal />
                    </div>
                    <SignIn />
                </div>
            </div>
        </div>
    )
}