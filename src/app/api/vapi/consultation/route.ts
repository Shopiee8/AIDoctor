import { NextRequest, NextResponse } from 'next/server';
import { consultationFlow } from '@/ai/flows/consultation-flow';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Handle Vapi webhook events
        if (body.type === 'function-call') {
            // Handle function calls from Vapi
            const { functionCall } = body;
            
            if (functionCall.name === 'generateSOAPNote') {
                // Use your existing consultation flow
                const transcript = functionCall.parameters.transcript;
                const result = await consultationFlow([
                    { role: 'user', content: transcript }
                ]);
                
                return NextResponse.json({
                    result: result[result.length - 1]
                });
            }
        }

        // Handle other Vapi events
        if (body.type === 'end-of-call-report') {
            // Process end of call
            console.log('Call ended:', body);
            
            // You can save the consultation data here
            // await saveConsultationToFirebase(body);
        }

        return NextResponse.json({ success: true });
        
    } catch (error) {
        console.error('Vapi webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }
}
