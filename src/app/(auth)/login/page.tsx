// "use client" means this component runs in the browser, not on the server.
// We need this because we're using form state, onClick handlers, etc.
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GithubIcon from "@/components/icons/githubicon";
import GoogleIcon from "@/components/icons/googleicon";

export default function LoginPage() {
  // useRouter lets us navigate programmatically (e.g., after login, go to /dashboard)
  const router = useRouter();

  // useSearchParams reads the URL query string — we use it to get ?callbackUrl=
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  // Local state for the error message and loading spinner
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // useForm gives us everything we need to manage the form.
  // resolver: zodResolver(loginSchema) connects Zod validation to the form.
  const {
    register, // connect inputs to the form
    handleSubmit, // wraps your submit function with validation
    formState: { errors }, // contains validation errors
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // This runs when the form is submitted AND all validation passes
  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    // signIn() from next-auth handles the actual login request.
    // provider: "credentials" = email + password
    // redirect: false = don't redirect automatically, let us handle it
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      // Map our custom error codes to human-readable messages
      if (result.error === "TOO_MANY_ATTEMPTS") {
        setError("Too many login attempts. Please wait 15 minutes.");
      } else {
        setError("Invalid email or password.");
      }
      return;
    }

    // Login successful — go to the page they originally wanted (or dashboard)
    router.push(callbackUrl);
    router.refresh(); // refresh server components with the new session
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col min-w-sm border my-auto gap-2 px-4">
        <h1 className="text-center text-lg font-bold">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center text-sm">Or Login using</p>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl })}
            className="h-14 w-14 cursor-pointer p-2 flex items-center justify-center overflow-hidden"
          >
            <span className="w-full h-full flex items-center justify-center">
              <GoogleIcon />
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("github", { callbackUrl })}
            className="h-14 w-14 cursor-pointer p-2 flex items-center justify-center overflow-hidden"
          >
            <span className="w-full h-full flex items-center justify-center">
              <GithubIcon />
            </span>
          </Button>
        </div>
        <p className="text-center text-sm">
          Don't have an account?
          <Link href="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// {/* <Card className="w-full max-w-md">
//                 <CardHeader className="space-y-1">
//                     <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
//                     <CardDescription>Sign in to your budget app</CardDescription>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                     {/* Show error message if login failed */}
//                     {error && (
//                         <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
//                             {error}
//                         </div>
//                     )}

//                     {/* OAuth buttons */}
//                     <div className="grid grid-cols-2 gap-3">
//                         <Button
//                             variant="outline"
//                             onClick={() => signIn("google", { callbackUrl })}
//                             disabled={isLoading}
//                         >
//                             {/* Simple Google "G" text logo */}
//                             <span className="mr-2 font-bold text-blue-500">G</span>
//                             Google
//                         </Button>
//                         <Button
//                             variant="outline"
//                             onClick={() => signIn("github", { callbackUrl })}
//                             disabled={isLoading}
//                         >
//                             <span className="mr-2">⌥</span>
//                             GitHub
//                         </Button>
//                     </div>

//                     {/* Divider */}
//                     <div className="relative">
//                         <div className="absolute inset-0 flex items-center">
//                             <span className="w-full border-t" />
//                         </div>
//                         <div className="relative flex justify-center text-xs uppercase">
//                             <span className="bg-background px-2 text-muted-foreground">
//                                 Or continue with email
//                             </span>
//                         </div>
//                     </div>

//                     {/* Email + password form */}
//                     {/* handleSubmit(onSubmit) = validate first, then call onSubmit */}
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="email">Email</Label>
//                             {/* register("email") connects this input to react-hook-form */}
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 placeholder="you@example.com"
//                                 {...register("email")}
//                                 disabled={isLoading}
//                             />
//                             {/* Show validation error if email is invalid */}
//                             {errors.email && (
//                                 <p className="text-sm text-destructive">{errors.email.message}</p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="password">Password</Label>
//                             <Input
//                                 id="password"
//                                 type="password"
//                                 placeholder="••••••••"
//                                 {...register("password")}
//                                 disabled={isLoading}
//                             />
//                             {errors.password && (
//                                 <p className="text-sm text-destructive">{errors.password.message}</p>
//                             )}
//                         </div>

//                         <Button type="submit" className="w-full" disabled={isLoading}>
//                             {isLoading ? "Signing in..." : "Sign in"}
//                         </Button>
//                     </form>
//                 </CardContent>

//                 <CardFooter>
//                     <p className="text-sm text-muted-foreground text-center w-full">
//                         Don't have an account?{" "}
//                         <Link href="/register" className="text-primary hover:underline font-medium">
//                             Create one
//                         </Link>
//                     </p>
//                 </CardFooter>
//             </Card> */}
