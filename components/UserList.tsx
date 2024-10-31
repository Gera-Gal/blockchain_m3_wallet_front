'use client'

import React, { useState, useEffect } from 'react'

export default function UserList() {
  const [users, setUsers] = useState<Array<{ id: number; username: string }>>([])

  useEffect(() => {
    // Simulating an API call to fetch users
    const fetchUsers = async () => {
      try {
        // In a real application, you would fetch data from an API here
        // For now, we'll use a setTimeout to simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUsers = [
          { id: 1, username: 'user1' },
          { id: 2, username: 'user2' },
          { id: 3, username: 'user3' },
        ]
        setUsers(mockUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Usuarios Registrados</h2>
      {users.length > 0 ? (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="text-gray-700">
              {user.username}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No hay usuarios registrados aún.</p>
      )}
    </div>
  )
}