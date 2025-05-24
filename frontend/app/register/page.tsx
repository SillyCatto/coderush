import { ScanFace } from "lucide-react"
import { RegisterForm } from "@/app/components/register-form"

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="/" className="flex items-center gap-2 self-center font-medium text-foreground transition-colors hover:text-primary">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <ScanFace className="size-4" />
                    </div>
                    <span className="font-semibold">Register on Campus++</span>
                </a>
                <RegisterForm />
            </div>
        </div>
    )
}