// src/components/TestConnection.jsx
import { useState, useEffect } from 'react'
import supabase from '../config/supabaseClient'

function TestConnection() {
    const [status, setStatus] = useState('Testing connection...')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function testConnection() {
            try {
                const { data, error } = await supabase
                    .from('test_connection')
                    .select('*')
                    .single()

                if (error) throw error

                setStatus(`Connection successful! Message: ${data.message}`)
                console.log('Connection test successful:', data)
            } catch (error) {
                setStatus(`Connection failed: ${error.message}`)
                console.error('Connection error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        testConnection()
    }, [])

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Database Connection Status</h2>
            {isLoading ? (
                <div className="flex items-center text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Testing connection...
                </div>
            ) : (
                <p className={`text-sm ${status.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                    {status}
                </p>
            )}
        </div>
    )
}

export default TestConnection