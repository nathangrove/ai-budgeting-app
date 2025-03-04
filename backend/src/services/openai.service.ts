import OpenAI from "openai";
import { Email } from "./email.service";
import { IUser } from "models/User";
import accountService from "./account.service";


const PROMPT = `Imagine you are going through financial emails regarding transactions. You're goal is to reconcile with your budget.

Given the attached email, you will extract the following information:
1. Financial Institution the email is from (FINANCIAL_INSTITUTION). Here are the only acceptable values: [FINANCIAL_INSTITUTIONS]
2. An indicator of the account with the financial institution (ACCOUNT). This is likely to be the last 4 digits like a bank account number or credit card number. Hare are the only acceptable values: [ACCOUNT_NUBMERS]
3. The merchant/vendor of the transaction (VENDOR)
4. The amount of the transcation in numerical format with currency signs (AMOUNT)
5. If the information is not present in the email, you will return "undefined" for that field.

You will respond strictly with JSON in the following format. Do not return any other output:

========================================
= RESPONSE FORMAT
========================================
{
  "institution": "[FINANCIAL_INSTITUTION]",
  "account": "[ACCOUNT]",
  "vendor": "[VENDOR]",
  "amount": [AMOUNT]
}
========================================
= END RESPONSE
========================================

========================================
= EMAIL
========================================
Subject: [SUBJECT]
From: [FROM]
Date: [DATE]
[TEXT]
`;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    baseURL: process.env.OPENAI_API_URL ?? 'https://api.openai.com/v1',
});
export const analyzeEmails = async (emails: Email[], user: IUser): Promise<Email[]> => {

    const accounts = await accountService.findAccountsByUserId(user._id as string);
    
    for (const email of emails) {
        try {

            const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL ?? 'gpt-3.5-turbo',
                messages: [ {role: 'user', content: PROMPT
                    .replace('[FINANCIAL_INSTITUTIONS]', accounts.map( a => a.institution).join(', '))
                    .replace('[ACCOUNT_NUMBERS]', accounts.map( a => a.number).join(', '))
                    .replace('[SUBJECT]', email.subject)
                    .replace('[FROM]', email.from)
                    .replace('[DATE]', email.date?.toString())
                    .replace('[TEXT]', email.text)}],
                temperature: 0,
            });

            const result = response.choices[0].message.content;

            try {
                email.analysis = JSON.parse(
                result?.split(`json\n`)[1].replace(/`/g, '') ?? '{}')
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } catch (error) {
            console.error('Error analyzing email:', error);
            throw error;
        }
    }
    return emails;
};
