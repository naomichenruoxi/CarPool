import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
    const { user, mockLogin } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard"); // Redirect to dashboard if logged in
        }
    }, [user, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md card-shadow">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold font-display">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        theme="default"
                        providers={["google"]} // Users can still use Google if configured in Supabase Dashboard
                        // Email/Password is enabled by default in Supabase Auth UI, but let's be explicit if needed or just rely on defaults.
                        // Actually, 'providers' controls social providers. Email is controlled by other props or enabled by default if not turned off.
                        // To allow email, we just ensure it's not hidden.
                        redirectTo={window.location.origin}
                    />
                </CardContent>
            </Card>

            {/* Dev Login Buttons */}
            {import.meta.env.DEV && (
                <Card className="absolute top-4 right-4 w-64 card-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold">Dev Mode Login</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <button
                            onClick={() => mockLogin("mock-driver-alice", "Alice Driver")}
                            className="bg-emerald-600 text-white p-2 rounded text-sm hover:bg-emerald-700 transition"
                        >
                            Login as Driver (Alice)
                        </button>
                        <button
                            onClick={() => mockLogin("mock-passenger-bob", "Bob Passenger")}
                            className="bg-blue-600 text-white p-2 rounded text-sm hover:bg-blue-700 transition"
                        >
                            Login as Passenger (Bob)
                        </button>
                        <button
                            onClick={() => mockLogin("mock-driver-charlie", "Charlie Driver")}
                            className="bg-emerald-600 text-white p-2 rounded text-sm hover:bg-emerald-700 transition"
                        >
                            Login as Driver (Charlie)
                        </button>
                        <button
                            onClick={() => mockLogin("mock-passenger-david", "David Passenger")}
                            className="bg-blue-600 text-white p-2 rounded text-sm hover:bg-blue-700 transition"
                        >
                            Login as Passenger (David)
                        </button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Login;
