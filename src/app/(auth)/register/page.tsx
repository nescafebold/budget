"use client";

import GoogleIcon from "@/components/icons/googleicon";
import GithubIcon from "@/components/icons/githubicon";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validations";
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

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    // Call our register API route we built in Step 9
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      // Handle both string errors and field-specific errors
      setError(
        typeof result.error === "string"
          ? result.error
          : "Registration failed. Please check your details.",
      );
      setIsLoading(false);
      return;
    }

    // Registration successful — automatically sign them in so they don't
    // have to log in manually right after creating an account
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col min-w-sm border my-auto gap-2 px-4">
        <h1 className="text-center text-lg font-bold">Signup</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Juan dela Cruz"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
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
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="text-center text-sm">Or Signup using</p>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="h-14 w-14 cursor-pointer p-2 flex items-center justify-center overflow-hidden"
          >
            <span className="w-full h-full flex items-center justify-center">
              <GoogleIcon />
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="h-14 w-14 cursor-pointer p-2 flex items-center justify-center overflow-hidden"
          >
            <span className="w-full h-full flex items-center justify-center">
              <GithubIcon />
            </span>
          </Button>
        </div>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
{
  /* <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>Start tracking your money today</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
                            <span className="mr-2 font-bold text-blue-500">G</span> Google
                        </Button>
                        <Button variant="outline" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
                            <span className="mr-2">⌥</span> GitHub
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or register with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>
                            <Input id="name" placeholder="Juan dela Cruz" {...register("name")} disabled={isLoading} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} disabled={isLoading} />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" {...register("password")} disabled={isLoading} />
                            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <p className="text-sm text-muted-foreground text-center w-full">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card> */
}
