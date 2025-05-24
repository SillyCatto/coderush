"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    dob: "",
    university: "",
    department: "",
    program: "",
    year: "",
  })

  const universityEmailRegex = /@(iut-dhaka\.edu|du\.ac\.bd|cu\.ac\.bd|ku\.ac\.bd|ru\.ac\.bd|ju\.ac\.bd|nstu\.edu\.bd|bracu\.ac\.bd|nsu\.edu\.bd|aiub\.edu|ewubd\.edu|iub\.edu\.bd|aust\.edu|uoda\.edu\.bd|diu\.edu\.bd|uap-bd\.edu|uiu\.ac\.bd|sau\.edu\.bd|lus\.ac\.bd|sub\.edu\.bd|pstu\.ac\.bd|hstu\.ac\.bd|mstu\.edu\.bd|bsmrstu\.edu\.bd|bup\.edu\.bd|duet\.ac\.bd|just\.edu\.bd|ruet\.ac\.bd|kuet\.ac\.bd|cuet\.ac\.bd|buet\.ac\.bd)$/i

  const isEmailValid = universityEmailRegex.test(formData.email)
  const isFormValid =
    isEmailValid &&
    formData.password.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.dob.trim() !== ""

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const requiredLabel = (text: string) => (
    <span>
      {text} <span className="text-red-500">*</span>
    </span>
  )

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>
            Sign up using your official university email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              {/* Required Fields */}
              <div className="grid gap-2">
                <Label htmlFor="email">{requiredLabel("Email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@iut-dhaka.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {!isEmailValid && formData.email !== "" && (
                  <p className="text-sm text-red-500">
                    Please enter a valid university email address.
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">{requiredLabel("Password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">{requiredLabel("Phone Number")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dob">{requiredLabel("Date of Birth")}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

             
              <div className="grid gap-2">
                <Label htmlFor="university">{requiredLabel("University")}</Label>
                <Input
                  id="university"
                  type="text"
                  placeholder="e.g. IUT"
                  value={formData.university}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="department">{requiredLabel("Department")}</Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="e.g. CSE"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="program">{requiredLabel("Program")}</Label>
                <Input
                  id="program"
                  type="text"
                  placeholder="e.g. BSc"
                  value={formData.program}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="year">{requiredLabel("Year of Study")}</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g. 2"
                  value={formData.year}
                  onChange={handleChange}
                  min={1}
                  max={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={!isFormValid}>
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
 
    </div>
  )
}
