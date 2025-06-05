"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppShell } from "@/components/app-shell"
import { isProd } from "@/lib/utils"
import { useSignIn } from "@/hooks/use-sign-in"

interface SignInForm {
  email: string
  password: string
}

export default function SignInPage() {
  const { signIn, isPending, error } = useSignIn()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    defaultValues: {
      email: isProd() ? "" : "john.doe@email.com",
      password: isProd() ? "" : "adminadmin",
    },
    mode: "onBlur",
  })

  const onSubmit = async (data: SignInForm) => signIn({
    email: data.email,
    password: data.password,
  })

  return (
    <AppShell mode="noAuthOnly">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!!error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error?.message || "Wrong email or password"}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="teacher@example.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
              <br />
              <span className="text-gray-600">{"Don't have an account? "}</span>
              <Link href="/auth/sign-up" className="text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </div>

            {/* <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Demo credentials:</strong>
                <br />
                Email: teacher@example.com
                <br />
                Password: password
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
