import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/"); // Redirect to home if logged in
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
        </div>
    );
};

export default Login;
