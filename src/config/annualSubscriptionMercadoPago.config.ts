import { SubscriptionOptions } from "src/enums/subscriptionOptions.enum";

export const BodyToPreaprobalAnnual = {
    reason: `${SubscriptionOptions.ANNUAL} subscription`,
    auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        repetitions: 12,
        transaction_amount: 10,
        currency_id: "MXN",
        free_trial: {
            frequency: 2,
            frequency_type: "months",
        },
    },
    payer_email: 'test_user_992596436@testuser.com',
    back_url: 'https://www.your-app.com/confirmation',
    status: "pending",
    notification_url: 'https://7e60-200-92-174-158.ngrok-free.app/payments/webhook'
    //   start_date: new Date().toISOString(),
    //   end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    }
    
  