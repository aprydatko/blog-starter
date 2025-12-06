import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/services/authService'
import { z } from 'zod'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const user = await registerUser(body)

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                user
            },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation error',
                    errors: error.issues
                },
                { status: 400 }
            )
        }

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: 'An unexpected error occurred'
            },
            { status: 500 }
        )
    }
}
