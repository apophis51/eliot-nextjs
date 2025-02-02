
'use client'

import { User } from '@prisma/client'
import { getAllUsers } from './databaseAction'
import { useState } from 'react'


export default function DataBaseViewer() {
    const [users, setUsers] = useState<User[]>([])

    async function buttonHandler() {
        const users = await getAllUsers()
        setUsers(users)
    }

    return (
        <>
            <button onClick={buttonHandler}>View all Users</button>
            {users && users.map((user) => {
                return (
                    <div key={user.id}>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                    </div>
                )
            })}
        </>
    )
}
