import { Car } from "lucide-react";

export const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500">
            {/* Background Gradient Mesh (Subtle) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Animation */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <img
                        src="/logo_final.png?v=3"
                        alt="Loading..."
                        className="relative h-24 w-24 rounded-full shadow-2xl animate-bounce object-cover"
                        style={{ animationDuration: '2s' }}
                    />
                </div>

                {/* Loading Text */}
                <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent animate-pulse">
                    Starting your journey...
                </h2>

                {/* Driving Car Progress Bar */}
                <div className="mt-8 relative w-64 h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-primary to-emerald-500 origin-left animate-[progress_2s_ease-in-out_forwards]" />
                </div>
            </div>
        </div>
    );
};
