"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"

export const ClientComponent = () => {
  const supabase = createClientComponentClient()
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    const { data, error } = await supabase.from("users").select("*")
    setUsers(data)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return <h2>This is a client component</h2>
}