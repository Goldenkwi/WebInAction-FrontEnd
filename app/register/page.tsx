import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
			<AuthForm mode="register" />
		</main>
	);
}
