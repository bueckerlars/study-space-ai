import React, { useState, useEffect, useRef } from "react"
import { useAuth } from "@/provider/AuthProvider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"

const LoginPage: React.FC = () => {
  const { login, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  
  // Focus email field on component mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus()
    }
  }, [])
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate("/app") // Redirect after successful login
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                ref={emailRef}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" variant="default" className="w-full">
              Login
            </Button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
